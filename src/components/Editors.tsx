import React from "react";
import { BaseButton, Button, CommandBar, CommandBarButton, ICommandBarItemProps, IContextualMenuItem, IDropdownOption, Stack, Text } from "@fluentui/react";
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
import { AllowedTagNames } from "../common/utils/AllowedTagNames";
import { AllowedStyleAttributes } from "../common/utils/AllowedStyleAttributes";
import { ImportTemplate } from "./ImportTemplate";

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

    const [ importModalOpen, setImportModalOpen ] = React.useState<boolean>(false);
    const [ importMethod, setImportMethod ] = React.useState<"url" | "pnp">("url");

    const log = getLogger("Editors.tsx");

    const jsonChange = () => {
        log.debug(`jsonChange executing`);
    }

    const htmlChange = (value: string) => {
        log.debug(`htmlChange executing`);
        setWorkingHtml(value);
    }

    const onOutputTypeChange = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | React.FormEvent<HTMLDivElement> | undefined, option?: IContextualMenuItem | IDropdownOption<any> | undefined, index?: number | undefined) => {
        setSelectedWorkingType(option?.key)
    };

    const onImportTemplateClick =  (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | React.FormEvent<HTMLDivElement> | undefined, option?: IContextualMenuItem | IDropdownOption<any> | undefined, index?: number | undefined) => {
        if (option?.key) {
            setImportMethod(option?.key as "pnp" | "url");
            setImportModalOpen(true);
        }
    }

    React.useEffect(() => {

        if (workingHtml && valid(workingHtml)) {
            localStorage.setItem(htmlStorageKey, workingHtml);
            const json = (selectedWorkingType == "row" 
                ? MapHtmlToFieldJson.HtmlNodeToRowJson(workingHtml, { removeInvalidClassNames })
                : selectedWorkingType == "column" 
                ? MapHtmlToFieldJson.HtmlNodeToColumnJson(workingHtml, { removeInvalidClassNames })
                : selectedWorkingType == "tile" 
                ? MapHtmlToFieldJson.HtmlNodeToTileJson(workingHtml, { removeInvalidClassNames })
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

    const cancelCallback: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement | BaseButton | Button> = () => {
        setImportModalOpen(false);
    }

    const setHtmlCallback = (html: string) => {
        setWorkingHtml(html);
    }

    const jsonCommandBarItems: ICommandBarItemProps[] = [
        {
            key: 'import',
            text: 'Import template',
            subMenuProps: {
                onItemClick: onImportTemplateClick,
                items: [
                    { key: 'pnp', text: 'PnP List Formatting project ...', iconProps: { iconName: 'GiftboxOpen' }, },
                    { key: 'url', text: 'Enter URL ...', iconProps: { iconName: 'Link' }, },
                ]
            }
        },
        {
            key: 'formatOptions',
            text: `Schema: ${selectedWorkingType === "row" ? "Row" : selectedWorkingType === "column" ? "Column" : selectedWorkingType === "tile" ? "Tile" : "(none)" }`,
            iconProps: { iconName: 'FileTemplate' },
            subMenuProps: {
                onItemClick: onOutputTypeChange,
                items: [
                    { key: 'row', text: 'Row formatting' },
                    { key: 'column', text: 'Column formatting' },
                    { key: 'tile', text: 'Tile formatting' },
                ],
            },
        },
        {
            key: 'invalidClassNames',
            commandBarButtonAs: () => { return <CommandBarButton 
                                                toggle
                                                onClick={() => setRemoveInvalidClassNames(!removeInvalidClassNames)}
                                                text={"Remove invalid class names"}
                                                checked={removeInvalidClassNames} />},
        },
        {
            key: 'invalidStyleAttributes',
            commandBarButtonAs: () => { return <CommandBarButton 
                                                toggle
                                                onClick={() => setRemoveInvalidStyleAttributes(!removeInvalidStyleAttributes)}
                                                text={"Remove invalid style attributes"}
                                                checked={removeInvalidStyleAttributes} />},
        }
    ];


    Prism.languages.insertBefore('markup', 'tag', {
        'tag': {
            pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
            greedy: true,
            inside: {
                'tag': {
                    pattern: /^<\/?[^\s>\/]+/,
                    inside: {
                        'valid-tag': new RegExp(`</?(${AllowedTagNames.map(tagName=>tagName).join("|")})`),
                        'invalid-tag': {
                            pattern: /[\w]+/
                        },
                        'punctuation': /^<\/?/,
                        'namespace': /^[^\s>\/:]+:/
                    }
                },
                'class-attr-value': {
                    pattern: /class=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        'class-attr-name': {
                            pattern: /^class/
                        },
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
                'style-attr-value': {
                    pattern: /style=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        'style-attr-name': {
                            pattern: /^style/
                        },
                        'styles': {
                            pattern: /['"]+[\w-;:%\. ]+?['"]+?/,
                            inside: {
                                'valid-style-attr': {
                                    pattern: new RegExp(`(${AllowedStyleAttributes.map(attrName=>attrName).join("|")})[\\w -:#%\\.\\s]+['"; ]`),
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
                                        ]
                                    }
                                },
                                'invalid-style-attr': {
                                    pattern: /[\w-]+:[\w-:#%\.\s]+;?/
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
            <CommandBar
                items={jsonCommandBarItems}
                ariaLabel="Template actions"
            />
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

        <ImportTemplate 
            isOpen={importModalOpen} 
            defaultImportMethod={importMethod} 
            styles={{ main: { minWidth: "800px", minHeight: "300px" } }}
            setHtmlCallback={setHtmlCallback}
            dismissCallback={cancelCallback} />

    </Stack>);

}