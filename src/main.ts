import * as core from '@actions/core'
import { getOctokit, context} from '@actions/github'
import axios, { AxiosResponse } from 'axios'
import { githubToken } from './config'
import { MultisigTransaction, SafeInfo } from "./types"

async function run(): Promise<void> {
  try {
    const safeAddress: string = core.getInput('safe-address')
    const serviceUrl: string = core.getInput('service-url')
    const toolkit = getOctokit(githubToken())
    const repoInfo = await toolkit.repos.get({
      ...context.repo
    })
    const branch = repoInfo.data.default_branch
    await toolkit.pulls.create({
      ...context.repo,
      head: branch,
      base: "main"
    })
    const infoResponse: AxiosResponse<SafeInfo> = await axios.get(`${serviceUrl}/api/v1/safes/${safeAddress}`)
    const safeInfo = infoResponse.data
    console.log("Safe Information", safeInfo)

    const txResponse: AxiosResponse<MultisigTransaction> = await axios.get(`${serviceUrl}/api/v1/multisig-transactions/`)
    const transaction = txResponse.data
    console.log("Transaction Information", transaction)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()