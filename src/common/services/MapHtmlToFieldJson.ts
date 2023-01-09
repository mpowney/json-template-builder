import { parse, HTMLElement, TextNode } from 'node-html-parser';
import { AllowedClassNames } from '../utils/AllowedClassNames';
import { IElmType } from '../model/IElmType';
import { getLogger } from "../../common/utils/InitLogger";
import { AllowedAttributes } from '../utils/AllowedAttributes';
import { ISchemaPropertiesRow, ISchemaPropertiesTile } from '../../components/toolbox/Schemas';

export interface IMapHtmlToJsonOptions {
    removeInvalidClassNames?: boolean;
    removeInvalidStyleAttributes?: boolean;
}

export default class MapHtmlToFieldJson {

    public static HtmlNodeToColumnJson(value: string, options?: IMapHtmlToJsonOptions): string {
        const html = parse(value.trim());
        const json = {
            "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
            ...MapHtmlToFieldJson.MapHtmlToJson(html, options)
        }
        return JSON.stringify(json, undefined, 2);
    }

    public static HtmlNodeToRowJson(value: string, options?: IMapHtmlToJsonOptions): string {
        const html = parse(value.trim());
        const json = {
            "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/row-formatting.schema.json",
            "rowFormatter": {
                ...MapHtmlToFieldJson.MapHtmlToJson(html, options)
            }
        }
        return JSON.stringify(json, undefined, 2);
    }

    public static HtmlNodeToTileJson(value: string, options?: IMapHtmlToJsonOptions): string {
        const html = parse(value.trim());
        const json = {
            "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/tile-formatting.schema.json",
            "formatter": {
                ...MapHtmlToFieldJson.MapHtmlToJson(html, options)
            }
        }
        return JSON.stringify(json, undefined, 2);
    }

    public static ImportSchemaProperties(schemaProperties: ISchemaPropertiesRow | ISchemaPropertiesTile | any, workingType: string): any {
        if (schemaProperties) Object.keys(schemaProperties).forEach((key: string) => {
            if (workingType === "row") {
                if (key !== "hideSelection" && key !== "hideColumnHeader" && key !== "hideFooter" && key !== "additionalRowClass") {
                    delete schemaProperties[key];
                }
            }
            if (workingType === "tile") {
                if (key !== "hideSelection" && key !== "height" && key !== "width" && key !== "fillHorizontally") {
                    delete schemaProperties[key];
                }
            }
        });
        return schemaProperties;
    }

    public static MapHtmlToJson(value: HTMLElement, options?: IMapHtmlToJsonOptions): any {

        const log = getLogger("MapHtmlToFieldJson.ts MapHtmlToJson");

        if (!value.tagName) {
            if (value.childNodes.length == 1) {
                return MapHtmlToFieldJson.MapHtmlToJson(value.childNodes[0] as HTMLElement, options);
            }
            return undefined;
        }
        const attributes: any = {
            ...(value.classList.length > 0 && {
                class: Array.from(value.classList.values()).filter(className => { return ((options && options.removeInvalidClassNames) ? AllowedClassNames.includes(className) : true); }).join(" ").trim()
            })
        }
        let hasOtherAttributes = false;
        AllowedAttributes.filter(attr => { return attr !== "class"; }).forEach(attr => {
            const attrValue = value.attributes[attr];
            if (attrValue) {
                attributes[attr] = attrValue;
                hasOtherAttributes = true;
            }
        });

        const valueStyleAttribute = value.attributes["style"];
        const style = MapHtmlToFieldJson.MapStyleAttributes(valueStyleAttribute);
        try {
            const json: any = {
                ...(value.childNodes && value.childNodes.length == 1 && value.childNodes[0] && value.childNodes[0].text && {
                    txtContent: value.childNodes[0].text
                }),
                ...((attributes.class || hasOtherAttributes) && { attributes: attributes }),
                ...(style && { style: style}),
                elmType: (value.tagName.toLowerCase() as IElmType['elmType']),
                ...(value.childNodes && (value.childNodes.length > 1 || (value.childNodes[0] && !value.childNodes[0].text)) && { 
                    children: Array.from(value.childNodes as HTMLElement[])
                                    .map((node: HTMLElement) => MapHtmlToFieldJson.MapHtmlToJson(node, options)).filter(Boolean)
                }),
            }
            return json;
        }
        catch (err: any) {
            log.error(`${value.tagName} error: ${JSON.stringify(err)}`);
            return {}
        }
    }

    public static MapStyleAttributes(value: string): any {
        if (value) {
            const stylePairs = value.split(";");
            const styleArray = stylePairs.map((stylePair: string) => {
                const split = stylePair.split(":");
                if (split.length == 2) {
                    return {
                        [split[0].trim().toLowerCase()]: split[1].trim()
                    }
                }
            }).filter(Boolean);
            return styleArray.reduce((a, v) => { return { ...a, ...v}})
        }
    }

}