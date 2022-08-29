import * as core from "@actions/core"
import {getArkadeUrl} from "./lib/utils"
import * as tc from "@actions/tool-cache"
import * as exec from "@actions/exec"
import * as system from "os"
import * as path from "path";

export const setup = async () => {
    try {
        if (process.env.RUNNER_OS === "Windows") {
            throw new Error("Windows currently not supported in setup-with-arkade action!")
        }

        if (process.env.RUNNER_ARCH === "X86") {
            throw new Error("Arkade no longer supports 32bit runners!")
        }

        const clis = core.getInput("clis").split(",").map((tool) => tool.trim())

        // Get latest arkade version
        const arkadePath = await tc.downloadTool(await getArkadeUrl())

        for (const cli of clis) {
            await exec.exec(arkadePath, ["get", cli])
            const cliPath = path.join(system.homedir(), '.arkade', 'bin', cli)

            core.addPath(cliPath)
        }


    } catch (e) {
        core.setFailed(e.message)
    }
}

if (require.main === module) {
    setup()
}