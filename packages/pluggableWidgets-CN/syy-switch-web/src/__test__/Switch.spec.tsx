import { createElement } from "react";
import { render, mount } from "enzyme";
// import { SwitchWeb } from "../SwitchWeb";
import { Switch, SwitchWebProps } from "../components/Switch";
import { SwitchComponent } from "../components/SwitchComponent";
// import { PopComponent, PopComponentProps } from "../components/PopComponent";
// import { EditableValueBuilder, actionValue } from "@mendix/piw-utils-internal";
import { ConfirmTypeEnum, ConfirmokTypeEnum } from "../../typings/SwitchWebProps";

interface SwitchWebContainerPropsMore {
    openconfirm: boolean;
    confirmType?: ConfirmTypeEnum;
    confirmtitle?: string;
    confirmokText?: string;
    confirmcancelText?: string;
    confirmokType?: ConfirmokTypeEnum;
    onConfirm?: () => void;
    onCancel?: () => void;
}

describe("SwitchWeb", () => {
    let defaultSwitchProps: SwitchWebProps;
    let popConfirmSwitchProps: SwitchWebContainerPropsMore;
    beforeEach(() => {
        defaultSwitchProps = {
            checked: false,
            openconfirm: false,
            onName: "",
            offName: "",
            size: "default",
            loadingFlag: false,
            autoFocus: false,
            onClick: jest.fn()
        };
        popConfirmSwitchProps = {
            openconfirm: true,
            confirmType: "pop",
            confirmtitle: "Are you sure to delete this task?",
            confirmokText: "Yes",
            confirmcancelText: "No",
            confirmokType: "primary",
            onConfirm: jest.fn(),
            onCancel: jest.fn()
        };
    });

    it("render default switch with false ", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} />);
        expect(switchWrapper).toMatchSnapshot();
    });

    it("render default switch with true", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} checked />);
        expect(switchWrapper).toMatchSnapshot();
    });

    it("render switch disable", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} disabled />);
        expect(switchWrapper).toMatchSnapshot();
    });

    it("when checked is true and onName is setted renders with correct attributes", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} checked onName="On" />);
        // expect(switchButton.find(".ant-switch-inner").text()).toBe("On");
        expect(switchWrapper).toMatchSnapshot();
    });

    it("when checked is false and offName is setted renders with correct attributes", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} offName="Off" />);
        // expect(switchButton.find(".ant-switch-inner").text()).toBe("Off");
        expect(switchWrapper).toMatchSnapshot();
    });

    it("when openconfirm and type is pop renders with correct attributes", () => {
        const switchWrapper = render(<Switch {...defaultSwitchProps} {...popConfirmSwitchProps} />);
        expect(switchWrapper).toMatchSnapshot();
    });

    it("when openconfirm and type is pop renders with correct attributes and title is show", () => {
        const switchWrapper = render(
            <Switch {...defaultSwitchProps} {...popConfirmSwitchProps} confirmtitle="Hello" />
        );
        expect(switchWrapper).toMatchSnapshot();
    });

    it("when openconfirm and type is modal renders with correct attributes", () => {
        const switchWrapper = render(<Switch {...defaultSwitchProps} {...popConfirmSwitchProps} confirmType="modal" />);
        expect(switchWrapper).toMatchSnapshot();
    });

    it("triggers onClick function with a click event", () => {
        const onClick = jest.fn();
        const switchWrapper = mount(<SwitchComponent {...defaultSwitchProps} onClick={onClick} />);
        const button = switchWrapper.find("button");
        button.simulate("click");
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("when checked is true renders with correct attributes", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} checked />);
        expect(switchWrapper.hasClass("ant-switch-checked")).toBe(true);
    });

    it("when checked is false renders with correct attributes", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} />);
        expect(switchWrapper.hasClass("ant-switch-checked")).toBe(false);
    });

    it("when switch is disabled renders with correct attributes", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} checked disabled />);
        expect(switchWrapper.hasClass("ant-switch-disabled")).toBe(true);
    });

    it("when checked is true and onName is ON renders with correct attributes", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} checked onName="ON" />);
        expect(switchWrapper.hasClass("ant-switch-checked")).toBe(true);
        expect(switchWrapper.find("span.ant-switch-inner").text()).toBe("ON");
    });

    it("when checked is false and offName is OFF renders with correct attributes", () => {
        const switchWrapper = render(<SwitchComponent {...defaultSwitchProps} offName="OFF" />);
        expect(switchWrapper.hasClass("ant-switch-checked")).toBe(false);
        expect(switchWrapper.find("span.ant-switch-inner").text()).toBe("OFF");
    });
});

