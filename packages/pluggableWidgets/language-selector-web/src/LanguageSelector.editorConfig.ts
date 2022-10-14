import { StructurePreviewProps } from "@mendix/piw-utils-internal";
import { Properties } from "@mendix/pluggable-widgets-tools";
import { LanguageSelectorPreviewProps } from "typings/LanguageSelectorProps";
import ArrowDark from "./assets/arrow_dark.svg";
import ArrowLight from "./assets/arrow_light.svg";

export function getProperties(__values: LanguageSelectorPreviewProps, defaultValues: Properties): Properties {
    return defaultValues;
}

export function getPreview(__values: LanguageSelectorPreviewProps, isDarkMode: boolean): StructurePreviewProps | null {
    return {
        type: "RowLayout",
        columnSize: "grow", // dynamic column sizes
        children: [
            {
                type: "Text",
                content: "Selected language",
                fontColor: isDarkMode ? "#DEDEDE" : "#899499"
            },
            { type: "Container", grow: 0.001 }, // small space between items
            {
                type: "Container",
                padding: 4,
                children: [
                    {
                        type: "Image",
                        document: decodeURIComponent(
                            (isDarkMode ? ArrowLight : ArrowDark).replace("data:image/svg+xml,", "")
                        ),
                        height: 14
                    }
                ]
            },

            { type: "Container" } // fills space on right
        ]
    };
}
