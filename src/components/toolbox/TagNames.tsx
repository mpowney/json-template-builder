import { Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { AllowedTagNames } from "../../common/utils/AllowedTagNames";
import { CopyToClipboard } from "../../common/utils/CopyToClipboard";
import { getLogger } from "../../common/utils/InitLogger";
import previewModuleStyles from "../PreviewHtml.module.scss";
import moduleStyles from "./TagNames.module.scss";

interface IToolboxProperties {

}

export const TagNames: React.FunctionComponent<IToolboxProperties> = (props: IToolboxProperties) => {

    const tagNameFilterStorageKey = "JsonTemplates:TagNameFilter";

    const [ tagNameFilter, setTagNameFilter ] = React.useState<string>(localStorage.getItem(tagNameFilterStorageKey) || "");
    const log = getLogger("TagNames.tsx");

    const onTagNameFilterChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
        const value = newValue || "";
        setTagNameFilter(value);
        localStorage.setItem(tagNameFilterStorageKey, value);
    }

    const calloutProps = {
        className: moduleStyles.tooltipCallout
    }

    const action = (tagName: string) => {
        CopyToClipboard.copyTextToClipboard(tagName);
    } 

    return (<Stack className={`${previewModuleStyles.container}`}>
            <TextField 
                value={tagNameFilter} 
                onChange={onTagNameFilterChange}
                placeholder={"Filter tag names"} />

            <div className={moduleStyles.container}>
                { AllowedTagNames
                        .filter(tagName => { return tagName.toLowerCase().indexOf(tagNameFilter.toLowerCase()) > -1; })
                        .map((tagName: string) => {return (
                            <TooltipHost closeDelay={500} content={`Copy "${tagName}" to clipboard`} key={tagName} calloutProps={calloutProps}>
                                <div
                                    onClick={() => { action(tagName); }} 
                                    className={moduleStyles.tagSelection}
                                    >&lt;{tagName} /&gt;</div>
                            </TooltipHost>
                            
                        )})}
            </div>
        </Stack>
    );

}