// interface SwitchWebContainerPropsMore extends SwitchWebContainerProps {
//     onClick: () => void;
// }
// describe("SwitchWeb", () => {
//     let switchWrapper: ReactWrapper<SwitchWebContainerProps, any>;
//     let switchComponent: ReactWrapper<SwitchWebProps, any>;
//     let switchButtonComponent: ReactWrapper<SwitchComponentProps, any>;
//     let switchButtonWrapper: ReactWrapper<any, any>;
//     let switchButton: ReactWrapper<any, any>;
//     let pop: ReactWrapper<PopComponentProps, any>;
//     // let modal: ReactWrapper<any, any>;
//     const createAndFindElements = (props: SwitchWebContainerPropsMore): void => {
//         switchWrapper = mount(<SwitchWeb {...props} />);
//         switchComponent = switchWrapper.find(Switch);
//         switchButtonComponent = switchComponent.find(SwitchComponent);
//         switchButtonWrapper = switchButtonComponent.find("Wave").find("Switch");
//         switchButton = switchButtonWrapper.find(".ant-switch");
//         pop = switchComponent.find(PopComponent);
//         // switchButton = switchWrapper.find(Switch);
//         // pop = switchWrapper.find(Popconfirm);
//         // modal = switchWrapper.find(Modal);
//     };
//     const createProps = (props?: Partial<SwitchWebContainerPropsMore>): SwitchWebContainerPropsMore => {
//         const defaultProps: SwitchWebContainerPropsMore = {
//             name: "sYYSwitchWeb",
//             tabIndex: 0,
//             id: "runjian.switchweb.SwitchWeb1",
//             checked: new EditableValueBuilder<boolean>().withValue(false).build(),
//             onName: "",
//             offName: "",
//             size: "default",
//             autoFocus: false,
//             openconfirm: false,
//             confirmType: "pop",
//             confirmokText: "ok",
//             confirmcancelText: "cancel",
//             confirmokType: "primary",
//             onConfirm: undefined,
//             onCancel: undefined,
//             onClick: jest.fn()
//         };

//         return { ...defaultProps, ...props };
//     };

//     it("with editable value renders the structure correctly", () => {
//         createAndFindElements(
//             createProps({
//                 checked: new EditableValueBuilder<boolean>().withValue(false).build()
//             })
//         );

//         expect(switchWrapper).toMatchSnapshot();
//     });

//     it("when openconfirm and type is pop renders with correct attributes", () => {
//         const props = { openconfirm: true, onConfirm: actionValue(), onCancel: actionValue() };
//         createAndFindElements(createProps({ ...props }));
//         switchButton.simulate("click");
//         expect(props.onConfirm.execute).toHaveBeenCalledTimes(1);
//         expect(switchWrapper).toMatchSnapshot();
//     });

//     it("when openconfirm and type is modal renders with correct attributes", () => {
//         const onClick = jest.fn();
//         const Wrapper = mount(<Switch offName="" onName="" loadingFlag={false} onClick={onClick} />);
//         const button = Wrapper.find("button");
//         button.simulate("click");
//         expect(onClick).toHaveBeenCalledTimes(1);
//         // createAndFindElements(createProps({ openconfirm: true, confirmType: "modal" }));
//         // switchButton.simulate("click");
//         // expect(switchWrapper.hasClass("ant-modal-root")).toBe(true);
//         expect(switchWrapper).toMatchSnapshot();
//     });

//     it("when openconfirm and click onComfirm renders with correct attributes", () => {
//         createAndFindElements(createProps({ openconfirm: true }));
//         switchButton.simulate("click");
//         // pop.find("Tooltip").props().onClick("onConfirm");
//         expect(pop).toMatchSnapshot();
//     });

//     it("with tabIndex passed renders correctly", () => {
//         createAndFindElements(createProps({ tabIndex: 1 }));

//         expect(switchWrapper.props().tabIndex).toEqual(1);
//     });

//     // it("without tabIndex passed renders correctly", () => {
//     //     createAndFindElements(createProps({ tabIndex: undefined }));

//     //     expect(switchWrapper.props().tabIndex).toEqual(0);
//     // });

//     describe("when disable", () => {
//         it("renders elements with correct attributes", () => {
//             const props = createProps({
//                 disabled: new EditableValueBuilder<boolean>().withValue(true).build()
//             });

//             createAndFindElements(props);

//             expect(switchButton.hasClass("ant-switch-disabled")).toBe(true);
//         });

//         it("shouldn't change the attributes value", () => {
//             const props = createProps({
//                 disabled: new EditableValueBuilder<boolean>().withValue(true).build()
//             });

//             createAndFindElements(props);
//             switchButton.simulate("click");

//             expect(props.checked.setValue).not.toHaveBeenCalled();
//         });

//         it("shouldn't invoke action", () => {
//             const props = createProps({
//                 disabled: new EditableValueBuilder<boolean>().withValue(true).build(),
//                 onChange: actionValue()
//             });
//             createAndFindElements(props);

//             switchWrapper.simulate("click");

//             expect(props.onChange?.execute).not.toHaveBeenCalled();
//         });
//     });
// });
