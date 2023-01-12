import * as React from "react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import { Editors } from "../components/Editors";
import { PanelHeader } from "../components/PanelHeader";
import { ISchemaPropertiesRow, ISchemaPropertiesTile } from "../components/toolbox/Schemas";

import styles from "./Home.module.scss";

interface IHomeEntryProps {
    schemaProperties?: ISchemaPropertiesRow | ISchemaPropertiesTile;
    setSchemaPropertiesCallback?: (properties: any) => void;
}

export const HomeEntry: React.FunctionComponent<IHomeEntryProps> = (props: IHomeEntryProps) => {

    return (
        <div>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <Outlet />

            <Editors schemaProperties={props.schemaProperties} setSchemaPropertiesCallback={props.setSchemaPropertiesCallback} />
        </div>
    );
}

export default HomeEntry;