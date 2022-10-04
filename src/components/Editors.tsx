import React from "react";
import { Dropdown, IDropdownOption, Stack, Text } from "@fluentui/react";
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
                'class-name': {
                    pattern: /class=([^>]+)/,
                    inside: {
                        'classes': {
                            pattern: /('|"| )+.+('|"| )+/,
                            inside: {
                                'valid-class': new RegExp(`('|"| )(${AllowedClassNames.map(className=>className.replace(".", "")).join("|")})('|"| )`),
                                'invalid-class': /[\w-]+/
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
        <Stack horizontal>

            <div className={`${moduleStyles.editor} ${moduleStyles.htmlEditor}`}>
                <Text variant={"large"} block>HTML</Text>
                {/* <AceEditor
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
                /> */}
                <Editor
                    onValueChange={htmlChange}
                    name="htmlEditor"
                    value={workingHtml || "<div></div>"}
                    highlight={
                        code => Prism.highlight(code, Prism.languages.markup, 'markup')
                    }
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 12,
                    }}
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
                {/* <AceEditor
                    mode="json"
                    theme="chrome"
                    onChange={jsonChange}
                    name="jsonEditor"
                    value={workingJson}
                    editorProps={{ $blockScrolling: true }}
                /> */}
                <Editor
                    onValueChange={jsonChange}
                    name="jsonEditor"
                    value={workingJson || "{}"}
                    highlight={
                        code => Prism.highlight(code, Prism.languages.json, 'json')
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