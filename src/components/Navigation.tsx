import * as React from "react";
import { Nav, INavLink, INavLinkGroup, getTheme, classNamesFunction, IStyle } from "@fluentui/react";
import { IContextualMenuItem } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react";
import { getLogger } from "../common/utils/InitLogger";
import moduleStyles from "./Navigation.module.scss";
import { useNavigate } from "react-router-dom";
import { IRootElementStyles } from "./IRootElementStyles";

export interface INavigationProps {
    userLoggedIn: boolean;
}
export interface INavigationState {
    minimised: boolean;
}

interface INavigationElementStyles {
    mobileMenuIcon: IStyle;
}

export const Navigation: React.FunctionComponent<INavigationProps> = (props: INavigationProps) => {

    const [ menuItems, setMenuItems ] = React.useState<any[]>([]);
    const [ linkGroups, setLinkGroups ] = React.useState<INavLinkGroup[] | null>(null);
    const menuRef = React.createRef<IContextualMenuItem>();
    const navigate = useNavigate();
    const log = getLogger("Navigation.tsx");

    const menuItemClick = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): boolean => {
        log.debug(`menuItemClick() executed with event target ${ev && ev.target}`);
        navigate((item?.key || window.location.href), { replace: true });
        return true;
    }

    const linkClick = (ev?: React.MouseEvent<HTMLElement, MouseEvent>, item?: INavLink): void => {
        log.debug(`onLinkClick() executed with event ${ev && ev.target}`);
        ev?.preventDefault();
        navigate((item || { url: window.location.href }).url, { replace: true });
        let expansionRequired: string | null = null;
        linkGroups?.forEach(group => {
            if (((item?.url || "").indexOf(group.links[0]?.url || "") > -1) && !group.links[0]?.isExpanded) {
                expansionRequired = group.links[0]?.url;
            }
        });
        if (expansionRequired !== null) {
            setLinkGroups(linkGroups?.map(group => {
                return { ...group, links: group.links.map(link => { 
                    return (link.url === expansionRequired 
                        ? { ...link, isExpanded: true } 
                        : link);
                    })};
            }) || null);
        }
    }
    
    React.useEffect(() => {

        const groups: INavLinkGroup[] = [
            {
                links: [{ key: "Home", name: "Home", url: "/", icon: "Home" }]
            }
        ];
    
        setLinkGroups(groups);

    }, [] );

    React.useEffect(() => {

        const mapLinkToMenuItem = (link: INavLink): IContextualMenuItem => { 
            return { 
                key: link.url, 
                text: link.name, 
                iconName: link.icon, 
                items: link.links && [ { key: link.url, text: `${link.name} home`, onClick: menuItemClick }, ...link.links?.map(mapLinkToMenuItem) ],
                onClick: menuItemClick, 
            }
        };

        const items: any[] = [];
        linkGroups?.forEach(group => { group.links && group.links.forEach(link => { items.push(mapLinkToMenuItem(link))}) });
        setMenuItems(items);

    }, [ linkGroups ])

    const theme = getTheme();
    const styles: IRootElementStyles & INavigationElementStyles = {
        root: {
            borderRightWidth: 1,
            borderRightStyle: 'solid',
            borderRightColor: theme.palette.neutralLight,
            height: 'calc(100vh - 80px)'
        },
        mobileMenuIcon: {
            backgroundColor: theme.palette.neutralSecondaryAlt,
            color: theme.palette.white
        }
    }

    const getClassNames = classNamesFunction<INavigationProps, IRootElementStyles & INavigationElementStyles>();
    const classNames = getClassNames(styles, props);
    
    return (

            <div className={`${moduleStyles.navigation} ${classNames.root}`}>
                <Nav onLinkClick={linkClick}
                    className={moduleStyles.nav}
                    styles={{ root: { width: 280 }, groupContent: { marginBottom: 0 } }}
                    groups={linkGroups}
                />
                <DefaultButton iconProps={{iconName: 'GlobalNavButton'}} className={`${moduleStyles.menu} ${classNames.mobileMenuIcon}`} menuProps={{
                    componentRef: menuRef,
                    shouldFocusOnMount: true,
                    items: menuItems,
                    isBeakVisible: false,
                    onItemClick: menuItemClick,
                }} />
            </div>
        );

}

export default Navigation;