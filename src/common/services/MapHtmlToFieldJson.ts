import { parse, HTMLElement, TextNode } from 'node-html-parser';
import { AllowedClassNames } from '../utils/AllowedClassNames';
import { IElmType } from './IElmType';

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

    public static MapHtmlToJson(value: HTMLElement, options?: IMapHtmlToJsonOptions): any {
        if (!value.tagName) {
            if (value.childNodes.length == 1) {
                return MapHtmlToFieldJson.MapHtmlToJson(value.childNodes[0] as HTMLElement, options);
            }
            return undefined;
        }
        const attributes = {
            ...(value.classList.length > 0 && {
                class: Array.from(value.classList.values()).filter(className => { return ((options && options.removeInvalidClassNames) ? AllowedClassNames.includes(className) : true); }).join(" ").trim()
            })
        }
        const valueStyleAttribute = value.attributes["style"];
        const style = MapHtmlToFieldJson.MapStyleAttributes(valueStyleAttribute);
        try {
            const json: any = {
                ...(value.childNodes && value.childNodes.length == 1 && value.childNodes[0].text && {
                    txtContent: value.childNodes[0].text
                }),
                ...(attributes.class && { attributes: attributes }),
                ...(style && { style: style}),
                elmType: (value.tagName.toLowerCase() as IElmType['elmType']),
                ...(value.childNodes && (value.childNodes.length > 1 || !value.childNodes[0].text) && { 
                    children: Array.from(value.childNodes as HTMLElement[])
                                    .map((node: HTMLElement) => MapHtmlToFieldJson.MapHtmlToJson(node, options)).filter(Boolean)
                }),
            }
            return json;
        }
        catch {
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