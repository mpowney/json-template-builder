import * as React from "react";
import { Stack, IStyle, Dropdown, IDropdownOption } from "@fluentui/react";
import { ClassNames } from "./toolbox/ClassNames";
import { TagNames } from "./toolbox/TagNames";
import { StyleAttributes } from "./toolbox/StyleAttributes";
import { Documentation } from "./toolbox/Documentation";
import { Variables } from "./toolbox/Variables";
import { Fields } from "./toolbox/Fields";
import { ISchemaPropertiesRow, ISchemaPropertiesTile, Schemas } from "./toolbox/Schemas";

export interface INavigationProps {
    userLoggedIn: boolean;
    schemaProperties?: ISchemaPropertiesRow | ISchemaPropertiesTile;
    setSchemaPropertiesCallback?: (properties: any) => void;
}
export interface INavigationState {
    minimised: boolean;
}

interface INavigationElementStyles {
    mobileMenuIcon: IStyle;
}

export const Navigation: React.FunctionComponent<INavigationProps> = (props: INavigationProps) => {

    const selectedNavigationStorageKey = "JsonTemplates:SelectedNavigation"

    const [ selectedNavigation, setSelectedNavigation ] = React.useState<string>(localStorage.getItem(selectedNavigationStorageKey) || "class");
    const [ schemaProperties, setSchemaProperties ] = React.useState<ISchemaPropertiesRow | ISchemaPropertiesTile | undefined>(props.schemaProperties);

    const onDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        const value = option?.key.toString() || "class";
        localStorage.setItem(selectedNavigationStorageKey, value);
        setSelectedNavigation(value);
    };

    React.useEffect(() => {
        setSchemaProperties(props.schemaProperties);
    }, [ props.schemaProperties ])

    return (
        <Stack>
            <Dropdown 
                onChange={onDropdownChange}
                defaultSelectedKey={selectedNavigation}
                options={[
                    { key: "tag", text: "Tags" },
                    { key: "class", text: "Classes" },
                    { key: "styleAttributes", text: "Style attributes" },
                    { key: "variables", text: "Variables" },
                    { key: "fields", text: "Fields" },
                    { key: "schema", text: "Schema properties" }
                ]} />

            {selectedNavigation == "class" && <ClassNames />}
            {selectedNavigation == "tag" && <TagNames />}
            {selectedNavigation == "styleAttributes" && <StyleAttributes />}
            {selectedNavigation == "variables" && <Variables />}
            {selectedNavigation == "fields" && <Fields />}
            {selectedNavigation == "schema" && <Schemas {...schemaProperties} setSchemaPropertiesCallback={props.setSchemaPropertiesCallback} />}
            <Documentation />
        </Stack>
    )
}

export default Navigation;