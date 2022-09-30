import * as React from "react";
import { classNamesFunction, getTheme, Icon, IconButton, IStyle, Modal, PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react";
import { Panel } from "@fluentui/react";

import { getLogger } from "../common/utils/InitLogger";
import { IUser, PACKAGE_NAME } from "../App";
import moduleStyles from "./TopBar.module.scss";
import { UnauthorizedModal } from "./UnauthorizedModal";
import { IRootElementStyles } from "./IRootElementStyles";

const log = getLogger("TopBar.tsx");

interface ITopBarProps {
    userLoggedIn: boolean;
    user: IUser | null;
    processing: boolean;
    loginHandler?: (immediatePopup: boolean) => void;
    logoutHandler?: () => void;
}

interface ITopBarElementStyles {
    userButton: IStyle;
    userSpinner: IStyle;
    accountButton: IStyle;
    packageName: IStyle;
}

export const TopBar: React.FunctionComponent<ITopBarProps> = (props: ITopBarProps) => {

    const [ expanded, setExpanded ] = React.useState<boolean>(false);
    const [ unauthorized, setUnauthorized ] = React.useState<boolean>(false);

    const userButtonClick = () => {
        log.debug(`userButtonClick() executing`);
        setExpanded(true);
    }

    const dismissPanelClick = () => {
        log.debug(`dismissPanelClick() executing`);
        setExpanded(false);
    }

    const startLogin = () => {
        log.debug(`startLogin() executing`);
        props.loginHandler && props.loginHandler(true);
    }

    const logout = () => {
        log.debug(`logout() executing`);
        props.logoutHandler && props.logoutHandler();
        setExpanded(false);
    }

    const unauthorizedLogout = () => {
        props.logoutHandler && props.logoutHandler();
        setUnauthorized(false);
    }


    const theme = getTheme();
    const styles: IRootElementStyles & ITopBarElementStyles = {
        root: {
            backgroundColor: theme.palette.neutralSecondary,
        },
        packageName: {
            color: theme.palette.white
        },
        accountButton: {
            backgroundColor: theme.palette.neutralTertiary,
            color: theme.palette.white
        },
        userButton: {
            backgroundColor: theme.palette.neutralTertiary,
            color: theme.palette.white
        },
        userSpinner: {
            backgroundColor: theme.palette.neutralTertiary,
            color: theme.palette.white,
            padding: '0.5rem'
        }
    }

    const getClassNames = classNamesFunction<ITopBarProps, IRootElementStyles & ITopBarElementStyles>();
    const classNames = getClassNames(styles, props);

    return (
        <div className={`${classNames.root} ${moduleStyles.topBar}`}>
            <div className={`${moduleStyles.packageName} ${classNames.packageName}`}>{ PACKAGE_NAME }</div>
            <div className={`${moduleStyles.accountButton} ${classNames.accountButton}`}>
                { props.processing ?
                    <Spinner size={SpinnerSize.large} className={classNames.userSpinner} />
                    : <IconButton
                        className={classNames.userButton}
                        onClick={userButtonClick}
                        iconProps={{ iconName: props.userLoggedIn ? `UserFollowed` : `UserOptional` }}
                        styles={{ root: { width: 50, height: 50 }, icon: { fontSize: 24 } }} />
                    }

                <Panel
                    headerText={props.userLoggedIn ? `Signed in to ${PACKAGE_NAME}` : `Sign in to ${PACKAGE_NAME}`}
                    isOpen={expanded}
                    onDismiss={dismissPanelClick}
                    closeButtonAriaLabel="Close">

                </Panel>

                <UnauthorizedModal isOpen={unauthorized} user={props.user} logoutHandler={unauthorizedLogout} />

            </div>
        </div>
    );

}

export default TopBar;