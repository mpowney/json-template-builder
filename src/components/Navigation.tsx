import * as React from "react";
import { Stack, IStyle, Dropdown, IDropdownOption } from "@fluentui/react";
import { IContextualMenuItem } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react";
import { getLogger } from "../common/utils/InitLogger";
import moduleStyles from "./Navigation.module.scss";
import { useNavigate } from "react-router-dom";
import { IRootElementStyles } from "./IRootElementStyles";
import { ClassNames } from "./toolbox/ClassNames";

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
                    { key: "class", text: "Classes" }
                ]} />

            {selectedNavigation == "class" && <ClassNames />}
        </Stack>
    )
}

export default Navigation;