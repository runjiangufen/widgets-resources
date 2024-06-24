import { ReactElement, createElement, useCallback } from "react";
import { CollapseWebContainerProps } from "../typings/CollapseWebProps";
import { PanelWebContainerProps } from "../typings/PanelWebProps";
import { executeAction } from "@mendix/piw-utils-internal";
import "./ui/index.css";
import { Collapse } from "antd";
import "antd/lib/collapse/style/css.js";
// import { Icon } from "./components/Icon";
const { Panel } = Collapse;

export default function CollapseWeb(props: CollapseWebContainerProps): ReactElement {
    const {
        accordion,
        bordered,
        collapsible,
        // expandIcon,
        expandIconPosition,
        ghost
    } = props;
    const handlerChangeAction = useCallback(() => executeAction(props.onChangeAction), [props.onChangeAction]);
    return (
        <Collapse
            className={`syy-collapse ${props.class}`}
            style={props.style}
            accordion={accordion}
            bordered={bordered}
            collapsible={collapsible}
            //  图标报错
            // expandIcon={expandIcon && expandIcon.value ? <Icon value={expandIcon.value} empty /> : undefined}
            expandIconPosition={expandIconPosition}
            ghost={ghost}
            onChange={handlerChangeAction}
        >
            {Array.isArray(props.children)
                ? props.children.map(
                      ({ props: childrenProps, key }: { props: PanelWebContainerProps; key: string }) => {
                          return (
                              <Panel
                                  className={childrenProps?.class}
                                  style={childrenProps?.style}
                                  showArrow={childrenProps?.showArrow}
                                  forceRender={childrenProps?.forceRender}
                                  extra={childrenProps?.extra}
                                  collapsible={
                                      childrenProps.collapsible === "undefined" ? undefined : childrenProps.collapsible
                                  }
                                  header={childrenProps?.header}
                                  key={key}
                              >
                                  {childrenProps.children}
                              </Panel>
                          );
                      }
                  )
                : null}
        </Collapse>
    );
}
