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

export const createFileCommitOnDefault = async (path: string, content: string): Promise<string> => {
    const defaultBranch = getDefaultBranch()
    // Get the current "master" reference, to get the current master's sha
    const sha = await toolkit.gitdata.getReference({
        ...context.repo,
        ref: `heads/${defaultBranch}`
    })

    // Get the tree associated with master, and the content
    // of the template file to open the PR with.
    const tree = await toolkit.gitdata.getTree({
        ...context.repo,
        tree_sha: sha.data.object.sha
    })

    // Create a new blob with the existing template content
    const blob = await toolkit.gitdata.createBlob({
        content: content,
        encoding: 'utf8'
    })

    const newTree = await toolkit.gitdata.createTree({
        ...context.repo,
        tree: [{
            path,
            sha: blob.data.sha,
            mode: '100644',
            type: 'blob'
        }],
        base_tree: tree.data.sha
    })

    // Create a commit and a reference using the new tree
    const commit = await toolkit.gitdata.createCommit({
        ...context.repo,
        message: 'Add details',
        parents: [sha.data.object.sha],
        tree: newTree.data.sha
    })
    return commit.data.sha
}