/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { existsSync } from "fs";
import { join, relative } from "path";
import alias from "@rollup/plugin-alias";
import { getBabelInputPlugin, getBabelOutputPlugin } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "rollup-plugin-re";
import typescript from "@rollup/plugin-typescript";
import { red, yellow, blue } from "ansi-colors";
import postcssImport from "postcss-import";
import postcssUrl from "postcss-url";
import loadConfigFile from "rollup/dist/loadConfigFile";
import clear from "rollup-plugin-clear";
import command from "rollup-plugin-command";
import license from "rollup-plugin-license";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import { cp } from "shelljs";
import { widgetTyping } from "./rollup-plugin-widget-typing";
import {
    editorConfigEntry,
    isTypescript,
    previewEntry,
    projectPath,
    sourcePath,
    widgetEntry,
    widgetName,
    widgetPackage,
    widgetVersion
} from "./shared";
import { copyLicenseFile, createMpkFile, licenseCustomTemplate } from "./helpers/rollup-helper";
import url from "./rollup-plugin-assets";

const outDir = join(sourcePath, "/dist/tmp/widgets/");
const outWidgetDir = join(widgetPackage.replace(/\./g, "/"), widgetName.toLowerCase());
const outWidgetFile = join(outWidgetDir, `${widgetName}`);
const absoluteOutPackageDir = join(outDir, outWidgetDir);
const mpkDir = join(sourcePath, "dist", widgetVersion);
const mpkFile = join(mpkDir, process.env.MPKOUTPUT ? process.env.MPKOUTPUT : `${widgetPackage}.${widgetName}.mpk`);
const assetsDirName = "assets";
const absoluteOutAssetsDir = join(absoluteOutPackageDir, assetsDirName);
const outAssetsDir = join(outWidgetDir, assetsDirName);

function getWidgetName(path = "") {
    const name = path.match(/.*\\(\w*)/)[1];
    const dirPath = join(widgetPackage.replace(/\./g, "/"), name.toLowerCase());

    return {
        dirPath,
        filePath: join(dirPath, `${name}`)
    };
}
/**
 * This function is used by postcss-url.
 * Its main purpose to "adjust" asset path so that
 * after bundling css by studio assets paths stay correct.
 * Adjustment is required because of assets copying -- postcss-url can copy
 * files, but final url will be relative to *destination* file and though
 * will be broken after bundling by studio (pro).
 *
 * Example
 * before: assets/icon.png
 * after: com/mendix/widget/web/accordion/assets/icon.png
 */
const cssUrlTransform = asset =>
    asset.url.startsWith(`${assetsDirName}/`) ? `${outWidgetDir.replace(/\\/g, "/")}/${asset.url}` : asset.url;

