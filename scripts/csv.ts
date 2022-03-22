import {writeFile} from 'fs/promises'
import {fetchCircleSnapshot} from '../src/api'
import {EpochData, User} from '../src/types'

interface UserData extends Pick<User, 'id' | 'name' | 'address'> {
  giveReceived: number
  givePercentage: number
  codeReceived: number
  codePercentage: number
}

interface WriteOutput {
  lines: number
}

run()

const TOTAL_CODE = 5_000_000
const CONTRIBUTOR_CODE_ALLOCATION = 1_000_000

async function writeCsv(csv: string, file: string) {
  await writeFile(file, csv)
}

async function writeUsers({users, totalGive}: EpochData) {
  const mappedUsers: UserData[] = users.map((user) => mapUser(user, totalGive))
  mappedUsers.sort((user1, user2) => user2.giveReceived - user1.giveReceived)

  const csv = mappedUsers.map(
    ({
      id,
      name,
      address,
      giveReceived,
      givePercentage,
      codeReceived,
      codePercentage,
    }) =>
      `${id},${name},${address},${giveReceived},${givePercentage},${codeReceived},${codePercentage}`,
  )

  await writeCsv(
    `id,name,address,giveReceived,givePercentage,codeReceived,codePercentage\n${csv.join(
      '\n',
    )}`,
    'data/users.csv',
  )
  console.log(`wrote ${csv.length + 1} lines to data/users.csv`)
}

async function writeGifts({gifts}: EpochData) {
  gifts.sort((gift1, gift2) => gift2.tokens - gift1.tokens)

  const csv = gifts.map(
    ({id, recipientId, senderId, tokens}) =>
      `${id},${recipientId},${senderId},${tokens}`,
  )

  await writeCsv(
    `id,recipientId,senderId,tokens\n${csv.join('\n')}`,
    'data/gifts.csv',
  )
  console.log(`wrote ${csv.length + 1} lines to data/gifts.csv`)
}

function mapUser(user: User, totalGive: number) {
  const {id, address} = user
  const name = user.name.includes(',') ? `"${user.name}"` : user.name
  const giveReceived = user.gifts.received.reduce(
    (sum, gift) => sum + gift.tokens,
    0,
  )
  const givePercentage = giveReceived / totalGive
  const codeReceived = givePercentage * CONTRIBUTOR_CODE_ALLOCATION
  const codePercentage = codeReceived / TOTAL_CODE

  return {
    id,
    name,
    address,
    giveReceived,
    givePercentage,
    codeReceived,
    codePercentage,
  }
}

async function run() {
  const token = process.env.COORDINAPE_TOKEN
  if (!token) {
    throw Error('missing COORDINAPE_TOKEN')
  }

  try {
    const data = await fetchCircleSnapshot(token)
    await Promise.all([writeUsers(data), writeGifts(data)])
    process.exit(0)
  } catch (error) {
    console.error('failed to fetch data', error)
    process.exit(1)
  }
}
