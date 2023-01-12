import { HTMLElement } from 'node-html-parser';
import { getLogger } from "../../common/utils/InitLogger";
import { AllowedAttributes } from '../utils/AllowedAttributes';
import { KeyAttributes } from 'node-html-parser/dist/nodes/html';
import { AllowedStyleAttributes } from '../utils/AllowedStyleAttributes';
import { AllowedSchemaProperties } from '../utils/AllowedSchemaPropeties';

export interface IMapJsonToHtmlOptions {
}

export interface IHtmlTemplateOutput {
    html: HTMLElement | undefined;
    workingType?: string;
    schemaProperties?: any;
}

export default class MapJsonToHtml {

    public static MapJsonObjectToHtml(value: any, options?: IMapJsonToHtmlOptions, parentNode: HTMLElement | null = null): IHtmlTemplateOutput {

        const log = getLogger("MapJsonToHtml.ts MapJsonToHtml");

        if (value['$schema'] === "https://developer.microsoft.com/json-schemas/sp/v2/row-formatting.schema.json" && value.rowFormatter) {
            return {
                html: MapJsonToHtml.ParseObjectToHtml(value.rowFormatter, options),
                workingType: 'row',
                schemaProperties: MapJsonToHtml.CleanSchemaProperties(value)
            }
        }

        if (value['$schema'] === "https://developer.microsoft.com/json-schemas/sp/v2/tile-formatting.schema.json" && value.formatter) {
            return {
                html: MapJsonToHtml.ParseObjectToHtml(value.formatter, options),
                workingType: 'tile',
                schemaProperties: MapJsonToHtml.CleanSchemaProperties(value)
            }
        }

        if (value['$schema'] === "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json" && value.elmType) {
            return {
                html: MapJsonToHtml.ParseObjectToHtml(value, options),
                workingType: 'column',
            }
        }

        if (value['$schema'] === "https://developer.microsoft.com/json-schemas/sp/v2/view-formatting.schema.json" && value.tileProps?.formatter) {
            return {
                html: MapJsonToHtml.ParseObjectToHtml(value.tileProps.formatter, options),
                workingType: 'tile',
                schemaProperties: { 
                    ...MapJsonToHtml.CleanSchemaProperties(value),
                    ...MapJsonToHtml.CleanSchemaProperties(value.tileProps)
                }
            }
        }

        return {
            html: MapJsonToHtml.ParseObjectToHtml(value, options),
            schemaProperties: MapJsonToHtml.CleanSchemaProperties(value)
        }

    }

    public static CleanSchemaProperties(value: any) {
        const valueSchemaProperties = { ...value };
        Object.keys(valueSchemaProperties).forEach(key => { 
            if (AllowedSchemaProperties.indexOf(key) === -1) {
                delete valueSchemaProperties[key];
            }
        });
        return valueSchemaProperties;
    }

    public static ParseObjectToHtml(value: any, options?: IMapJsonToHtmlOptions, parentNode: HTMLElement | null = null): HTMLElement | undefined {

        const log = getLogger("MapJsonToHtml.ts ParseObjectToHtml");

        if (value.elmType) {
            let rawAttrs = (value.attributes) ? Object.keys(value.attributes)
                                                        .filter(attr => { return AllowedAttributes.indexOf(attr) >= 0 })
                                                        .map(attr => {
                                                            return `${attr}="${value.attributes[attr]}"`
                                                        }).join(" ") : "";
            const keyAttrs: KeyAttributes = { };
            if (value.style) {
                rawAttrs = `${rawAttrs} style="${Object.keys(value.style)
                                                        .filter(styleAttr => { return AllowedStyleAttributes.indexOf(styleAttr) })
                                                        .map(styleAttr => {
                                                            return `${styleAttr}: ${value.style[styleAttr]};`
                                                        }).join(" ")}"`;
            }
            const element: HTMLElement = new HTMLElement(value.elmType, keyAttrs, rawAttrs, parentNode, [0, 0]);
            if (value.children && value.children.length > 0) {
                value.children.forEach((child: any) => {
                    const childElement = MapJsonToHtml.ParseObjectToHtml(child, options, element);
                    childElement && element.appendChild(childElement);
                })
            }
            else {
                if (value.txtContent) {
                    element.set_content(value.txtContent);
                }
            }
            return element;
        }

    }

}