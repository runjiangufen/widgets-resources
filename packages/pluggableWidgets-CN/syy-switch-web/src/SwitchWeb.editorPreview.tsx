import { ReactElement, createElement } from "react";
import { Switch } from "antd";
import { SwitchWebPreviewProps } from "../typings/SwitchWebProps";
// import { Icon } from "./components/Icon";

declare function require(name: string): string;

export function preview(_props: SwitchWebPreviewProps): ReactElement {
    return <Switch className="switch-preview" id="switch-preview" checked />;
}

export function getPreviewCss(): string {
    return require("./ui/SwitchWeb.css");
}
