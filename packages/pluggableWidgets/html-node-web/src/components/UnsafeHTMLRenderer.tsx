import { createElement, CSSProperties, ReactElement } from "react";

type UnsafeHTMLRendererProps = {
    className: string;
    style?: CSSProperties;
    unsafeHTML: string;
};

export function UnsafeHTMLRenderer(props: UnsafeHTMLRendererProps): ReactElement {
    return (
        <div className={props.className} style={props.style} dangerouslySetInnerHTML={{ __html: props.unsafeHTML }} />
    );
}
