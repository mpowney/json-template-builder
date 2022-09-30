import AceEditor from "react-ace";
import { getLogger } from "../common/utils/InitLogger";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

interface EditorsProps {
}

export const Editors: React.FunctionComponent<React.PropsWithChildren<EditorsProps>> = (props: React.PropsWithChildren<EditorsProps>) => {

    const log = getLogger("Editors.tsx");

    const jsonChange = () => {
        log.debug(`jsonChange executing`);
    }

    return (<div>

        <AceEditor
            mode="json"
            theme="github"
            onChange={jsonChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
        />

    </div>);

}