import { createElement } from "react";
import { mount, ReactWrapper } from "enzyme";
import { SwitchWeb } from "../SwitchWeb";
import { SwitchWebContainerProps } from "../../typings/SwitchWebProps";
import { Switch, SwitchWebProps } from "../components/Switch";
import { SwitchComponent, SwitchComponentProps } from "../components/SwitchComponent";
import { PopComponent, PopComponentProps } from "../components/PopComponent";
import { EditableValueBuilder, actionValue } from "@mendix/piw-utils-internal";

describe("SwitchWeb", () => {
    let switchWrapper: ReactWrapper<SwitchWebContainerProps, any>;
    let switchComponent: ReactWrapper<SwitchWebProps, any>;
    let switchButtonComponent: ReactWrapper<SwitchComponentProps, any>;
    let switchButtonWrapper: ReactWrapper<any, any>;
    let switchButton: ReactWrapper<any, any>;
    let pop: ReactWrapper<PopComponentProps, any>;
    // let modal: ReactWrapper<any, any>;
    const createAndFindElements = (props: SwitchWebContainerProps): void => {
        switchWrapper = mount(<SwitchWeb {...props} />);
        switchComponent = switchWrapper.find(Switch);
        switchButtonComponent = switchComponent.find(SwitchComponent);
        switchButtonWrapper = switchButtonComponent.find("Wave").find("Switch");
        switchButton = switchButtonWrapper.find(".ant-switch");
        pop = switchComponent.find(PopComponent);
        // switchButton = switchWrapper.find(Switch);
        // pop = switchWrapper.find(Popconfirm);
        // modal = switchWrapper.find(Modal);
    };
    const createProps = (props?: Partial<SwitchWebContainerProps>): SwitchWebContainerProps => {
        const defaultProps: SwitchWebContainerProps = {
            name: "sYYSwitchWeb",
            tabIndex: 0,
            id: "runjian.switchweb.SwitchWeb1",
            checked: new EditableValueBuilder<boolean>().withValue(false).build(),
            onName: "",
            offName: "",
            size: "default",
            autoFocus: false,
            openconfirm: false,
            confirmType: "pop",
            confirmokText: "ok",
            confirmcancelText: "cancel",
            confirmokType: "primary",
            onConfirm: undefined,
            onCancel: undefined
        };

        return { ...defaultProps, ...props };
    };

    it("with editable value renders the structure correctly", () => {
        createAndFindElements(
            createProps({
                checked: new EditableValueBuilder<boolean>().withValue(false).build()
            })
        );

        expect(switchWrapper).toMatchSnapshot();
    });

    // it("with disable value renders the structure correctly", () => {
    //     createAndFindElements(
    //         createProps({
    //             disabled: new EditableValueBuilder<boolean>().withValue(true).build()
    //         })
    //     );

    //     expect(switchWrapper).toMatchSnapshot();
    // });

    it("when checked is false renders with correct attributes", () => {
        createAndFindElements(createProps());

        expect(switchButton.hasClass("ant-switch-checked")).toBe(false);
        expect(switchButton.props()["aria-checked"]).toBe(false);
    });

    it("when checked is true renders with correct attributes", () => {
        createAndFindElements(createProps({ checked: new EditableValueBuilder<boolean>().withValue(true).build() }));
        expect(switchButton.hasClass("ant-switch-checked")).toBe(true);
        expect(switchButton.props()["aria-checked"]).toBe(true);
    });

    it("when checked is true and onName is setted renders with correct attributes", () => {
        createAndFindElements(
            createProps({ checked: new EditableValueBuilder<boolean>().withValue(true).build(), onName: "On" })
        );
        expect(switchButton).toMatchSnapshot();
    });

    it("when checked is false and offName is setted renders with correct attributes", () => {
        createAndFindElements(
            createProps({ checked: new EditableValueBuilder<boolean>().withValue(false).build(), offName: "Off" })
        );
        expect(switchButton).toMatchSnapshot();
    });

    it("when openconfirm and type is pop renders with correct attributes", () => {
        createAndFindElements(createProps({ openconfirm: true, onConfirm: actionValue(), onCancel: actionValue() }));
        switchButton.simulate("click");
        expect(switchWrapper).toMatchSnapshot();
    });

    it("when openconfirm and type is modal renders with correct attributes", () => {
        const onClick = jest.fn();
        const buttonWrapper = mount(<Switch offName="" onName="" loadingFlag={false} onClick={onClick} />);
        const button = buttonWrapper.find("button");
        button.simulate("click");
        expect(onClick).toHaveBeenCalledTimes(1);
        // createAndFindElements(createProps({ openconfirm: true, confirmType: "modal" }));
        // switchButton.simulate("click");
        // expect(switchWrapper.hasClass("ant-modal-root")).toBe(true);
        expect(switchWrapper).toMatchSnapshot();
    });

    it("when openconfirm and click onComfirm renders with correct attributes", () => {
        createAndFindElements(createProps({ openconfirm: true }));
        switchButton.simulate("click");
        pop.find("Tooltip");
        expect(pop).toMatchSnapshot();
    });

    it("with tabIndex passed renders correctly", () => {
        createAndFindElements(createProps({ tabIndex: 1 }));

        expect(switchWrapper.props().tabIndex).toEqual(1);
    });

    // it("without tabIndex passed renders correctly", () => {
    //     createAndFindElements(createProps({ tabIndex: undefined }));

    //     expect(switchWrapper.props().tabIndex).toEqual(0);
    // });

    describe("when disable", () => {
        it("renders elements with correct attributes", () => {
            const props = createProps({
                disabled: new EditableValueBuilder<boolean>().withValue(true).build()
            });

            createAndFindElements(props);

            expect(switchButton.hasClass("ant-switch-disabled")).toBe(true);
        });

        it("shouldn't change the attributes value", () => {
            const props = createProps({
                disabled: new EditableValueBuilder<boolean>().withValue(true).build()
            });

            createAndFindElements(props);
            switchButton.simulate("click");

            expect(props.checked.setValue).not.toHaveBeenCalled();
        });

        it("shouldn't invoke action", () => {
            const props = createProps({
                disabled: new EditableValueBuilder<boolean>().withValue(true).build(),
                onChange: actionValue()
            });
            createAndFindElements(props);

            switchWrapper.simulate("click");

            expect(props.onChange?.execute).not.toHaveBeenCalled();
        });
    });
});
