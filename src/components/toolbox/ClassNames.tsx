import { Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { AllowedClassNames } from "../../common/utils/AllowedClassNames";
import { CopyToClipboard } from "../../common/utils/CopyToClipboard";
import { getLogger } from "../../common/utils/InitLogger";
import previewModuleStyles from "../PreviewHtml.module.scss";
import moduleStyles from "./ClassNames.module.scss";

interface IToolboxProperties {

}

export const ClassNames: React.FunctionComponent<IToolboxProperties> = (props: IToolboxProperties) => {

    const classNameFilterStorageKey = "JsonTemplates:ClassNameFilter";

    const [ classNameFilter, setClassNameFilter ] = React.useState<string>(localStorage.getItem(classNameFilterStorageKey) || "");
    const log = getLogger("ClassNames.tsx");

    const onClassNameFilterChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
        const value = newValue || "";
        setClassNameFilter(value);
        localStorage.setItem(classNameFilterStorageKey, value);
    }

    const calloutProps = {
        className: moduleStyles.tooltipCallout
    }

    const action = (className: string) => {
        CopyToClipboard.copyTextToClipboard(className);
    } 

    return (<Stack className={`${previewModuleStyles.container}`}>
            <TextField 
                value={classNameFilter} 
                onChange={onClassNameFilterChange}
                placeholder={"Filter class names"} />

            <div className={moduleStyles.container}>
                { AllowedClassNames
                        .filter(className => { return className.toLowerCase().indexOf(classNameFilter.toLowerCase()) > -1; })
                        .sort((a, b) => { return a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0 })
                        .map((className: string) => {return (
                            <TooltipHost closeDelay={500} content={`Copy "${className}" to clipboard`} key={className} calloutProps={calloutProps}>
                                <div
                                    onClick={() => { action(className); }} 
                                    className={moduleStyles.classSelection}
                                    >.{className}</div>
                            </TooltipHost>
                            
                        )})}
            </div>
        </Stack>
    );

}
