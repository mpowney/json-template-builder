import { Checkbox, Dropdown, IDropdownOption, Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { DefaultFields } from "../../common/utils/DefaultFields";
import { CopyToClipboard } from "../../common/utils/CopyToClipboard";
import { getLogger } from "../../common/utils/InitLogger";
import previewModuleStyles from "../PreviewHtml.module.scss";
import moduleStyles from "./Schemas.module.scss";

interface ISchemaToolboxProperties {
}

export interface ISchemaPropertiesRow {
    hideSelection?: boolean;
    hideColumnHeader?: boolean;
    hideFooter?: boolean;
    additionalRowClass?: string;
}

export interface ISchemaPropertiesTile {
    height?: number;
    width?: number;
    hideSelection?: boolean;
    fillHorizontally?: boolean;
}

export const Schemas: React.FunctionComponent<ISchemaToolboxProperties> = (props: ISchemaToolboxProperties) => {

    const selectedSchemaStorageKey = "JsonTemplates:SelectedSchema";
    const schemaSettingsRowStorageKey = "JsonTemplates:SchemaSettings:Row";
    const schemaSettingsTileStorageKey = "JsonTemplates:SchemaSettings:Tile";

    const [ selectedSchema, setSelectedSchema ] = React.useState<string>(localStorage.getItem(selectedSchemaStorageKey) || "row");
    const [ schemaSettingsRow, setSchemaSettingsRow ] = React.useState<ISchemaPropertiesRow>(JSON.parse(localStorage.getItem(schemaSettingsRowStorageKey) || "{}"));
    const [ schemaSettingsTile, setSchemaSettingsTile ] = React.useState<ISchemaPropertiesTile>(JSON.parse(localStorage.getItem(schemaSettingsTileStorageKey) || "{}"));

    const onDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        const value = option?.key.toString() || "row";
        localStorage.setItem(selectedSchemaStorageKey, value);
        setSelectedSchema(value);
    };

    const setPropertyValue = (setObject: ISchemaPropertiesRow | ISchemaPropertiesTile, setFunction: any, property: string, value: any, storageKey: string) => {
        (setObject as any)[property] = value;
        localStorage.setItem(`JsonTemplates:SchemaSettings:${storageKey}`, JSON.stringify(setObject));
        setFunction(setObject);
    }

    const log = getLogger("Schemas.tsx");

    const calloutProps = {
        className: moduleStyles.tooltipCallout
    }

    const enteredFields = DefaultFields;

    return (<Stack className={`${previewModuleStyles.container}`}>
            <Dropdown 
                onChange={onDropdownChange}
                defaultSelectedKey={selectedSchema}
                options={[
                    { key: "row", text: "Row schema" },
                    { key: "tile", text: "Tile schema" }
                ]} />
            <div className={moduleStyles.container}>
                {selectedSchema === "row" && <Stack>
                        <Checkbox defaultChecked={schemaSettingsRow.hideSelection} label="Hide selection" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "hideSelection", checked, "Row") } />
                        <Checkbox defaultChecked={schemaSettingsRow.hideColumnHeader} label="Hide column header" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "hideColumnHeader", checked, "Row") } />
                        <Checkbox defaultChecked={schemaSettingsRow.hideFooter} label="Hide footer" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "hideFooter", checked, "Row") } />
                        <TextField defaultValue={schemaSettingsRow.additionalRowClass || ""} label="Additional row class" onChange={(ev: any, newValue?: string) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "additionalRowClass", newValue, "Row") }  />
                    </Stack>}
                {selectedSchema === "tile" && <Stack>
                        <Checkbox defaultChecked={schemaSettingsTile.hideSelection} label="Hide selection" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "hideSelection", checked, "Tile") } />
                        <Checkbox defaultChecked={schemaSettingsTile.fillHorizontally} label="Fill horizontally" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "fillHorizontally", checked, "Tile") } />
                        <TextField defaultValue={schemaSettingsTile.height?.toString() || ""} label="Height" onChange={(ev: any, newValue?: string) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "height", newValue ? parseInt(newValue) : undefined, "Tile") }  />
                        <TextField defaultValue={schemaSettingsTile.width?.toString() || ""} label="Width" onChange={(ev: any, newValue?: string) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "width", newValue ? parseInt(newValue) : undefined, "Tile") }  />
                    </Stack>}
            </div>
        </Stack>
    );

}
