import React from "react";
import { Checkbox, Dropdown, IDropdownOption, Stack, Text } from "@fluentui/react";
// import AceEditor from "react-ace";
import { valid } from 'node-html-parser';
import { getLogger } from "../common/utils/InitLogger";
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

// import "ace-builds/src-noconflict/mode-json";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/theme-chrome";
// import "ace-builds/src-noconflict/ext-language_tools";

import moduleStyles from "./Editors.module.scss";
import { PreviewHtml } from "./PreviewHtml";
import MapHtmlToFieldJson from "../common/services/MapHtmlToFieldJson";
import { AllowedClassNames } from "../common/utils/AllowedClassNames";

interface EditorsProps {
}

export const Editors: React.FunctionComponent<EditorsProps> = (props: EditorsProps) => {

    const htmlStorageKey = "JsonTemplates:HTML";
    const workingTypeKey = "JsonTemplates:WorkingType";
    const removeInvalidClassNamesKey = "JsonTemplates:RemoveInvalidClassNames";
    const removeInvalidStyleAttributesKey = "JsonTemplates:RemoveInvalidStyleAttributes";

    const [ workingHtml, setWorkingHtml ] = React.useState<string | undefined>();
    const [ workingJson, setWorkingJson ] = React.useState<string | undefined>();
    
    const [ selectedWorkingType, setSelectedWorkingType ] = React.useState<string | undefined | number>(localStorage.getItem(workingTypeKey) || undefined);
    const [ removeInvalidClassNames, setRemoveInvalidClassNames ] = React.useState<boolean>((localStorage.getItem(removeInvalidClassNamesKey) || "false") == "true");
    const [ removeInvalidStyleAttributes, setRemoveInvalidStyleAttributes ] = React.useState<boolean>((localStorage.getItem(removeInvalidStyleAttributesKey) || "false") == "true");

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
                ? MapHtmlToFieldJson.HtmlNodeToRowJson(workingHtml, { removeInvalidClassNames })
                : selectedWorkingType == "column" 
                ? MapHtmlToFieldJson.HtmlNodeToColumnJson(workingHtml)
                : undefined)
            setWorkingJson(json);
        }

    }, [ workingHtml, selectedWorkingType, removeInvalidClassNames, removeInvalidStyleAttributes ]);

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


    Prism.languages.insertBefore('markup', 'tag', {
        'tag': {
            pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
            greedy: true,
            inside: {
                'tag': {
                    pattern: /^<\/?[^\s>\/]+/,
                    inside: {
                        'punctuation': /^<\/?/,
                        'namespace': /^[^\s>\/:]+:/
                    }
                },
                'class-attr-value': {
                    pattern: /class=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        'classes': {
                            pattern: /['"]+[\w- ]+?['"]+?/,
                            inside: {
                                'valid-class': new RegExp(`['" ]+(${AllowedClassNames.map(className=>className).join("|")})`),
                                'invalid-class': {
                                    pattern: /[\w-]+/
                                }
                            }
                        }
                    }
                },
                'special-attr': [],
                'attr-value': {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        'punctuation': [
                            {
                                pattern: /^=/,
                                alias: 'attr-equals'
                            },
                            {
                                pattern: /^(\s*)["']|["']$/,
                                lookbehind: true
                            }
                        ],
                    }
                },
                'punctuation': /\/?>/,
                'attr-name': {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        'namespace': /^[^\s>\/:]+:/
                    }
                }    
            }
        }
    })

    return (<Stack>
        <Stack className={`${moduleStyles.section} ${moduleStyles.htmlSection}`}>

            <Text variant={"large"} block>HTML</Text>
            <div className={`${moduleStyles.editor}`}>
                <Editor
                    onValueChange={htmlChange}
                    name="htmlEditor"
                    value={workingHtml || "<div></div>"}
                    highlight={
                        (code: any) => Prism.highlight(code, Prism.languages.markup, 'markup')
                    }
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 12,
                    }}
                />
            </div>

        </Stack>

        <Stack horizontal className={`${moduleStyles.section} ${moduleStyles.previewSection}`}>

            <div className={moduleStyles.preview}>
                <Text variant={"large"} block>Preview</Text>
                <PreviewHtml html={workingHtml} />
            </div>

        </Stack>

        <Stack className={`${moduleStyles.section} ${moduleStyles.jsonSection}`}>
    
            <Text variant={"large"} block>JSON Template</Text>
            <Dropdown 
                placeholder={"Select an output type"}
                options={[
                    { key: "row", text: "Row formatting" },
                    { key: "column", text: "Column formatting" }
                ]}
                defaultSelectedKey={selectedWorkingType}
                onChange={onOutputTypeChange}/>
            <Checkbox label="Remove invalid class names" checked={removeInvalidClassNames} onChange={( ev: any, checked: boolean | undefined) => { setRemoveInvalidClassNames(checked === true); localStorage.setItem(htmlStorageKey, `${checked === true}`); }} />
            <Checkbox label="Remove invalid style attributes" checked={removeInvalidStyleAttributes} onChange={( ev: any, checked: boolean | undefined) => { setRemoveInvalidStyleAttributes(checked === true); localStorage.setItem(htmlStorageKey, `${checked === true}`); }} />

            <div className={`${moduleStyles.editor}`}>
                <Editor
                    onValueChange={jsonChange}
                    name="jsonEditor"
                    value={workingJson || "{}"}
                    highlight={
                        (code: any) => Prism.highlight(code, Prism.languages.json, 'json')
                    }
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 12,
                    }}
                />
            </div>


        </Stack>

    </Stack>);

}