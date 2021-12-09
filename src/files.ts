import { context } from "@actions/github/lib/utils"
import { toolkit } from "./config"
import { getDefaultBranch } from "./branches"

export const toFileContent = (content: any) => Buffer.from(JSON.stringify(content, null, 3)).toString('base64')

export const fileExists = async (branch: string, path: string): Promise<boolean> => {
    try {
        await toolkit.repos.getContent({
            ...context.repo,
            path,
            ref: branch
        })
        return true
    } catch (error) {
        if (error.name === 'HttpError' && error.status === 404) {
            return false
        } else {
            throw Error(error)
        }
    }
}

export const createFile = async (branch: string, path: string, content: string) => {
    await toolkit.repos.createOrUpdateFileContents({
        ...context.repo,
        path,
        message: 'Add details',
        content,
        branch: `refs/heads/${branch}`
    })
}