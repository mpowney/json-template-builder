import { Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { AllowedVariables } from "../../common/utils/AllowedVariables";
import { CopyToClipboard } from "../../common/utils/CopyToClipboard";
import { getLogger } from "../../common/utils/InitLogger";
import previewModuleStyles from "../PreviewHtml.module.scss";
import moduleStyles from "./Variables.module.scss";

interface IToolboxProperties {

}

export const Variables: React.FunctionComponent<IToolboxProperties> = (props: IToolboxProperties) => {

    const variableFilterStorageKey = "JsonTemplates:VariableFilter";

    const [ variableFilter, setVariableFilter ] = React.useState<string>(localStorage.getItem(variableFilterStorageKey) || "");
    const log = getLogger("Variables.tsx");

    const onVariableFilterChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
        const value = newValue || "";
        setVariableFilter(value);
        localStorage.setItem(variableFilterStorageKey, value);
    }

    const calloutProps = {
        className: moduleStyles.tooltipCallout
    }

    const action = (variable: string) => {
        CopyToClipboard.copyTextToClipboard(variable);
    } 

    return (<Stack className={`${previewModuleStyles.container}`}>
            <TextField 
                value={variableFilter} 
                onChange={onVariableFilterChange}
                placeholder={"Filter variables"} />

            <div className={moduleStyles.container}>
                { AllowedVariables
                        .filter(variable => { return variable.toLowerCase().indexOf(variableFilter.toLowerCase()) > -1; })
                        .map((variable: string) => {return (
                            <TooltipHost closeDelay={500} content={`Copy "${variable}" to clipboard`} key={variable} calloutProps={calloutProps}>
                                <div
                                    onClick={() => { action(variable); }} 
                                    className={moduleStyles.variableSelection}
                                    >{variable}</div>
                            </TooltipHost>
                            
                        )})}
            </div>
        </Stack>
    );

}
