import * as core from '@actions/core'
import axios, { AxiosResponse } from 'axios'
import { branchExists, createBranchFromDefault, getDefaultBranch } from './branches'
import { createFile, fileExists } from './files'
import { MultisigDetails, MultisigTransaction, MultiSigTrigger, Page, SafeInfo } from "./types"
import { triggerToBranch, triggerToDetailsPath } from './utils'

async function run(): Promise<void> {
  try {
    const safeAddress: string = core.getInput('safe-address')
    const serviceUrl: string = core.getInput('service-url')
    const infoResponse: AxiosResponse<SafeInfo> = await axios.get(`${serviceUrl}/api/v1/safes/${safeAddress}`)
    const safeInfo = infoResponse.data
    console.log("Safe Information", safeInfo)

    const txResponse: AxiosResponse<Page<MultisigTransaction>> = await axios.get(`${serviceUrl}/api/v1/safes/${safeAddress}/multisig-transactions/?nonce__gte=${safeInfo.nonce}`)
    for (const transaction of txResponse.data.results) {
      console.log("Check transaction", transaction)
      const trigger: MultiSigTrigger = {
        type: 'multisig',
        id: transaction.safeTxHash
      }
      const defaultBranch = await getDefaultBranch()
      const path = triggerToDetailsPath(trigger)
      if (await fileExists(defaultBranch, path)) {
        console.log("Transaction details already merged")
        continue
      }
      const branch = triggerToBranch(trigger)
      if (await branchExists(branch)) {
        console.log("Transaction details already proposed")
        continue
      }
      const details: MultisigDetails = {
        safe: safeAddress,
        ...transaction
      }
      await createBranchFromDefault(branch)
      await createFile(branch, path, JSON.stringify(details, null, 3))
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()