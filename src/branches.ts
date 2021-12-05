import { context } from '@actions/github'
import { toolkit } from "./config";

let defaultBranch: string | undefined

export const getDefaultBranch = async (): Promise<string> => {
    if (!defaultBranch) {
        const repoInfo = await toolkit.repos.get({
            ...context.repo
        })
        defaultBranch = repoInfo.data.default_branch
    }
    return defaultBranch
}

export const branchExists = async (branch: string): Promise<boolean> => {
    try {
        await toolkit.repos.getBranch({
            ...context.repo,
            branch
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

export const createBranchFromDefault = async (branch: string) => {
    if (!branchExists(branch)) {
        const defaultBranchName = await getDefaultBranch()
        const defaultBranch = await toolkit.repos.getBranch({
            ...context.repo,
            branch: defaultBranchName
        })
        await toolkit.git.createRef({
            ref: `refs/heads/${branch}`,
            sha: defaultBranch.data.commit.sha,
            ...context.repo
        })
    }
}