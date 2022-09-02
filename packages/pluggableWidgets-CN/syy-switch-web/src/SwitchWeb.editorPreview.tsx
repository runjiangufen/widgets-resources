import { ReactElement, createElement } from "react";
import { SwitchWebPreviewProps } from "../typings/SwitchWebProps";
// import { Icon } from "./components/Icon";

declare function require(name: string): string;

export function preview(_props: SwitchWebPreviewProps): ReactElement {
    return (
        <label className="switch">
            <div className="switch-container switch-container-checked"></div>
        </label>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SwitchWeb.css");
}
