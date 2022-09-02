/**
 * This file was generated from SwitchWeb.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export type SizeEnum = "default" | "small";

export type ConfirmTypeEnum = "pop" | "modal";

export type ConfirmokTypeEnum = "primary" | "ghost" | "dashed" | "link" | "text" | "default";

export interface SwitchWebContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    checked: EditableValue<boolean>;
    onName: string;
    offName: string;
    loadingFlag?: EditableValue<boolean>;
    disabled?: EditableValue<boolean>;
    size: SizeEnum;
    autoFocus: boolean;
    onChange?: ActionValue;
    openconfirm: boolean;
    confirmType: ConfirmTypeEnum;
    ontitle?: DynamicValue<string>;
    offtitle?: DynamicValue<string>;
    confirmokText: string;
    confirmcancelText: string;
    confirmokType: ConfirmokTypeEnum;
    onConfirm?: ActionValue;
    onCancel?: ActionValue;
}

export interface SwitchWebPreviewProps {
    readOnly: boolean;
    checked: string;
    onName: string;
    offName: string;
    loadingFlag: string;
    disabled: string;
    size: SizeEnum;
    autoFocus: boolean;
    onChange: {} | null;
    openconfirm: boolean;
    confirmType: ConfirmTypeEnum;
    ontitle: string;
    offtitle: string;
    confirmokText: string;
    confirmcancelText: string;
    confirmokType: ConfirmokTypeEnum;
    onConfirm: {} | null;
    onCancel: {} | null;
}
