import { ReactElement, createElement, useCallback } from "react";
import { RateWebContainerProps } from "../typings/RateWebProps";
import { executeAction } from "@mendix/piw-utils-internal";
import { updateAttributeValue } from "@mendix/syy-utils-internal";
import "./ui/index.css";
import Rate from "antd/lib/rate";
import { Big } from "big.js";

export default function AntdRateWeb(props: RateWebContainerProps): ReactElement {
    const {
        allowClear,
        allowHalf,
        // autoFocus,
        count,
        disabled,
        value
    } = props;

    const handlerChangeAction = useCallback(
        (value: number) => {
            updateAttributeValue(props.value, new Big(value));
            executeAction(props.onChange);
        },
        [props.onChange, props.value]
    );

    return (
        <Rate
            allowClear={allowClear}
            allowHalf={allowHalf}
            // autoFocus={autoFocus}
            count={count}
            disabled={disabled && disabled.value}
            value={Number(value.value)}
            onChange={handlerChangeAction}
        />
    );
}
