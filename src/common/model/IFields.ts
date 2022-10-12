import { FieldTypes } from "./FieldTypes";

export interface IField {
    name: string;
    type: FieldTypes;
    displayName?: string;
    sampleValues?: any[];
}
