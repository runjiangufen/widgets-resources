import { createElement } from "react";
import { PanelWebContainerProps } from "../typings/PanelWebProps";
import "./ui/index.css";

export default function PanelWeb(props: PanelWebContainerProps) {
    return <div>{props.children}</div>;
}
