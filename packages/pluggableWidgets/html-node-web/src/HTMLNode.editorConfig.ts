import { AttributeValueTypeEnum, HTMLNodePreviewProps } from "../typings/HTMLNodeProps";
import { hideNestedPropertiesIn, hidePropertiesIn, Problem, Properties } from "@mendix/pluggable-widgets-tools";

type TagAttributeValuePropName = keyof HTMLNodePreviewProps["attributes"][number];

const voidElements = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "source",
    "track",
    "wbr",
    // react specific, it uses `value` prop
    "textarea"
];

const disabledElements = ["script"];

function isValidHtmlTagName(name: string): boolean {
    // rather naive approach that works in most cases
    return /^[a-z_][\w.-]*$/i.test(name);
}

function attributeValuePropsExcept(valueName: TagAttributeValuePropName): TagAttributeValuePropName[] {
    const allPropNames: TagAttributeValuePropName[] = [
        "attributeValueExpression",
        "attributeValueExpressionRepeat",
        "attributeValueTemplate",
        "attributeValueTemplateRepeat"
    ];

    return allPropNames.filter(n => n !== valueName);
}

function attributeValuePropNameFor(
    values: HTMLNodePreviewProps,
    attributeValueType: AttributeValueTypeEnum
): TagAttributeValuePropName {
    switch (true) {
        case attributeValueType === "expression" && values.tagUseRepeat:
            return "attributeValueExpressionRepeat";
        case attributeValueType === "template" && values.tagUseRepeat:
            return "attributeValueTemplateRepeat";
        case attributeValueType === "expression" && !values.tagUseRepeat:
            return "attributeValueExpression";
        case attributeValueType === "template" && !values.tagUseRepeat:
            return "attributeValueTemplate";
        default:
            throw new Error("Unknown attribute value type: " + attributeValueType);
    }
}

function hideAttributeValueProps(values: HTMLNodePreviewProps, defaultProperties: Properties): void {
    values.attributes.forEach((_v, i) => {
        const valuePropToKeep = attributeValuePropNameFor(values, _v.attributeValueType);
        hideNestedPropertiesIn(defaultProperties, values, "attributes", i, attributeValuePropsExcept(valuePropToKeep));
    });
}
function hideEventValueProps(values: HTMLNodePreviewProps, defaultProperties: Properties): void {
    values.events.forEach((_v, i) => {
        hideNestedPropertiesIn(defaultProperties, values, "events", i, [
            values.tagUseRepeat ? "eventAction" : "eventActionRepeat"
        ]);
    });
}

export function getProperties(values: HTMLNodePreviewProps, defaultProperties: Properties): Properties {
    const propsToHide: Array<keyof HTMLNodePreviewProps> = [];

    if (values.tagName !== "__customTag__") {
        propsToHide.push("tagNameCustom");
    }

    if (!values.tagUseRepeat) {
        propsToHide.push("tagContentRepeatDataSource");
    }

    const tagName = values.tagName === "__customTag__" ? values.tagNameCustom : values.tagName;

    if (voidElements.includes(tagName)) {
        // void elements don't allow children, hide all content props and the content mode switch
        propsToHide.push(
            "tagContentMode",
            "tagContentHTML",
            "tagContentContainer",
            "tagContentRepeatHTML",
            "tagContentRepeatContainer"
        );
    } else if (values.tagUseRepeat) {
        // hide non-repeating content props
        propsToHide.push("tagContentHTML", "tagContentContainer");

        if (values.tagContentMode === "innerHTML") {
            propsToHide.push("tagContentRepeatContainer");
        } else {
            propsToHide.push("tagContentRepeatHTML");
        }
    } else {
        // hide repeating content props
        propsToHide.push("tagContentRepeatHTML", "tagContentRepeatContainer");

        if (values.tagContentMode === "innerHTML") {
            propsToHide.push("tagContentContainer");
        } else {
            propsToHide.push("tagContentHTML");
        }
    }

    hidePropertiesIn(defaultProperties, values, propsToHide);
    hideAttributeValueProps(values, defaultProperties);
    hideEventValueProps(values, defaultProperties);

    return defaultProperties;
}

export function check(values: HTMLNodePreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (values.tagName === "__customTag__") {
        if (disabledElements.includes(values.tagNameCustom)) {
            errors.push({
                severity: "error",
                property: "tagNameCustom",
                message: `Tag '${values.tagNameCustom}' is not supported.`
            });
        } else if (!isValidHtmlTagName(values.tagNameCustom)) {
            errors.push({
                severity: "error",
                property: "tagNameCustom",
                message: `Invalid tag name '${values.tagNameCustom}'.`
            });
        }
    }

    if (values.tagUseRepeat && values.tagContentRepeatDataSource === null) {
        // make date source required if set to repeat
        errors.push({
            severity: "error",
            property: "tagContentRepeatDataSource",
            message: "Property 'Data source' is required."
        });
    } else {
        const existingAttributeNames = new Set();
        values.attributes.forEach((attr, i) => {
            if (existingAttributeNames.has(attr.attributeName)) {
                errors.push({
                    severity: "error",
                    property: `attributes/${i + 1}/attributeName`,
                    message: `Attribute with name '${attr.attributeName}' already exists.`
                });
            }
            existingAttributeNames.add(attr.attributeName);

            const attributePropName = attributeValuePropNameFor(values, attr.attributeValueType);
            if (!attr[attributePropName].length) {
                errors.push({
                    severity: "warning",
                    property: `attributes/${i + 1}/${attributePropName}`,
                    message: `Value is not specified for attribute '${attr.attributeName}'.`
                });
            }
        });

        const existingEventNames = new Set();
        values.events.forEach((attr, i) => {
            if (existingEventNames.has(attr.eventName)) {
                errors.push({
                    severity: "error",
                    property: `attributes/${i + 1}/eventName`,
                    message: `Event with name '${attr.eventName}' already exists.`
                });
            }
            existingEventNames.add(attr.eventName);
        });
    }

    return errors;
}
