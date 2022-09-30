import * as React from "react";
import { ContextualMenuItemType, DetailsList, DetailsListLayoutMode, IButtonProps, IColumn, Icon, IconButton, IContextualMenuProps, IDetailsListProps, IObjectWithKey, Selection, SelectionMode, Shimmer } from "@fluentui/react";
import { getLogger } from "../common/utils/InitLogger";
import styles from "./InformationDetailsList.module.scss";
import { DateTime, SystemZone } from "luxon";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";


export interface IInformationDetailsListProps extends IDetailsListProps {
    columns: IColumn[];
    dataLoading: boolean;
    menuProps?: IContextualMenuProps;
    onMenuClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, button?: IButtonProps | undefined) => void;
    onSelectionChanged?: (selection?: IObjectWithKey[]) => void;
}
export interface IInformationDetailsListState {
}

export const InformationDetailsList: React.FunctionComponent<IInformationDetailsListProps> = (props: IInformationDetailsListProps) => {

    const log = getLogger("InformationDetailsList.tsx");

    const columnClick = ( ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        log.debug(`columnClick`);
    }

    const renderColumn = (item?: any, index?: number | undefined, column?: IColumn | undefined) => {
        const medianWidth = (column?.maxWidth || 200 - ((column?.minWidth || 100)));
        return props.dataLoading ? 
            <Shimmer width={`${medianWidth + Math.floor(Math.random() * 10)}%`} />
            : renderColumnAsType(item, column)
    }

    const renderColumnAsType = (item?: any, column?: IColumn | undefined) => {
        const menuProps = props.menuProps;
        switch (column?.data) {
            case "datetime": return <>{(column !== undefined) && item && DateTime.fromISO(item[column?.fieldName || ""], { zone: "utc"}).setZone(new SystemZone()).toFormat("ff")}</> 
            case "icon": return <Icon {...getFileTypeIconProps({ extension: item[column?.fieldName || ""]?.substr(item[column?.fieldName || ""].lastIndexOf(".")), size: 16, imageFileType: 'png' }) } />;
            case "menu": return <IconButton 
                                    key={ item.key }
                                    iconProps={{ iconName: "MoreVertical" }} 
                                    onMenuClick={ props.onMenuClick }
                                    styles={{ root: { height: 24 }}}
                                    menuProps={{ ...menuProps, ...{ items: menuProps?.items.map(menuItem => {
                                        return {...menuItem, ...{ data: item }}})
                                    }} as any} />
            default: return <>{(column !== undefined) && item && item[column?.fieldName || ""]}</>
        }
    }

    const itemInvoked = (item?: any, index?: number | undefined, ev?: Event | undefined): void => {
        log.debug(`itemInvoked`);
    }

    const selection = new Selection({
        onSelectionChanged: () => {
            if (props.onSelectionChanged) props.onSelectionChanged(selection.getSelection())
        }
    })

    const allColumnProps = {
        isRowHeader: true,
        isResizable: true,
        sortAscendingAriaLabel: "Sorted A to Z",
        sortDescendingAriaLabel: "Sorted Z to A",
        isPadded: true,
        onColumnClick: columnClick,
        onRender: renderColumn
    };

     return <DetailsList
                {...props}
                compact={false}
                columns={props.columns.map(column => { return { ...allColumnProps, ...column }; })}
                selectionMode={SelectionMode.multiple}
                getKey={(item: any) => item.id}
                setKey="multiple"
                layoutMode={DetailsListLayoutMode.fixedColumns}
                isHeaderVisible
                selection={selection}
                onItemInvoked={itemInvoked}
                enterModalSelectionOnTouch
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="Row checkbox"
            />


}
