import { createElement, ReactNode } from "react";
import { render } from "enzyme";
import CollapseWeb from "../../CollapseWeb";
import { Collapse } from "antd";
import { CollapseWebContainerProps, ExpandIconPositionEnum, CollapsibleEnum } from "../../../typings/CollapseWebProps";
import { PanelWebContainerProps } from "../../../typings/PanelWebProps";
const { Panel } = Collapse;

const COLLAPSIBLE_ENUM: CollapsibleEnum[] = ["header", "disabled"];
const EXPAND_ICON_POSITON_ENUM: ExpandIconPositionEnum[] = ["start", "end"];

describe("CollapseWeb", () => {
    let defaultCollapseWebProps: CollapseWebContainerProps,
        defaultPanelWebProps1: PanelWebContainerProps,
        defaultPanelWebProps2: PanelWebContainerProps;

    beforeEach(() => {
        defaultCollapseWebProps = {
            name: "",
            class: "",
            accordion: false,
            bordered: false,
            collapsible: COLLAPSIBLE_ENUM[0],
            expandIconPosition: EXPAND_ICON_POSITON_ENUM[0],
            ghost: false
        };
        defaultPanelWebProps1 = {
            name: "",
            class: "",
            key: "panel1",
            collapsible: COLLAPSIBLE_ENUM[0],
            forceRender: false,
            showArrow: false,
            header: "title1",
            children: "content1"
        };
        defaultPanelWebProps2 = {
            name: "",
            class: "",
            key: "panel2",
            collapsible: COLLAPSIBLE_ENUM[0],
            forceRender: false,
            showArrow: false,
            header: "title2",
            children: "content2"
        };
    });

    it("renders default collapseWeb", () => {
        const collapseWeb = render(<CollapseWeb {...defaultCollapseWebProps} />);
        expect(collapseWeb).toMatchSnapshot();
    });

    it("renders default collapseWeb and panel", () => {
        const collapseWeb = render(
            <CollapseWeb {...defaultCollapseWebProps}>
                <Panel {...defaultPanelWebProps1} />
                <Panel {...defaultPanelWebProps2} />
            </CollapseWeb>
        );
        expect(collapseWeb.find(".ant-collapse-item").length).toEqual(2);
        expect(collapseWeb).toMatchSnapshot();
    });

    // it("triggers onClick and OnChange function with a click event", () => {
    //     const onChangeAction = actionValue();
    //     const collapseWeb = mount(<CollapseWeb {...defaultCollapseWebProps} onChangeAction={onChangeAction}>
    //         <Panel {...defaultPanelWebProps1} />
    //         <Panel {...defaultPanelWebProps2}/>
    //     </CollapseWeb>);
    //     console.log(collapseWeb.find(".ant-collapse-header"))
    //     collapseWeb.find(".ant-collapse-header").at(0).simulate("click")
    //     expect(onChangeAction.execute).toHaveBeenCalledTimes(1);
    // });

    it("Set the class of collapseWeb", () => {
        const collapseWeb: ReactNode = render(<CollapseWeb {...defaultCollapseWebProps} class="testClass" />);
        expect(collapseWeb).toMatchSnapshot();
    });

    it("Set the bordered of collapseWeb", () => {
        const collapseWeb: ReactNode = render(<CollapseWeb {...defaultCollapseWebProps} bordered={true} />);
        expect(collapseWeb).toMatchSnapshot();
    });

    COLLAPSIBLE_ENUM.map(value => {
        it("Set the collapsible of collapseWeb to " + value, () => {
            const collapseWeb: ReactNode = render(<CollapseWeb {...defaultCollapseWebProps} collapsible={value} />);
            expect(collapseWeb).toMatchSnapshot();
        });
    });

    EXPAND_ICON_POSITON_ENUM.map(value => {
        it("Set the collapsible of collapseWeb to " + value, () => {
            const collapseWeb: ReactNode = render(
                <CollapseWeb {...defaultCollapseWebProps} expandIconPosition={value} />
            );
            expect(collapseWeb).toMatchSnapshot();
        });
    });

    it("Set the ghost of collapseWeb", () => {
        const collapseWeb: ReactNode = render(<CollapseWeb {...defaultCollapseWebProps} ghost={true} />);
        expect(collapseWeb).toMatchSnapshot();
    });
});
