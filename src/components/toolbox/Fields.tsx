import { Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { DefaultFields } from "../../common/utils/DefaultFields";
import { CopyToClipboard } from "../../common/utils/CopyToClipboard";
import { getLogger } from "../../common/utils/InitLogger";
import previewModuleStyles from "../PreviewHtml.module.scss";
import moduleStyles from "./Fields.module.scss";
import { IField } from "../../common/model/IFields";

interface IToolboxProperties {

}

export const Fields: React.FunctionComponent<IToolboxProperties> = (props: IToolboxProperties) => {

    const fieldFilterStorageKey = "JsonTemplates:FieldFilter";

    const [ fieldFilter, setFieldFilter ] = React.useState<string>(localStorage.getItem(fieldFilterStorageKey) || "");
    const log = getLogger("Fields.tsx");

    const onFieldFilterChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
        const value = newValue || "";
        setFieldFilter(value);
        localStorage.setItem(fieldFilterStorageKey, value);
    }

    const calloutProps = {
        className: moduleStyles.tooltipCallout
    }

    const action = (field: string) => {
        CopyToClipboard.copyTextToClipboard(field);
    }

    const enteredFields = DefaultFields;

    return (<Stack className={`${previewModuleStyles.container}`}>
            <TextField 
                value={fieldFilter} 
                onChange={onFieldFilterChange}
                placeholder={"Filter tag names"} />

            <div className={moduleStyles.container}>
                { enteredFields
                        .filter((field: IField) => { return field.name.toLowerCase().indexOf(fieldFilter.toLowerCase()) > -1 || (field.displayName || "").toLowerCase().indexOf(fieldFilter.toLowerCase()) > -1; })
                        .map((field: IField) => {return (
                            <TooltipHost closeDelay={500} content={`Copy "${field}" to clipboard`} key={field.name} calloutProps={calloutProps}>
                                <div
                                    onClick={() => { action(field.name); }} 
                                    className={moduleStyles.tagSelection}
                                    >&lt;{field} /&gt;</div>
                            </TooltipHost>
                            
                        )})}
            </div>
        </Stack>
    );

}
