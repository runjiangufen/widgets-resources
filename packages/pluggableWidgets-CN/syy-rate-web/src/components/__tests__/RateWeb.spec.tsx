import { createElement } from "react";
import { render } from "enzyme";
import RateWeb from "../../RateWeb";
import { RateWebContainerProps } from "../../../typings/RateWebProps";
import Big from "big.js";
import { EditableValueBuilder, dynamicValue } from "@mendix/piw-utils-internal";

describe("RateWeb", () => {
    let defaultProps: RateWebContainerProps;

    beforeEach(() => {
        defaultProps = {
            name: "",
            id: "",
            value: new EditableValueBuilder<Big>().withValue(new Big(1)).build(),
            allowClear: false,
            allowHalf: false,
            count: 5,
            disabled: dynamicValue<boolean>(false),
            customWidgetOnChangeValidate: false
        };
    });

    it("renders default RateWeb", () => {
        const rateWeb = render(<RateWeb {...defaultProps} />);
        expect(rateWeb.find(".ant-rate-star-full")).toHaveLength(1);
        expect(rateWeb.find(".ant-rate-star")).toHaveLength(5);
        expect(rateWeb.find(".ant-rate-star-half")).toHaveLength(0);
    });

    it("Set the value of rateWeb", () => {
        const rateWeb = render(
            <RateWeb {...defaultProps} value={new EditableValueBuilder<Big>().withValue(new Big(5)).build()} />
        );
        expect(rateWeb.find(".ant-rate-star-full")).toHaveLength(5);
        expect(rateWeb.find(".ant-rate-star")).toHaveLength(5);
        expect(rateWeb.find(".ant-rate-star-half")).toHaveLength(0);
    });

    it("Set the allowClear of rateWeb", () => {
        const rateWeb = render(<RateWeb {...defaultProps} allowClear={true} />);
        // expect(rateWeb.find(".ant-rate-star-full")).toHaveLength(1);
        // expect(rateWeb.find(".ant-rate-star-half")).toHaveLength(0);
        // expect(rateWeb.find(".ant-rate-star")).toHaveLength(5);
        // rateWeb.find(".ant-rate-star-first").at(1).simulate("click");
        // expect(rateWeb.render().find(".ant-rate-star-full")).toHaveLength(0);
        // expect(rateWeb.render().find(".ant-rate-star-half")).toHaveLength(0);
        expect(rateWeb).toMatchSnapshot();
    });

    it("Set the allowHalf of rateWeb", () => {
        const rateWeb = render(
            <RateWeb
                {...defaultProps}
                value={new EditableValueBuilder<Big>().withValue(new Big(3.5)).build()}
                allowHalf={true}
            />
        );
        expect(rateWeb.find(".ant-rate-star-full")).toHaveLength(3);
        expect(rateWeb.find(".ant-rate-star")).toHaveLength(5);
        expect(rateWeb.find(".ant-rate-star-half")).toHaveLength(1);
    });

    it("Set the count of rateWeb", () => {
        const rateWeb = render(<RateWeb {...defaultProps} count={3} />);
        expect(rateWeb.find(".ant-rate-star-full")).toHaveLength(1);
        expect(rateWeb.find(".ant-rate-star")).toHaveLength(3);
        expect(rateWeb.find(".ant-rate-star-half")).toHaveLength(0);
    });

    it("Set the disabled of rateWeb", () => {
        const rateWeb = render(<RateWeb {...defaultProps} disabled={dynamicValue<boolean>(true)} />);
        expect(rateWeb.attr("class")).toBe("ant-rate ant-rate-disabled");
    });

    it("Set the customWidgetOnChangeValidate of rateWeb", () => {
        const rateWeb = render(<RateWeb {...defaultProps} customWidgetOnChangeValidate={true} />);
        expect(rateWeb).toMatchSnapshot();
    });
});
