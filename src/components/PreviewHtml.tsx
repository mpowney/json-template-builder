import { getLogger } from "../common/utils/InitLogger";
import moduleStyles from "./PreviewHtml.module.scss";

interface PreviewHtmlProps {
    html?: string;
}

export const PreviewHtml: React.FunctionComponent<PreviewHtmlProps> = (props: PreviewHtmlProps) => {

    const log = getLogger("PreviewHtml.tsx");

    return (<div dangerouslySetInnerHTML={{ __html: props.html || "" }} className={moduleStyles.container} />);

}
