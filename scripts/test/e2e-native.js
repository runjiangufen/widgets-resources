const { execSync } = require("child_process");
const fetch = require("node-fetch");
const { join } = require("path");
const { cat, mkdir, rm, mv, cp } = require("shelljs");
const { pipeline } = require("stream");
const { promisify } = require("util");
const { createWriteStream } = require("fs");
const { readFile } = require("fs/promises");
const { tmpdir } = require("os");

main().catch(e => {
    console.error(e);
    process.exit(-1);
});

async function main() {
    // todo: there is no FORKED envvar. consider using `external-pull-request`.
    const mendixVersion = await getMendixVersion();
    const ghcr = process.env.CI && process.env.FORKED !== "true" ? "ghcr.io/mendix/widgets-resources/" : "";
    const branch = "main";
    const project = "Native-Mobile-Resources";
    const testArchivePath = await getTestProject(`https://github.com/mendix/${project}`, branch);
    const localRoot = process.cwd();
    const testsDir = join(localRoot, "tests");
    const testProjectDir = join(testsDir, "testProject");
    const repoPath = join(testsDir, `Native-Mobile-Resources-${branch}`);

    console.log(`Working with ${project} on branch ${branch}`);

    mkdir("-p", join(localRoot, "tests"));
    execSync(`unzip -o ${testArchivePath} -d ${testsDir}`);
    mv(repoPath, testProjectDir);

    rm("-fr", repoPath);
    rm("-f", testArchivePath);

    const changedPackages = JSON.parse(process.env.CHANGED_PACKAGES.replaceAll("\n", ""));

    execSync(`npx lerna run release --scope "${process.env.CHANGED_PACKAGES_FORMATTED_FOR_LERNA}"`, {
        stdio: "inherit"
    });

    changedPackages.forEach(({ name, location }) => {
        if (["mobile-resources-native", "nanoflow-actions-native"].includes(name)) {
            // for js actions
            const path = name === "mobile-resources-native" ? "nativemobileresources" : "nanoflowcommons";
            const jsActionsPath = `${testProjectDir}/javascriptsource/${path}/actions`;
            rm("-rf", jsActionsPath);
            cp("-r", `${location}/dist`, jsActionsPath);
        } else {
            // for widgets
            // this is acceptable if there's one built version.
            cp(`${location}/dist/**/*.mpk`, `${testProjectDir}/widgets`);
        }
    });

    // When running on CI pull the docker image from Github Container Registry
    if (ghcr) {
        console.log(`Pulling mxbuild docker image from Github Container Registry...`);
        execSync(`docker pull ${ghcr}mxbuild:${mendixVersion}`, { stdio: "inherit" });
    }

    const existingImages = execSync(`docker image ls -q ${ghcr}mxbuild:${mendixVersion}`).toString().trim();
    const scriptsPathLocal = join(localRoot, "packages", "tools", "pluggable-widgets-tools", "scripts");

    if (!existingImages) {
        console.log(`Creating new mxbuild docker image...`);
        execSync(
            `docker build -f ${join(scriptsPathLocal, "mxbuild.Dockerfile")} ` +
                `--build-arg MENDIX_VERSION=${mendixVersion} ` +
                `-t mxbuild:${mendixVersion} ${scriptsPathLocal}`,
            { stdio: "inherit" }
        );
    }

    if (ghcr) {
        console.log(`Pulling mxruntime docker image from Github Container Registry...`);
        execSync(`docker pull ${ghcr}mxruntime:${mendixVersion}`, { stdio: "inherit" });
    }

    const existingRuntimeImages = execSync(`docker image ls -q ${ghcr}mxruntime:${mendixVersion}`).toString().trim();
    if (!existingRuntimeImages) {
        console.log(`Creating new runtime docker image...`);
        execSync(
            `docker build -f ${join(scriptsPathLocal, "runtime.Dockerfile")} ` +
                `--build-arg MENDIX_VERSION=${mendixVersion} ` +
                `-t mxruntime:${mendixVersion} ${scriptsPathLocal}`,
            { stdio: "inherit" }
        );
    }

    let runtimeContainerId;
    let mxbuildContainerId;
    try {
        // Build testProject via mxbuild
        const projectFile = "/source/tests/testProject/NativeComponentsTestProject.mpr";
        mxbuildContainerId = execSync(
            `docker run -p 8083:8083 -i -td -v ${localRoot}:/source --rm ${ghcr}mxbuild:${mendixVersion} bash`
        )
            .toString()
            .trim();

        console.log("Updating widgets with mx util...");
        execSync(
            `docker exec -t ${mxbuildContainerId} bash -c "mx update-widgets --loose-version-check ${projectFile}"`,
            {
                stdio: "inherit"
            }
        );

        console.log("Building project with mxbuild...");
        execSync(`docker exec -t ${mxbuildContainerId} bash -c "mxbuild -o /tmp/automation.mda ${projectFile}"`, {
            stdio: "inherit"
        });
        console.log("All widgets are updated and project .mpr created.");

        console.log("Starting metro...");
        execSync(
            `docker exec -td ${mxbuildContainerId} bash -c "cd /source/tests/testProject/deployment/native && ` +
                `/tmp/mxbuild/modeler/tools/node/node /tmp/mxbuild/modeler/tools/node/node_modules/react-native/local-cli/cli.js ` +
                `start --port '8083' --verbose --config '/source/tests/testProject/deployment/native/metro.config.json' > /source/tests/testProject/deployment/log/packager.txt"`
        );

        await tryReach("Metro bundler", () => fetch("http://localhost:8083/status"));

        console.log("Preheating bundler for Android dev=false minify=true");
        const makeItNativeArguments =
            "?platform=android&dev=false&minify=true&app=com.mendix.developerapp.mx9&modulesOnly=false&runModule=true";

        fetch(`http://localhost:8083/index.bundle${makeItNativeArguments}`)
            .then(async response => {
                const { ok, status, statusText } = response;
                if (ok) {
                    console.log("Preheating done!");
                } else {
                    console.error(`Metro error ${status}: ${statusText}\n${await response.text()}`);
                }
            })
            .catch(e => {
                console.error("Request for index.js from Metro failed.");
                console.error(e);
            });

        const pauseInS = 60;
        let attempts = 10000000;

        for (; attempts > 0; --attempts) {
            try {
                console.log("Reading Metro packager file...");

                const file = (await readFile(join(testProjectDir, "deployment", "log", "packager.txt"))).toString();
                if (new RegExp(/BUNDLE[\s]+.\/index.js/).test(file)) {
                    break;
                }
            } catch (e) {
                console.error(e);
            }
            console.log(`Log line not found, pausing ${pauseInS} seconds...`);

            await new Promise(resolve => setTimeout(resolve, pauseInS * 1000));
        }

        if (attempts === 0) {
            throw new Error("Did not create Metro bundle ");
        }

        console.log("Metro bundle created!");

        // await tryReach(
        //     "Bundler",
        //     () => fetchOrTimeout(`http://localhost:8083/index.bundle${makeItNativeArguments}`),
        //     30,
        //     60 * 3
        // );

        // Spin up the runtime and run the testProject
        runtimeContainerId = execSync(
            `docker run -td -v ${localRoot}:/source -v ${scriptsPathLocal}:/shared:ro -w /source -p 8080:8080 ` +
                `-e MENDIX_VERSION=${mendixVersion} --entrypoint /bin/bash ` +
                `--rm ${ghcr}mxruntime:${mendixVersion} /shared/runtime.sh`
        )
            .toString()
            .trim();

        await tryReach("Runtime", () => fetch("http://localhost:8080"));

        console.log("Setup for android...");
        execSync("npm run setup-android", { stdio: "inherit" });
        console.log("Android successfully setup");
    } catch (error) {
        console.error(error.message);

        if (error.response) {
            console.error(await error.response.text());
        }

        try {
            execSync(`cat ${testProjectDir}/deployment/log/packager.txt`, {
                stdio: "inherit"
            });
        } catch (_) {}

        mxbuildContainerId && execSync(`docker logs ${mxbuildContainerId}`, { stdio: "inherit" });
        runtimeContainerId && execSync(`docker logs ${runtimeContainerId}`, { stdio: "inherit" });
        runtimeContainerId && console.log(cat("results/runtime.log").toString());

        throw error;
    } finally {
        // mxbuildContainerId && execSync(`docker rm -f ${mxbuildContainerId}`);
        // runtimeContainerId && execSync(`docker rm -f ${runtimeContainerId}`);
    }
}

