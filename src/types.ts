export interface MultisigTransaction {
    safeTxHash: string,
    to: string,
    value: string,
    data: string,
    operation: number,
    safeTxGas: string,
    baseGas: string,
    gasPrice: string,
    gasToken: string,
    refundReceiver: string,
    nonce: number
}

export interface MultisigDetails {
    safe: string,
    tx: MultisigTransaction
}

export interface Page<T> {
    next: string,
    results: T[]
}

export interface SafeInfo {
    address: string,
    owners: string[],
    nonce: number
}

export interface MultiSigTrigger {
    type: "multisig",
    id: string
}

export interface SafeSnapTrigger {
    type: "safesnap",
    id: string
}

export type Trigger = MultiSigTrigger | SafeSnapTrigger