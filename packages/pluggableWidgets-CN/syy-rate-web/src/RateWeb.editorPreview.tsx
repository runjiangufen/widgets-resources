import { createElement, ReactElement } from "react";
import { RateWebPreviewProps } from "../typings/RateWebProps";
import Rate from "antd/es/rate";
declare function require(name: string): string;

export function preview(props: RateWebPreviewProps): ReactElement {
    return (
        <Rate
            {...props}
            disabled={Boolean(props.disabled)}
            count={Number(props.count)}
            onChange={void Function.prototype}
            value={Number(props.value)}
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/index.css");
}
