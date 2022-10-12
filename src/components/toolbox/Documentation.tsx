import { DefaultButton, Stack, TextField, TooltipHost } from "@fluentui/react";
import * as React from "react";
import { getLogger } from "../../common/utils/InitLogger";
import moduleStyles from "./Documentation.module.scss";

interface IDocumentationProperties {

}

export const Documentation: React.FunctionComponent<IDocumentationProperties> = (props: IDocumentationProperties) => {

    const log = getLogger("Documentation.tsx");

    return(
        <Stack>
            <DefaultButton iconProps={{ iconName: "OpenInNewWindow" }} text="List formatting syntax reference" onClick={() => { window.open("https://learn.microsoft.com/sharepoint/dev/declarative-customization/formatting-syntax-reference"); }} className={moduleStyles.documentationButton} />
            <DefaultButton iconProps={{ iconName: "OpenInNewWindow" }} text="PnP List Formatting Samples" onClick={() => { window.open("https://pnp.github.io/List-Formatting/")}} className={moduleStyles.documentationButton} />
            <DefaultButton iconProps={{ iconName: "OpenInNewWindow" }} text="SPFx Column Formatter solution" onClick={() => { window.open("https://github.com/pnp/sp-dev-solutions/tree/master/solutions/ColumnFormatter")}} className={moduleStyles.documentationButton} />
        </Stack>
    );

}
