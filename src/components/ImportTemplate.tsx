import React from "react";
import { BaseButton, Button, CompoundButton, DefaultButton, DialogFooter, IModalProps, Modal, PrimaryButton, Stack, TextField, Text } from "@fluentui/react";
import Editor from "react-simple-code-editor";
import { getLogger } from "../common/utils/InitLogger";
import Prism from "prismjs";
import moduleStyles from "./ImportTemplate.module.scss";
import MapJsonToHtml from "../common/services/MapJsonToHtml";
import pretty from "pretty";

interface ImportTemplateProps extends IModalProps {
    defaultImportMethod: "url" | "pnp" | "clipboard";
    dismissCallback?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement | BaseButton | Button>;
    setHtmlCallback?: (html: string) => void;
    setWorkingTypeCallback?: (workingType: string | undefined | number) => void;
    setSchemaPropertiesCallback?: (properties: any) => void;
}

export const ImportTemplate: React.FunctionComponent<ImportTemplateProps> = (props: ImportTemplateProps) => {

    const log = getLogger("ImportTemplate.tsx");

    const [ selectedImportMethod, setSelectedImportMethod ] = React.useState<"url" | "pnp" | "clipboard">(props.defaultImportMethod)
    const [ workingJson, setWorkingJson ] = React.useState<string | undefined>();
    const [ validJson, setValidJson ] = React.useState<boolean>(false);

    const jsonChange = (value: string) => {
        log.debug(`jsonChange executing`);
        setWorkingJson(value);
        try {
            const object = JSON.parse(value);
            setValidJson(true);
        }
        catch {
            setValidJson(false);
        }
    }

    React.useEffect(() => {
        setSelectedImportMethod(props.defaultImportMethod)
    }, [ props.defaultImportMethod ]);

    const onImportClick = () => {
        // try {
            const object = JSON.parse(workingJson || "");
            const template = MapJsonToHtml.MapJsonObjectToHtml(object)
            const prettyHtml = pretty(template.html?.outerHTML || "", { unformatted: [], inline: [] } as any)

            const shallowObject = { ...object }
            delete shallowObject.rowFormatter;
            delete shallowObject.formatter;
            delete shallowObject.children;
            delete shallowObject.elmType;
            delete shallowObject.style;
            delete shallowObject.attributes;

            props.setHtmlCallback && props.setHtmlCallback(prettyHtml);
            props.setWorkingTypeCallback && props.setWorkingTypeCallback(template.workingType);
            props.setSchemaPropertiesCallback && props.setSchemaPropertiesCallback( shallowObject );
            props.dismissCallback && props.dismissCallback(undefined as any);

        // }
        // catch (err) {
        //     log.error(JSON.stringify(err));
        // }
        
    }

    return (<Modal {...props}>
        <Stack horizontal>
            <Stack>
                <CompoundButton 
                    secondaryText="Select from the PnP List Formatting gallery" 
                    checked={selectedImportMethod === "pnp"}
                    onClick={() => { setSelectedImportMethod("pnp")}}>
                    From PnP
                </CompoundButton>
                <CompoundButton 
                    secondaryText="Enter the URL to import from" 
                    checked={selectedImportMethod === "url"}
                    onClick={() => { setSelectedImportMethod("url")}}>
                    From URL
                </CompoundButton>
                <CompoundButton 
                    secondaryText="Copy and paste the template's JSON" 
                    checked={selectedImportMethod === "clipboard"}
                    onClick={() => { setSelectedImportMethod("clipboard")}}>
                    From Clipboard
                </CompoundButton>
            </Stack>
            <Stack>
                <TextField label="Enter the URL to import from" />
                <Text variant={"large"} block>Import JSON</Text>
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
        </Stack>
        <DialogFooter styles={{ actionsRight: { paddingRight: "1rem" }}}>
            <DefaultButton text="Cancel" onClick={props.dismissCallback} />
            <PrimaryButton text="Import" onClick={onImportClick} disabled={!validJson} />
        </DialogFooter>
    </Modal>);
}
