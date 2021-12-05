import { getOctokit } from "@actions/github";

export function githubToken(): string {
    const token = process.env.GITHUB_TOKEN;
    if (!token)
        throw ReferenceError('No token defined in the environment variables');
    return token;
}

export const toolkit = getOctokit(githubToken())