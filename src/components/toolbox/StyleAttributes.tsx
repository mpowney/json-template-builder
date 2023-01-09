import { Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { AllowedStyleAttributes } from "../../common/utils/AllowedStyleAttributes";
import { CopyToClipboard } from "../../common/utils/CopyToClipboard";
import { getLogger } from "../../common/utils/InitLogger";
import previewModuleStyles from "../PreviewHtml.module.scss";
import moduleStyles from "./StyleAttributes.module.scss";

interface IStyleAttributesProperties {
}

export const StyleAttributes: React.FunctionComponent<IStyleAttributesProperties> = (props: IStyleAttributesProperties) => {

    const classNameFilterStorageKey = "JsonTemplates:StyleAttrbuteFilter";

    const [ classNameFilter, setClassNameFilter ] = React.useState<string>(localStorage.getItem(classNameFilterStorageKey) || "");
    const log = getLogger("StyleAttributes.tsx");

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
                placeholder={"Filter style attributes"} />

            <div className={moduleStyles.container}>
                { AllowedStyleAttributes
                        .filter(className => { return className.toLowerCase().indexOf(classNameFilter.toLowerCase()) > -1; })
                        .sort()
                        .map((styleAttribute: string) => {return (
                            <TooltipHost closeDelay={500} content={`Copy "${styleAttribute}" to clipboard`} key={styleAttribute} calloutProps={calloutProps}>
                                <div
                                    onClick={() => { action(styleAttribute); }} 
                                    className={moduleStyles.classSelection}
                                    >{styleAttribute}:</div>
                            </TooltipHost>
                            
                        )})}
            </div>
        </Stack>
    );

}
