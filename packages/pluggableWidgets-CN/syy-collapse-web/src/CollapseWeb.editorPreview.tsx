import { createElement } from "react";
import { CollapseWebPreviewProps } from "../typings/CollapseWebProps";
import { parseStyle } from "@mendix/piw-utils-internal";
import Collapse from "antd/es/collapse/index";
import "antd/lib/collapse/style/css.js";

declare function require(name: string): string;

export function preview(props: CollapseWebPreviewProps) {
    return <Collapse {...props} style={parseStyle(props.style)} className={`syy-collapse ${props.className}`} />;
}

export function getPreviewCss(): string {
    return require("./ui/index.css");
}