async function getTestProject(repository, branch) {
    console.log("Downloading test project...");
    const downloadedArchivePath = join(tmpdir(), `testProject.zip`);

    if (!repository.includes("github.com")) {
        throw new Error("githubUrl is not a valid github repository!");
    }

    try {
        await promisify(pipeline)(
            (
                await fetch(`${repository}/archive/refs/heads/${branch}.zip`)
            ).body,
            createWriteStream(downloadedArchivePath)
        );
        console.log("Done!");

        return downloadedArchivePath;
    } catch (e) {
        console.log(`Url is not available :(`);
        rm("-f", downloadedArchivePath);
    }
    throw new Error("Cannot find test project in GitHub repository. Try again later.");
}

async function getMendixVersion() {
    const mendixOptionIndex = process.argv.indexOf("--mx-version");
    const targetMendixVersion = mendixOptionIndex >= 0 ? process.argv[mendixOptionIndex + 1] : undefined;
    let mendixVersion;

    if (process.env.MENDIX_VERSION) {
        return process.env.MENDIX_VERSION;
    }
    try {
        const mendixVersions = await fetch(
            "https://raw.githubusercontent.com/mendix/widgets-resources/master/configs/e2e/mendix-versions.json"
        );

        const mendixVersionsJson = await mendixVersions.json();

        if (targetMendixVersion && targetMendixVersion in mendixVersionsJson) {
            mendixVersion = mendixVersionsJson[targetMendixVersion];
        } else {
            mendixVersion = mendixVersionsJson.latest;
        }
    } catch (e) {
        throw new Error("Couldn't reach github.com. Make sure you are connected to internet.");
    }
    if (!mendixVersion) {
        throw new Error("Couldn't retrieve Mendix version from github.com. Try again later.");
    }

    return mendixVersion;
}

async function tryReach(name, request, attempts = 60, pause = 3) {
    for (; attempts > 0; --attempts) {
        try {
            console.log(`Trying to reach ${name}...`);

            const { ok, status, statusText } = await request();
            if (ok) {
                break;
            } else {
                // the request worked, but is not OK status. try again.
                console.error(`Request failed, status: ${status}: ${statusText}`);
            }
        } catch (e) {
            console.error(e);
        }
        console.log(`Could not reach ${name}, pausing...`);

        await new Promise(resolve => setTimeout(resolve, pause * 1000));
    }
    if (attempts === 0) {
        throw new Error(`${name} did not reach completion in time...`);
    }

    console.log(`${name} is up!`);
}
