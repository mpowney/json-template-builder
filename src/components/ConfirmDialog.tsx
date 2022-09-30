import { BaseButton, Button, DefaultButton, Dialog, DialogFooter, IDialogProps, PrimaryButton } from "@fluentui/react";
import * as React from "react";
import { getLogger } from "../common/utils/InitLogger";

interface ConfirmDialogProps extends IDialogProps {
    cancelAction?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement | BaseButton | Button> | undefined
    confirmAction?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement | BaseButton | Button> | undefined
    cancelText: string;
    confirmText: string;
}

export const ConfirmDialog: React.FunctionComponent<React.PropsWithChildren<ConfirmDialogProps>> = (props: React.PropsWithChildren<ConfirmDialogProps>) => {

    const log = getLogger("ConfirmDialog.tsx");
    return (<Dialog
                    {...props}
                    onDismiss={props.cancelAction as any} >
                <DialogFooter>
                    <DefaultButton onClick={props.cancelAction} text={props.cancelText} />
                    <PrimaryButton onClick={props.confirmAction} text={props.confirmText} />
                </DialogFooter>
            </Dialog>
    );

}
