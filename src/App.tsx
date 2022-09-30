import * as React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";

import theme from "./theme";
import TopBar from "./components/TopBar";
import Navigation from "./components/Navigation";
import { getLogger } from "./common/utils/InitLogger";
import { ThemeProvider, Stack } from "@fluentui/react";

import Home from "./entries/Home";

// import globalStyles from "./assets/styles/global.scss";
import styles from "./App.module.scss";
const log = getLogger("App.tsx");

export const PACKAGE_NAME = "JSON Template Builder for SharePoint";
export const TENANT_NAME = "powney.xyz";
export const TENANT_ID = "dc8659ad-22da-4759-8a7a-97e1606e6be4";
export const CLIENT_ID = "738c6a32-8131-4d3c-a116-7bf4b0c7be11";


export interface IUser {
    loginName: string;
    displayName: string;
}

// Browser App entry
// export default class App extends React.Function<IAppProps, IAppState> {
export const App: React.FunctionComponent = () => {

    const [ userLoggedIn, setUserLoggedIn ] = React.useState<boolean>(false);
    const [ loginModalOpen, setLoginModalOpen ] = React.useState<boolean>(false);
    const [ loginModalRecover, setLoginModalRecover ] = React.useState<boolean>(false);
    const [ processing, setProcessing ] = React.useState<boolean>(false);
    const [ user, setUser ] = React.useState<IUser | null>(null);

    const hideLoginModal = () => {
      setLoginModalOpen(false);
      setLoginModalRecover(false);
    }

    React.useEffect(() => {
        const init = async () => {
            initializeIcons();
            initializeFileTypeIcons();
        }

        init();

    }, []);

    const renderMergedProps = (component: any, ...rest: any[]) => {
        const finalProps = Object.assign({}, ...rest, { user });
        return React.createElement(component, finalProps);
    };


    return (
        <div>
            <ThemeProvider theme={theme}>
                <TopBar 
                    userLoggedIn={userLoggedIn} 
                    user={user} 
                    processing={processing} />
                <Stack horizontal>
                    <Navigation userLoggedIn={userLoggedIn} />
                    <div id={`appContainer`} className={styles.appContainer}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </div>
                </Stack>
            </ThemeProvider>
        </div>
    );
}
