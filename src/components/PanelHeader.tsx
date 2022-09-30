import { Stack, Text, getTheme, classNamesFunction } from "@fluentui/react";
import { IRootElementStyles } from "./IRootElementStyles";
import moduleStyles from "./PanelHeader.module.scss";

export interface PanelHeaderProps {
    text: string;
}

export const PanelHeader: React.FunctionComponent<PanelHeaderProps> = (props: PanelHeaderProps) => {

    const theme = getTheme();
    const styles: IRootElementStyles = {
        root: {
            backgroundColor: theme.palette.neutralLighter,
        }
    }

    const getClassNames = classNamesFunction<PanelHeaderProps, IRootElementStyles>();
    const classNames = getClassNames(styles, props);

    return (
        <div className={`${moduleStyles.root} ${classNames.root}`}>
            <Stack tokens={{childrenGap: 6}}>
                <Text variant={"large"}>{props.text}</Text>
            </Stack>
        </div>
    );

}