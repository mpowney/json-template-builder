import { IAttributes } from "./IAttributes";
import { IOperator } from "./IOperator";
import { IStyle } from "./IStyle";

export interface IElmType extends IOperator {
    elmType: "div" | "span" | "a" | "img" | "svg" | "path" | "button" | "p" | "filepreview";
    txtContent?: string;
    attributes?: IAttributes;
    style?: IStyle;
    children: undefined | IElmType[];
}