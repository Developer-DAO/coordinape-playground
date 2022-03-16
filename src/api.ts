import axios from 'axios'
import {EpochData, Gift, User} from './types'

const instance = axios.create({
  headers: {'Content-Type': 'application/json'},
})

interface ManifestResponse {
  circle: {
    users: {
      id: number
      address: string
      name: string
    }[]
    token_gifts: {
      id: number
      epoch_id: number
      recipient_address: string
      recipient_id: number
      sender_address: string
      sender_id: number
      tokens: number
    }[]
  }
}

const TARGET_EPOCH = 2538

export const fetchCircleSnapshot = async (
  token: string,
): Promise<EpochData> => {
  const response = await instance.get<ManifestResponse>(
    'https://api.coordinape.com/api/v2/manifest?circle_id=1573',
    {headers: {Authorization: token}},
  )

  const {
    circle: {token_gifts, users: responseUsers},
  } = response.data

  const epochGifts = token_gifts.filter((g) => g.epoch_id === TARGET_EPOCH)

  const gifts: Gift[] = epochGifts.map(
    ({
      id,
      recipient_address,
      recipient_id,
      sender_address,
      sender_id,
      tokens,
    }) => ({
      id,
      recipientAddress: recipient_address,
      recipientId: recipient_id,
      senderAddress: sender_address,
      senderId: sender_id,
      tokens,
    }),
  )

  const users: User[] = responseUsers.map(({id, address, name}) => ({
    id,
    address,
    name,
    gifts: {
      received: gifts.filter((gift) => gift.recipientAddress === address),
      sent: gifts.filter((gift) => gift.senderAddress === address),
    },
  }))

  const totalGive = epochGifts.reduce((total, gift) => total + gift.tokens, 0)

  return {
    gifts,
    users,
    totalGive,
  }
}
