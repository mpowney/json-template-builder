import { classNamesFunction, getTheme, IStyle } from "@fluentui/react";
import * as React from "react";
import { getLogger } from "../common/utils/InitLogger";
import { IRootElementStyles } from "./IRootElementStyles";

interface DropZoneProps {
    disableFiles?: boolean;
    disableItems?: boolean;
    fileDropped?: (file: File) => void;
}

interface IDropZoneStyles {
    dragActive: IStyle;
    dragPrevented: IStyle;
    dragBox: IStyle;
}

export const DropZone: React.FunctionComponent<React.PropsWithChildren<DropZoneProps>> = (props: React.PropsWithChildren<DropZoneProps>) => {

    const [ dragActive, setDragActive ] = React.useState<boolean>(false);
    const [ dragPrevented, setDragPrevented ] = React.useState<boolean>(false);
    // const dragRef = React.createRef<HTMLDivElement>();
    const theme = getTheme();
    const log = getLogger("DropZone.tsx");

    const styles: IDropZoneStyles & IRootElementStyles = {
        root: {
            position: 'relative',
        },
        dragBox: {
            border: `3px dotted transparent`,
        },
        dragActive: {
            borderColor: theme.palette.neutralDark
        },
        dragPrevented: {
            position: "absolute",
            top: `3px`,
            left: `3px`,
            width: "calc(100% - 6px)",
            height: "calc(100% - 6px)",
            backgroundColor: theme.palette.neutralLight,
            opacity: "0.8"
        }
    }

    const getClassNames = classNamesFunction<DropZoneProps, IDropZoneStyles & IRootElementStyles>();
    const classNames = getClassNames(styles, props);

    const dragOver: React.DragEventHandler<HTMLDivElement> = (event: React.DragEvent<HTMLDivElement>) => {
        setDragActive(true)
        if (event.dataTransfer.items) {
            let [ totalCount, fileCount, itemCount ] = getItemsCount(event.dataTransfer.items);
            if (fileCount > 0 && !!props.disableFiles) {
                setDragPrevented(true);
            }
            if (itemCount > 0 && !!props.disableItems) {
                setDragPrevented(true);
            }
        }
        event.preventDefault();
    }

    const dragLeave: React.DragEventHandler<HTMLDivElement> = (event: React.DragEvent<HTMLDivElement>) => {
        setDragActive(false);
        setDragPrevented(false);
        event.preventDefault();
    }

    const dragEnd: React.DragEventHandler<HTMLDivElement> = (event: React.DragEvent<HTMLDivElement>) => {
        setDragActive(false);
        setDragPrevented(false);
        event.preventDefault();
    }

    const getDropAsString: FunctionStringCallback = (data: string) => {
        log.debug(`getDropAsString: ${data}`);
    }

    const getItemsCount = (items: DataTransferItemList) => {
        let itemCount: number = 0;
        let fileCount: number = 0;
        let totalCount: number = 0;
        for (let i: number = 0; i < items.length; i++) {
            totalCount++;
            if (items[i].kind == "string") itemCount++;
            if (items[i].kind == "file") fileCount++;
        }
        return [ totalCount, fileCount, itemCount ];
    }

    const dragDrop: React.DragEventHandler<HTMLDivElement> = (event: React.DragEvent<HTMLDivElement>) => {
        if (event.dataTransfer.items) {
            log.debug(`dragDrop items`);
            for (let i: number = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind == "file") {
                    const file: File | null = event.dataTransfer.items[i].getAsFile();
                    if (file && props.fileDropped) props.fileDropped(file);
                }
            }
        }
        setDragActive(false);
        setDragPrevented(false);
        event.preventDefault();
    }

    return (
        <div className={classNames.root}>
            <div 
                onDragOver={dragOver} 
                onDragLeave={dragLeave} 
                onDragExit={dragEnd} 
                onDrop={dragDrop} 
                className={`${classNames.dragBox} ${dragActive && !dragPrevented && classNames.dragActive}`}>
                    {!!props.children && props.children}
            </div>
        </div>
    );

}
