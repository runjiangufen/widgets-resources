/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { existsSync, readdirSync, promises as fs } from "fs";
import { join } from "path";
import { config } from "dotenv";

config({ path: join(process.cwd(), ".env") });

export async function listDir(path) {
    const entries = await fs.readdir(path, { withFileTypes: true });
    return entries
        .filter(e => e.isFile())
        .map(e => join(path, e.name))
        .concat(...(await Promise.all(entries.filter(e => e.isDirectory()).map(e => listDir(join(path, e.name))))));
}

export const sourcePath = process.cwd();

const widgetPackageJson = require(join(sourcePath, "package.json"));
export const widgetName = widgetPackageJson.widgetName;
export const widgetPackage = widgetPackageJson.packagePath;
export const widgetPath = widgetPackageJson.widgetPath;
export const widgetVersion = widgetPackageJson.version;
if (!widgetName || !widgetPackageJson) {
    throw new Error("Widget does not define widgetName in its package.json");
}

const widgetSrcFiles = readdirSync(join(sourcePath, "src")).map(file => join(sourcePath, "src", file));

let widgetEntry = [
    widgetSrcFiles.filter(file => file.match(new RegExp(`[/\\\\]${escape(widgetName)}\\.[jt]sx?$`, "i")))[0]
];
if (!widgetEntry.length === 0) {
    throw new Error("Cannot find a widget entry file");
}

let editorConfigEntry = [
    widgetSrcFiles.filter(file =>
        file.match(new RegExp(`[/\\\\]${escape(widgetName)}\\.editorConfig\\.[jt]s$`, "i"))
    )[0]
];
let previewEntry = [
    widgetSrcFiles.filter(file =>
        file.match(new RegExp(`[/\\\\]${escape(widgetName)}\\.(webmodeler|editorPreview)\\.[jt]sx?$`, "i"))
    )[0]
];

// Handle multiple file entries
if (widgetPath && widgetPath.length > 0) {
    widgetEntry = widgetPath.map(
        item => widgetSrcFiles.filter(file => file.match(new RegExp(`[/\\\\]${escape(item)}\\.[jt]sx?$`, "i")))[0]
    );
    editorConfigEntry = widgetPath.map(
        item =>
            widgetSrcFiles.filter(file =>
                file.match(new RegExp(`[/\\\\]${escape(item)}\\.editorConfig\\.[jt]s$`, "i"))
            )[0]
    );
    previewEntry = widgetPath.map(
        item =>
            widgetSrcFiles.filter(file =>
                file.match(new RegExp(`[/\\\\]${escape(item)}\\.(webmodeler|editorPreview)\\.[jt]sx?$`, "i"))
            )[0]
    );
}

export { widgetEntry, editorConfigEntry, previewEntry };

export const isTypescript = [widgetEntry, editorConfigEntry, previewEntry].some(file => file && /\.tsx?$/.test(file));

export const projectPath = [
    process.env.MX_PROJECT_PATH,
    widgetPackageJson.config.projectPath,
    join(sourcePath, "tests/testProject")
].filter(path => path && existsSync(path))[0];

function escape(str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}
