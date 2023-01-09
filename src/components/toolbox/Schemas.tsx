import { Checkbox, Dropdown, IDropdownOption, Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { DefaultFields } from "../../common/utils/DefaultFields";
import { CopyToClipboard } from "../../common/utils/CopyToClipboard";
import { getLogger } from "../../common/utils/InitLogger";
import previewModuleStyles from "../PreviewHtml.module.scss";
import moduleStyles from "./Schemas.module.scss";

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

interface ISchemaToolboxProperties extends ISchemaPropertiesRow, ISchemaPropertiesTile {
    setSchemaPropertiesCallback?: (properties: any) => void;
}

export const Schemas: React.FunctionComponent<ISchemaToolboxProperties> = (props: ISchemaToolboxProperties) => {

    const selectedSchemaStorageKey = "JsonTemplates:SelectedSchema";
    const schemaSettingsRowStorageKey = "JsonTemplates:SchemaSettings:Row";
    const schemaSettingsTileStorageKey = "JsonTemplates:SchemaSettings:Tile";

    const [ selectedSchema, setSelectedSchema ] = React.useState<string>(localStorage.getItem(selectedSchemaStorageKey) || "row");
    const [ schemaSettingsRow, setSchemaSettingsRow ] = React.useState<ISchemaPropertiesRow>(JSON.parse(localStorage.getItem(schemaSettingsRowStorageKey) || "{}"));
    const [ schemaSettingsTile, setSchemaSettingsTile ] = React.useState<ISchemaPropertiesTile>(JSON.parse(localStorage.getItem(schemaSettingsTileStorageKey) || "{}"));
    const [ showWidthValidation, setShowWidthValidation ] = React.useState<boolean>(false);
    const [ widthValidationMinimumWidth, setWidthValidationMinimumWidth ] = React.useState<number>(0);
    const [ widthValidationMaximumWidth, setWidthValidationMaximumWidth ] = React.useState<number>(0);

    const onDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        const value = option?.key.toString() || "row";
        localStorage.setItem(selectedSchemaStorageKey, value);
        setSelectedSchema(value);
    };

    const setPropertyValue = (setObject: ISchemaPropertiesRow | ISchemaPropertiesTile, setFunction: any, property: string, value: any, storageKey: string) => {
        (setObject as any)[property] = value;
        localStorage.setItem(`JsonTemplates:SchemaSettings:${storageKey}`, JSON.stringify(setObject));
        setFunction(setObject);
        props.setSchemaPropertiesCallback && props.setSchemaPropertiesCallback( {
            ...schemaSettingsRow,
            ...schemaSettingsTile,
            ...setObject
        });
    }

    const log = getLogger("Schemas.tsx");

    const calloutProps = {
        className: moduleStyles.tooltipCallout
    }

    React.useEffect(() => {

        if (schemaSettingsTile.width && schemaSettingsTile.height
            && (schemaSettingsTile.width < schemaSettingsTile.height / 2
            || schemaSettingsTile.width > schemaSettingsTile.height * 3)) {
                setWidthValidationMinimumWidth(schemaSettingsTile.height / 2);
                setWidthValidationMaximumWidth(schemaSettingsTile.height * 3);
                setShowWidthValidation(true);
            }
        else {
            setWidthValidationMinimumWidth(0);
            setWidthValidationMaximumWidth(0);
            setShowWidthValidation(false);
    }

    }, [ schemaSettingsTile, schemaSettingsTile.width, schemaSettingsTile.height ])

    const enteredFields = DefaultFields;

    return (<Stack className={`${moduleStyles.container}`}>
            <Dropdown 
                onChange={onDropdownChange}
                defaultSelectedKey={selectedSchema}
                options={[
                    { key: "row", text: "Row schema" },
                    { key: "tile", text: "Tile schema" }
                ]} />
            <div className={moduleStyles.propertyContainer}>
                {selectedSchema === "row" && <Stack tokens={{ childrenGap: '0.5rem' }}>
                        <Checkbox defaultChecked={schemaSettingsRow.hideSelection} label="Hide selection" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "hideSelection", checked, "Row") } />
                        <Checkbox defaultChecked={schemaSettingsRow.hideColumnHeader} label="Hide column header" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "hideColumnHeader", checked, "Row") } />
                        <Checkbox defaultChecked={schemaSettingsRow.hideFooter} label="Hide footer" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "hideFooter", checked, "Row") } />
                        <TextField defaultValue={schemaSettingsRow.additionalRowClass || ""} label="Additional row class" onChange={(ev: any, newValue?: string) => setPropertyValue(schemaSettingsRow, setSchemaSettingsRow, "additionalRowClass", newValue, "Row") }  />
                    </Stack>}
                {selectedSchema === "tile" && <Stack tokens={{ childrenGap: '0.5rem' }}>
                        <Checkbox defaultChecked={schemaSettingsTile.hideSelection} label="Hide selection" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "hideSelection", checked, "Tile") } />
                        <Checkbox defaultChecked={schemaSettingsTile.fillHorizontally} label="Fill horizontally" onChange={(ev: any, checked?: boolean) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "fillHorizontally", checked, "Tile") } />
                        <TextField suffix="px" className={moduleStyles.pixelTextField} defaultValue={schemaSettingsTile.height?.toString() || ""} label="Height" onChange={(ev: any, newValue?: string) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "height", newValue ? parseInt(newValue) : undefined, "Tile") } />
                        <TextField 
                            suffix="px" 
                            className={moduleStyles.pixelTextField} 
                            defaultValue={schemaSettingsTile.width?.toString() || ""} 
                            label="Width" 
                            errorMessage={showWidthValidation ? `Should be greater than the height value divided by 2, and less than the height value multiplied by 3 (>= ${widthValidationMinimumWidth} and <=${widthValidationMaximumWidth}` : undefined}
                            onChange={(ev: any, newValue?: string) => setPropertyValue(schemaSettingsTile, setSchemaSettingsTile, "width", newValue ? parseInt(newValue) : undefined, "Tile") } />
                    </Stack>}
            </div>
        </Stack>
    );

}
