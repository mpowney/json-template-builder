import { FieldTypes } from "../model/FieldTypes";
import { IField } from "../model/IFields";

export const SampleUsers = [
    { title: "Mark Powney", email: "mark@contoso.onmicrosoft.com" },
    { title: "Kim Kommon", email: "kim.kommon@contoso.onmicrosoft.com" },
    { title: "Julius Ceasar", email: "julius.ceasar@contoso.com" },
]


export const DefaultFields: IField[] = [
    { name: "Title", type: FieldTypes.Text, displayName: "Title", sampleValues: [ "List item title" ] },
    { name: "ContentType", type: FieldTypes.Text, displayName: "Content Type", sampleValues: [ "Item", "Document" ] },
    { name: "ContentTypeId", type: FieldTypes.Text, displayName: "Content Type", sampleValues: [ "0x01", "0x010066B47BDBA0B2394798EA2B1951875A0300F627AA80C046384A8E5D9C7246302565" ] },
    { name: "Author", type: FieldTypes.User, displayName: "Created By", sampleValues: SampleUsers },
    { name: "Editor", type: FieldTypes.User, displayName: "Modified By", sampleValues: SampleUsers },
    { name: "Modified", type: FieldTypes.DateTime, displayName: "Modified", sampleValues: [ new Date(), new Date(2020, 2, 17, 11, 30, 0, 0) ] },
    { name: "Created", type: FieldTypes.DateTime, displayName: "Modified", sampleValues: [ new Date(), new Date(2020, 2, 17, 11, 30, 0, 0) ] },
    { name: "File_x0020_Type", type: FieldTypes.Text, sampleValues: [ "docx", "pdf", "doc", "xls", "mp4", "png" ] },
    { name: "FileRef", type: FieldTypes.Text, sampleValues: [ "/sites/ContosoHome/Lists/Custom list/1_.000", "/sites/ContosoHome/Shared Documents/Document.docx", "/sites/ContosoHome/Shared Documents/Procedure.pdf" ]},
    { name: "FileLeafRef", type: FieldTypes.Text, sampleValues: [ "1_.000", "Document.docx", "Procedure.pdf" ] }
]