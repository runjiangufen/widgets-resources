/**
 * This file was generated from PanelWeb.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";

export type CollapsibleEnum = "header" | "disabled" | "undefined";

export interface PanelWebContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    children?: ReactNode;
    key: string;
    collapsible: CollapsibleEnum;
    extra?: ReactNode;
    forceRender: boolean;
    header: ReactNode;
    showArrow: boolean;
}

export interface PanelWebPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    children: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    key: string;
    collapsible: CollapsibleEnum;
    extra: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    forceRender: boolean;
    header: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    showArrow: boolean;
}
