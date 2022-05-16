import { ReactElement, createElement, useState, useEffect } from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

import { UnsafeHTMLRenderer } from "./components/UnsafeHTMLRenderer";

import { HTMLNodeContainerProps } from "../typings/HTMLNodeProps";

import "./ui/HTMLNode.css";
import classNames from "classnames";

async function sanitizeHTML(unsafeHTML: string) {
    const result = await unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(unsafeHTML);

    console.log(String(result));

    return String(result);
}

export function HTMLNode(props: HTMLNodeContainerProps): ReactElement {
    const [htmlText, setHtmlText] = useState("");

    useEffect(() => {
        if (props.unsafeHTML.status === "available") {
            sanitizeHTML(props.unsafeHTML.value).then(sanitizedHTML => {
                setHtmlText(sanitizedHTML);
            });
        }
    }, [props.unsafeHTML]);

    return (
        <UnsafeHTMLRenderer
            className={classNames("widget-html-node", props.class)}
            style={props.style}
            unsafeHTML={htmlText}
        />
    );
}
