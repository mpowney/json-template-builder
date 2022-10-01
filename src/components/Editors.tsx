import React from "react";
import { Stack, Text } from "@fluentui/react";
import AceEditor from "react-ace";
import { getLogger } from "../common/utils/InitLogger";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import moduleStyles from "./Editors.module.scss";
import { PreviewHtml } from "./PreviewHtml";

interface EditorsProps {
}

export const Editors: React.FunctionComponent<EditorsProps> = (props: EditorsProps) => {

    const [ workingHtml, setWorkingHtml ] = React.useState<string>("");

    const log = getLogger("Editors.tsx");

    const jsonChange = () => {
        log.debug(`jsonChange executing`);
    }

    const htmlChange = (value: string) => {
        log.debug(`htmlChange executing`);
        setWorkingHtml(value);
    }

    return (<Stack>
        <Stack horizontal>

            <div className={`${moduleStyles.editor}`}>
                <Text variant={"large"} block>JSON Template</Text>
                <AceEditor
                    mode="json"
                    theme="github"
                    onChange={jsonChange}
                    name="jsonEditor"
                    editorProps={{ $blockScrolling: true }}
                />
            </div>

            <div className={`${moduleStyles.editor}`}>
                <Text variant={"large"} block>HTML</Text>
                <AceEditor
                    width="60rem"
                    mode="html"
                    theme="github"
                    onChange={htmlChange}
                    name="htmlEditor"
                    editorProps={{ $blockScrolling: true }}
                />
            </div>

        </Stack>

        <PreviewHtml html={workingHtml} />

    </Stack>);

}