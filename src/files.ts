import { context } from "@actions/github/lib/utils"
import { toolkit } from "./config"

export const fileExists = async (branch: string, path: string): Promise<boolean> => {
    try {
        await toolkit.repos.getContent({
            ...context.repo,
            path,
            ref: branch
        })
        return true
    } catch (error: any) {
        if (error.name === 'HttpError' && error.status === 404) {
            return false
        } else {
            throw Error(error)
        }
    }
}

export const createFile = async (branch: string, path: string, content: string) => {
    if (!fileExists(branch, path)) {
        return toolkit.repos.createOrUpdateFileContents({
            ...context.repo,
            path,
            message: 'Add details',
            content,
            branch
        })
    }
}