/**
 * This file was generated from RateWeb.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, EditableValue } from "mendix";
import { Big } from "big.js";

export interface RateWebContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    value: EditableValue<Big>;
    allowClear: boolean;
    allowHalf: boolean;
    count: number;
    disabled: DynamicValue<boolean>;
    onChange?: ActionValue;
    customWidgetOnChangeValidate: boolean;
}

export interface RateWebPreviewProps {
    readOnly: boolean;
    value: string;
    allowClear: boolean;
    allowHalf: boolean;
    count: number | null;
    disabled: string;
    onChange: {} | null;
    customWidgetOnChangeValidate: boolean;
}
