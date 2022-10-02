import React from "react";
import { Dropdown, IDropdownOption, Stack, Text } from "@fluentui/react";
import AceEditor from "react-ace";
import { valid } from 'node-html-parser';
import { getLogger } from "../common/utils/InitLogger";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";

import moduleStyles from "./Editors.module.scss";
import { PreviewHtml } from "./PreviewHtml";
import MapHtmlToFieldJson from "../common/services/MapHtmlToFieldJson";

interface EditorsProps {
}

export const Editors: React.FunctionComponent<EditorsProps> = (props: EditorsProps) => {

    const htmlStorageKey = "JsonTemplates:HTML";
    const workingTypeKey = "JsonTemplates:WorkingType";

    const [ workingHtml, setWorkingHtml ] = React.useState<string | undefined>();
    const [ workingJson, setWorkingJson ] = React.useState<string | undefined>();
    const [ selectedWorkingType, setSelectedWorkingType ] = React.useState<string | undefined | number>(localStorage.getItem(workingTypeKey) || undefined);

    const log = getLogger("Editors.tsx");

    const jsonChange = () => {
        log.debug(`jsonChange executing`);
    }

    const htmlChange = (value: string) => {
        log.debug(`htmlChange executing`);
        setWorkingHtml(value);
    }

    const onOutputTypeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        setSelectedWorkingType(option?.key)
    };

    React.useEffect(() => {

        if (workingHtml && valid(workingHtml)) {
            localStorage.setItem(htmlStorageKey, workingHtml);
            const json = (selectedWorkingType == "row" 
                ? MapHtmlToFieldJson.HtmlNodeToRowJson(workingHtml)
                : selectedWorkingType == "column" 
                ? MapHtmlToFieldJson.HtmlNodeToColumnJson(workingHtml)
                : undefined)
            setWorkingJson(json);
        }

    }, [ workingHtml, selectedWorkingType ]);

    React.useEffect(() => {
        if (selectedWorkingType) {
            localStorage.setItem(workingTypeKey, selectedWorkingType.toString());
        }
        else {
            localStorage.removeItem(workingTypeKey);
        }
    }, [ selectedWorkingType ])

    React.useEffect(() => {

        const preExistingValue = localStorage.getItem(htmlStorageKey);
        if (preExistingValue) {
            setWorkingHtml(preExistingValue);
        }

    }, [] );


    return (<Stack>
        <Stack horizontal>

            <div className={`${moduleStyles.editor}`}>
                <Text variant={"large"} block>HTML</Text>
                <AceEditor
                    width="80rem"
                    mode="html"
                    theme="chrome"
                    onChange={htmlChange}
                    name="htmlEditor"
                    value={workingHtml}
                    editorProps={{ 
                        $blockScrolling: true,
                        $rules: {
                            "start": [{
                                token: "invalid.deprecated",
                                regex: "#.*$"
                            }, {
                                token: "string",
                                regex: '".*?"'
                            }]
                        }}}
                />
            </div>

        </Stack>

        <Stack horizontal>

            <div>
                <PreviewHtml html={workingHtml} />
            </div>

            <div className={`${moduleStyles.editor}`}>
                <Text variant={"large"} block>JSON Template</Text>
                <Dropdown 
                    placeholder={"Select an output type"}
                    options={[
                        { key: "row", text: "Row formatting" },
                        { key: "column", text: "Column formatting" }
                    ]}
                    defaultSelectedKey={selectedWorkingType}
                    onChange={onOutputTypeChange}/>
                <AceEditor
                    mode="json"
                    theme="chrome"
                    onChange={jsonChange}
                    name="jsonEditor"
                    value={workingJson}
                    editorProps={{ $blockScrolling: true }}
                />
            </div>

        </Stack>

    </Stack>);

}