export default async args => {
    const production = Boolean(args.configProduction);
    if (!production && projectPath) {
        console.info(blue(`Project Path: ${projectPath}`));
    }

    const result = [];
    if (widgetEntry && widgetEntry.length > 0) {
        widgetEntry.forEach(widget => {
            if (!widget) {
                return;
            }
            const widgetPaths = getWidgetName(widget);
            ["amd", "es"].forEach(outputFormat => {
                result.push({
                    input: widget,
                    output: {
                        format: outputFormat,
                        file: join(outDir, `${widgetPaths.filePath}.${outputFormat === "es" ? "mjs" : "js"}`),
                        sourcemap: !production ? "inline" : false
                    },
                    external: webExternal,
                    plugins: [
                        ...getClientComponentPlugins(),
                        url({
                            include: imagesAndFonts,
                            limit: 0,
                            publicPath: `${join("widgets", outAssetsDir)}/`, // Prefix for the actual import, relative to Mendix web server root
                            destDir: absoluteOutAssetsDir
                        }),
                        postCssPlugin(outputFormat, production),
                        alias({
                            entries: {
                                "react-hot-loader/root": join(__dirname, "hot")
                            }
                        }),
                        ...getCommonPlugins({
                            sourceMaps: !production,
                            extensions,
                            transpile: production,
                            babelConfig: {
                                presets: [["@babel/preset-env", { targets: { safari: "12" } }]],
                                allowAllFormats: true
                            },
                            external: webExternal,
                            licenses: production && outputFormat === "amd"
                        })
                    ],
                    onwarn
                });
            });
        });
    }
    if (previewEntry && previewEntry.length > 0) {
        previewEntry.forEach(widget => {
            if (!widget) {
                return;
            }
            const widgetPaths = getWidgetName(widget);
            result.push({
                input: widget,
                output: {
                    format: "commonjs",
                    file: join(outDir, `${widgetPaths.filePath}.editorPreview.js`),
                    sourcemap: !production ? "inline" : false
                },
                external: editorPreviewExternal,
                plugins: [
                    postcss({
                        extensions: [".css", ".sass", ".scss"],
                        extract: false,
                        inject: true,
                        minimize: production,
                        plugins: [postcssImport(), postcssUrl({ url: "inline" })],
                        sourceMap: !production ? "inline" : false,
                        use: ["sass"]
                    }),
                    ...getCommonPlugins({
                        sourceMaps: !production,
                        extensions,
                        transpile: production,
                        babelConfig: { presets: [["@babel/preset-env", { targets: { safari: "12" } }]] },
                        external: editorPreviewExternal
                    })
                ],
                onwarn
            });
        });
    }

    if (editorConfigEntry && editorConfigEntry.length > 0) {
        editorConfigEntry.forEach(widget => {
            if (!widget) {
                return;
            }
            const widgetPaths = getWidgetName(widget);
            // We target Studio Pro's JS engine that supports only es5 and no source maps
            result.push({
                input: widget,
                output: {
                    format: "commonjs",
                    file: join(outDir, `${widgetPaths.filePath}.editorConfig.js`),
                    sourcemap: false
                },
                external: editorConfigExternal,
                treeshake: { moduleSideEffects: false },
                plugins: [
                    url({ include: ["**/*.svg"], limit: 143360 }), // SVG file size limit of 140 kB
                    ...getCommonPlugins({
                        sourceMaps: false,
                        extensions,
                        transpile: true,
                        babelConfig: { presets: [["@babel/preset-env", { targets: { ie: "11" } }]] },
                        external: editorConfigExternal
                    })
                ],
                onwarn
            });
        });
    }

    const customConfigPath = join(sourcePath, "rollup.config.js");
    if (existsSync(customConfigPath)) {
        const customConfig = await loadConfigFile(customConfigPath, { ...args, configDefaultConfig: result });
        customConfig.warnings.flush();
        return customConfig.options;
    }

    return result;

    function getCommonPlugins(config) {
        return [
            nodeResolve({ preferBuiltins: false, mainFields: ["module", "browser", "main"] }),
            isTypescript
                ? typescript({
                      noEmitOnError: !args.watch,
                      sourceMap: config.sourceMaps,
                      inlineSources: config.sourceMaps,
                      target: "es2019", // we transpile the result with babel anyway, see below
                      exclude: ["**/__tests__/**/*"]
                  })
                : null,
            // Babel can transpile source JS and resulting JS, hence are input/output plugins. The good
            // practice is to do the most of conversions on resulting code, since then we ensure that
            // babel doesn't interfere with `import`s and `require`s used by rollup/commonjs plugin;
            // also resulting code includes generated code that deserve transpilation as well.
            getBabelInputPlugin({
                sourceMaps: config.sourceMaps,
                babelrc: false,
                babelHelpers: "bundled",
                plugins: ["@babel/plugin-proposal-class-properties"],
                overrides: [
                    {
                        test: /node_modules/,
                        plugins: ["@babel/plugin-transform-flow-strip-types", "@babel/plugin-transform-react-jsx"]
                    },
                    {
                        exclude: /node_modules/,
                        plugins: [["@babel/plugin-transform-react-jsx", { pragma: "createElement" }]]
                    }
                ]
            }),
            commonjs({
                extensions: config.extensions,
                transformMixedEsModules: true,
                requireReturnsDefault: "auto",
                ignore: id => (config.external || []).some(value => new RegExp(value).test(id))
            }),
            replace({
                patterns: [
                    {
                        test: "process.env.NODE_ENV",
                        replace: production ? "'production'" : "'development'"
                    }
                ]
            }),
            config.transpile
                ? getBabelOutputPlugin({
                      sourceMaps: config.sourceMaps,
                      babelrc: false,
                      compact: false,
                      ...(config.babelConfig || {})
                  })
                : null,
            image(),
            production ? terser() : null,
            config.licenses
                ? license({
                      thirdParty: {
                          includePrivate: true,
                          output: [
                              {
                                  file: join(outDir, "dependencies.txt")
                              },
                              {
                                  file: join(outDir, "dependencies.json"),
                                  template: licenseCustomTemplate
                              }
                          ]
                      }
                  })
                : null,
            // We need to create .mpk and copy results to test project after bundling is finished.
            // In case of a regular build is it is on `writeBundle` of the last config we define
            // (since rollup processes configs sequentially). But in watch mode rollup re-bundles only
            // configs affected by a change => we cannot know in advance which one will be "the last".
            // So we run the same logic for all configs, letting the last one win.
            command([
                async () => config.licenses && copyLicenseFile(sourcePath, outDir),
                async () =>
                    createMpkFile({
                        mpkDir,
                        mpkFile,
                        widgetTmpDir: outDir,
                        isProduction: production,
                        mxProjectPath: projectPath,
                        deploymentPath: "deployment/web/widgets"
                    })
            ])
        ];
    }

    function getClientComponentPlugins() {
        return [
            isTypescript ? widgetTyping({ sourceDir: join(sourcePath, "src") }) : null,
            clear({ targets: [outDir, mpkDir] }),
            command([
                () => {
                    cp(join(sourcePath, "src/**/*.xml"), outDir);
                    if (existsSync(`src/${widgetName}.icon.png`) || existsSync(`src/${widgetName}.tile.png`)) {
                        cp(join(sourcePath, `src/${widgetName}.@(tile|icon)?(.dark).png`), outDir);
                    }
                }
            ]),
            args.watch && !production && projectPath ? livereload() : null
        ];
    }

    function onwarn(warning) {
        const description =
            (warning.plugin ? `(${warning.plugin} plugin) ` : "") +
            (warning.loc
                ? `${relative(sourcePath, warning.loc.file)} (${warning.loc.line}:${warning.loc.column}) `
                : "") +
            `Error: ${warning.message}` +
            (warning.frame ? warning.frame : "");

        // Many rollup warnings are indication of some critical issue, so we should treat them as errors,
        // except a short white-list which we know is safe _and_ not easily fixable.
        if (["CIRCULAR_DEPENDENCY", "THIS_IS_UNDEFINED", "UNUSED_EXTERNAL_IMPORT"].includes(warning.code)) {
            // console.warn(yellow(description));
        } else if (args.watch) {
            // Do not break watch mode because of an error. Also don't use console.error, since it is overwritten by rollup
            console.warn(red(description));
        } else {
            console.error(red(description));
            process.exit(1);
        }
    }
};

