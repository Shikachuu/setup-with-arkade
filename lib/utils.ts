import * as httpm from "@actions/http-client"

const getPlatformAwareBinary = (arch: string, os: string): string => {
    const currentSystem = {
        os: os !== "macOS" ? "" : "-darwin",
        arch: arch === "x64" ? "" : "-" + arch,
    }

    return `arkade${currentSystem.os}${currentSystem.arch}`
}

export const getArkadeUrl = async (): Promise<string> => {
    const response = await new httpm.HttpClient("setup-with-arkade-action")
        .getJson("https://api.github.com/repos/alexellis/arkade/releases/latest")

    const arkadeBinaryName = getPlatformAwareBinary(process.env.RUNNER_ARCH, process.env.RUNNER_OS)

    /* @ts-ignore */
    return `https://github.com/alexellis/arkade/releases/download/${response.result.tag_name}/${arkadeBinaryName}`
}