import React from "react";
import { CompoundButton, DefaultButton, DialogFooter, IModalProps, Modal, PrimaryButton, Stack, TextField } from "@fluentui/react";

interface ImportTemplateProps extends IModalProps {
    defaultImportMethod: "url" | "pnp";
}

export const ImportTemplate: React.FunctionComponent<ImportTemplateProps> = (props: ImportTemplateProps) => {

    const [ selectedImportMethod, setSelectedImportMethod ] = React.useState<"url" | "pnp">(props.defaultImportMethod)

    React.useEffect(() => {

    }, [ props.isOpen ])

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
            </Stack>
            <Stack>
                <TextField label="Enter the URL to import from" />
            </Stack>
        </Stack>
        <DialogFooter styles={{ actionsRight: { paddingRight: "1rem" }}}>
            <DefaultButton text="Cancel" onClick={() => {}} />
            <PrimaryButton text="Import" />
        </DialogFooter>
    </Modal>);
}