const extensions = [".js", ".jsx", ".tsx", ".ts"];
const imagesAndFonts = [
    "**/*.svg",
    "**/*.png",
    "**/*.jp(e)?g",
    "**/*.gif",
    "**/*.webp",
    "**/*.ttf",
    "**/*.woff(2)?",
    "**/*.eot"
];

const commonExternalLibs = [
    // "mendix" and internals under "mendix/"
    /^mendix($|\/)/,

    // "react"
    /^react$/,

    // "react/jsx-runtime"
    /^react\/jsx-runtime$/,

    // "react-dom"
    /^react-dom$/
];

const webExternal = commonExternalLibs.concat(/^big.js$/);

const editorPreviewExternal = commonExternalLibs;

const editorConfigExternal = commonExternalLibs;

export function postCssPlugin(outputFormat, production, postcssPlugins = []) {
    return postcss({
        extensions: [".css", ".sass", ".scss"],
        extract: outputFormat === "amd",
        inject: false,
        minimize: production,
        plugins: [
            postcssImport(),
            /**
             * We need two copies of postcss-url because of final styles bundling in studio (pro).
             * On line below, we just copying assets to widget bundle directory (com.mendix.widgets...)
             * To make it work, this plugin have few requirements:
             * 1. You should put your assets in src/assets/
             * 2. You should use relative path in your .scss files (e.g. url(../assets/icon.png)
             * 3. This plugin relies on `to` property of postcss plugin and it should be present, when
             * copying files to destination.
             */
            postcssUrl({ url: "copy", assetsPath: "assets" }),
            /**
             * This instance of postcss-url is just for adjusting asset path.
             * Check doc comment for *createCssUrlTransform* for explanation.
             */
            postcssUrl({ url: cssUrlTransform }),
            ...postcssPlugins
        ],
        sourceMap: !production ? "inline" : false,
        use: ["sass"],
        to: join(outDir, `${outWidgetFile}.css`)
    });
}
