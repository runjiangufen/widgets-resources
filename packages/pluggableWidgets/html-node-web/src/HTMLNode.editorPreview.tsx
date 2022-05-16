import { ReactElement, createElement } from "react";
import { HTMLNodePreviewProps } from "../typings/HTMLNodeProps";
import { UnsafeHTMLRenderer } from "./components/UnsafeHTMLRenderer";
import classNames from "classnames";

export function preview(props: HTMLNodePreviewProps): ReactElement {
    return (
        <UnsafeHTMLRenderer
            className={classNames("widget-html-node", props.className)}
            style={props.styleObject}
            unsafeHTML={"<h4>HTML Node</h4>"}
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/HTMLNode.css");
}
