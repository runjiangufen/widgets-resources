import { createElement, ReactElement } from "react";
import { SwitchWebContainerProps } from "../typings/SwitchWebProps";
import { executeAction } from "@mendix/piw-utils-internal";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal";
import { Switch } from "./components/Switch";
import "./ui/SwitchWeb.css";

const { confirm } = Modal;
let ischeck = false;
export function SwitchWeb(props: SwitchWebContainerProps): ReactElement {
    const {
        checked,
        disabled,
        autoFocus,
        loadingFlag,
        size,
        onName,
        offName,
        openconfirm,
        confirmType,
        ontitle,
        offtitle,
        confirmokText,
        confirmokType,
        confirmcancelText
    } = props;

    /**
     * 点击变化时回调
     */
    const onChange = (check: boolean): void => {
        ischeck = check;
    };

    // 点击时是否唤起modal弹窗
    const onClick = (): void => {
        const { onChange, onConfirm } = props;

        if (!openconfirm) {
            if (checked) {
                checked.setValue(ischeck);
            }
            executeAction(onChange);
        } else if (confirmType === "modal") {
            confirm({
                title: (checked.value && offtitle?.value) || ontitle?.value,
                icon: <ExclamationCircleOutlined />,
                okText: confirmokText,
                okType: confirmokType,
                cancelText: confirmcancelText,
                onOk() {
                    if (checked) {
                        checked.setValue(ischeck);
                    }
                    executeAction(onChange);
                    executeAction(onConfirm);
                },
                onCancel() {
                    // console.log("Cancel");
                    executeAction(props.onCancel);
                }
            });
        }
    };
    // 确认回调
    const onConfirm = (): void => {
        const { checked, onChange } = props;

        if (checked) {
            checked.setValue(ischeck);
        }
        executeAction(onChange);
        executeAction(props.onConfirm);
    };
    // 取消回调
    const onCancel = (): void => {
        executeAction(props.onCancel);
    };

    return (
        <Switch
            checked={checked?.value || false}
            loadingFlag={loadingFlag?.value || false}
            disabled={disabled?.value || false}
            onName={onName}
            offName={offName}
            autoFocus={autoFocus}
            size={size}
            onClick={onClick}
            onChange={onChange}
            openconfirm={openconfirm}
            confirmType={confirmType}
            ontitle={ontitle?.value}
            offtitle={offtitle?.value}
            confirmokText={confirmokText}
            confirmokType={confirmokType}
            confirmcancelText={confirmcancelText}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
}
