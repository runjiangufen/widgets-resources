import { SwitchWebPreviewProps } from "../typings/SwitchWebProps";
import { hidePropertiesIn, Properties, transformGroupsIntoTabs } from "@mendix/pluggable-widgets-tools";

export function getProperties(
    values: SwitchWebPreviewProps,
    defaultProperties: Properties,
    platform: "web" | "desktop"
): Properties {
    // 如果不开启操作确认弹窗
    if (!values.openconfirm) {
        hidePropertiesIn(defaultProperties, values, [
            "confirmType",
            "ontitle",
            "offtitle",
            "confirmokText",
            "confirmcancelText",
            "confirmokType",
            "onConfirm",
            "onCancel"
        ]);
    }
    if (platform === "web") {
        transformGroupsIntoTabs(defaultProperties);
    }
    return defaultProperties;
}
