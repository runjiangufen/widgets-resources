import { ReactElement, createElement } from "react";
import { PopComponent, PopComponentProps } from "./PopComponent";
import { SwitchComponent, SwitchComponentProps } from "./SwitchComponent";

export interface SwitchWebProps extends SwitchComponentProps, PopComponentProps {
    openconfirm?: boolean;
    confirmType?: "pop" | "modal";
    offtitle?: string;
    ontitle?: string;
}

export function Switch(props: SwitchWebProps): ReactElement {
    const {
        checked,
        loadingFlag,
        disabled,
        onName,
        offName,
        autoFocus,
        size,
        onClick,
        onChange,
        onConfirm,
        onCancel,
        openconfirm,
        confirmType,
        confirmcancelText,
        confirmokText,
        confirmokType,
        offtitle,
        ontitle
    } = props;
    const SwitchWebView = (
        <SwitchComponent
            checked={checked}
            loadingFlag={loadingFlag}
            disabled={disabled}
            onName={onName}
            offName={offName}
            autoFocus={autoFocus}
            size={size}
            onClick={onClick}
            onChange={onChange}
        />
    );
    const confirmtitle = (checked && offtitle) || ontitle;
    return (
        <div>
            {openconfirm && confirmType === "pop" ? (
                <PopComponent
                    confirmcancelText={confirmcancelText}
                    confirmokText={confirmokText}
                    confirmokType={confirmokType}
                    confirmtitle={confirmtitle}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                >
                    {SwitchWebView}
                </PopComponent>
            ) : (
                SwitchWebView
            )}
        </div>
    );
}
