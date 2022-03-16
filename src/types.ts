export interface Gift {
  id: number
  recipientAddress: string
  recipientId: number
  senderAddress: string
  senderId: number
  tokens: number
}

export interface User {
  id: number
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

export interface CommunityUser extends User {
  receivedGive: number
  receivedGifts: Gift[]
  sentGive: number
  sentGifts: Gift[]
  communityGifts: Gift[]
}

export type Community = {
  id: number
  users: CommunityUser[]
  totalGive: number
}
