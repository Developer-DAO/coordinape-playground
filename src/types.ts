export interface Gift {
  id: number
  recipientAddress: string
  senderAddress: string
  tokens: number
}

export interface User {
  address: string
  name: string
  gifts: {
    received: Gift[]
    sent: Gift[]
  }
}

export interface EpochData {
  gifts: Gift[]
  users: User[]
  totalGive: number
}
