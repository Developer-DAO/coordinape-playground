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

async function writeCsv(
  {users, totalGive}: EpochData,
  path: string,
): Promise<WriteOutput> {
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
  await writeFile(
    path,
    `id,name,address,giveReceived,givePercentage,codeReceived,codePercentage\n${csv.join(
      '\n',
    )}`,
  )

  return {lines: csv.length + 1}
}

function mapUser(user: User, totalGive: number) {
  const {id, name, address} = user
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

  const outputPath = process.argv[2] || 'data.csv'

  try {
    const data = await fetchCircleSnapshot(token)
    const {lines} = await writeCsv(data, outputPath)
    console.log(`wrote ${lines} lines to ${outputPath}`)
    process.exit(0)
  } catch (error) {
    console.error('failed to fetch data', error)
    process.exit(1)
  }
}
