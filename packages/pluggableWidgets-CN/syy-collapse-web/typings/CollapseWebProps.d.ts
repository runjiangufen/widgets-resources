/**
 * This file was generated from CollapseWeb.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue } from "mendix";

export type CollapsibleEnum = "header" | "disabled";

export type ExpandIconPositionEnum = "start" | "end";

export interface CollapseWebContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    children?: ReactNode;
    accordion: boolean;
    bordered: boolean;
    collapsible: CollapsibleEnum;
    expandIconPosition: ExpandIconPositionEnum;
    ghost: boolean;
    onChangeAction?: ActionValue;
}

export interface CollapseWebPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    children: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    accordion: boolean;
    bordered: boolean;
    collapsible: CollapsibleEnum;
    expandIconPosition: ExpandIconPositionEnum;
    ghost: boolean;
    onChangeAction: {} | null;
}
