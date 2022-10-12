import * as React from "react";
import { Stack, IStyle, Dropdown, IDropdownOption } from "@fluentui/react";
import { ClassNames } from "./toolbox/ClassNames";
import { TagNames } from "./toolbox/TagNames";
import { StyleAttributes } from "./toolbox/StyleAttributes";
import { Documentation } from "./toolbox/Documentation";
import { Variables } from "./toolbox/Variables";

export interface INavigationProps {
    userLoggedIn: boolean;
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

    const onDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        const value = option?.key.toString() || "class";
        localStorage.setItem(selectedNavigationStorageKey, value);
        setSelectedNavigation(value);
    };

    return (
        <Stack>
            <Dropdown 
                onChange={onDropdownChange}
                defaultSelectedKey={selectedNavigation}
                options={[
                    { key: "tag", text: "Tags" },
                    { key: "class", text: "Classes" },
                    { key: "styleAttributes", text: "Style attributes" },
                    { key: "variables", text: "Variables" }
                ]} />

            {selectedNavigation == "class" && <ClassNames />}
            {selectedNavigation == "tag" && <TagNames />}
            {selectedNavigation == "styleAttributes" && <StyleAttributes />}
            {selectedNavigation == "variables" && <Variables />}
            <Documentation />
        </Stack>
    )
}

export default Navigation;