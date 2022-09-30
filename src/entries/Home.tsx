import * as React from "react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import { Editors } from "../components/Editors";
import { PanelHeader } from "../components/PanelHeader";

import styles from "./Home.module.scss";

interface HomeEntryProps {
}

export const HomeEntry: React.FunctionComponent<HomeEntryProps> = () => {

    return (
        <div>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <PanelHeader text="Home" />
            <Outlet />

            <Editors />
        </div>
    );
}

export default HomeEntry;