import { HTMLElement } from 'node-html-parser';
import { getLogger } from "../../common/utils/InitLogger";
import { AllowedAttributes } from '../utils/AllowedAttributes';
import { KeyAttributes } from 'node-html-parser/dist/nodes/html';

export interface IMapJsonToHtmlOptions {
}

export default class MapJsonToHtml {

    public static MapJsonToHtml(value: any, options?: IMapJsonToHtmlOptions, parentNode: HTMLElement | null = null): HTMLElement | undefined {

        const log = getLogger("MapJsonToHtml.ts MapJsonToHtml");

        if (value['$schema'] === "https://developer.microsoft.com/json-schemas/sp/v2/row-formatting.schema.json" && value.rowFormatter) {
            return MapJsonToHtml.MapJsonToHtml(value.rowFormatter, options);
        }

        if (value.elmType) {
            const rawAttrs = (value.attributes) ? Object.keys(value.attributes)
                                                        .filter(attr => { return AllowedAttributes.indexOf(attr) >= 0 })
                                                        .map(attr => {
                                                            return `${attr}="${value.attributes[attr]}"`
                                                        }).join(" ") : "";

            const keyAttrs: KeyAttributes = { };
            const element: HTMLElement = new HTMLElement(value.elmType, keyAttrs, rawAttrs, parentNode, [0, 0]);
            if (value.children && value.children.length > 0) {
                value.children.forEach((child: any) => {
                    const childElement = MapJsonToHtml.MapJsonToHtml(child, options, element);
                    childElement && element.appendChild(childElement);
                })
            }
            return element;
        }

    }

}