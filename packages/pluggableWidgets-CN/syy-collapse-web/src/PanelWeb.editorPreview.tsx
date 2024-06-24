import { Component, ReactNode, createElement } from "react";
import { parseStyle } from "@mendix/piw-utils-internal";
import { PanelWebPreviewProps } from "../typings/PanelWebProps";
import Panel from "antd/es/collapse/CollapsePanel";
declare function require(name: string): string;

export class preview extends Component<PanelWebPreviewProps> {
    render(): ReactNode {
        const { props } = this;
        return (
            <Panel
                {...props}
                collapsible={props.collapsible === "undefined" ? undefined : props.collapsible}
                style={parseStyle(props.style)}
            />
        );
    }
}

export function getPreviewCss(): string {
    return require("./ui/index.css");
}
