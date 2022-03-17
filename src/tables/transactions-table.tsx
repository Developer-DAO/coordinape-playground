import {Stack, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react'
import {EpochData, Gift, User} from '../types'
import {numberFormatter} from '../utils'
import {TableDescription} from './components'

export type TransactionsTableProps = Pick<EpochData, 'gifts' | 'users'>

interface Transaction {
  recipient: User
  sender: User
  tokens: number
}

export const giftsToTransactions = (
  gifts: Gift[],
  users: User[],
): Transaction[] =>
  gifts
    .filter((gift) => gift.tokens !== 0)
    .map((gift) => {
      const recipient = users.find(
        (user) => user.address === gift.recipientAddress,
      )!
      const sender = users.find((user) => user.address === gift.senderAddress)!
      return {
        recipient,
        sender,
        tokens: gift.tokens,
      }
    })

export const TransactionsTable = ({gifts, users}: TransactionsTableProps) => {
  const pairs = giftsToTransactions(gifts, users).sort(
    (a, b) => b.tokens - a.tokens,
  )

  return (
    <Stack>
      <TableDescription>
        A list of all transactions in the circle.
      </TableDescription>
      <Table>
        <Thead>
          <Tr>
            <Th>Sender</Th>
            <Th isNumeric>GIVE</Th>
            <Th>Receiver</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pairs.map(({recipient, sender, tokens}) => (
            <Tr key={`${recipient.address}->${sender.address}`}>
              <Td>{sender.name}</Td>
              <Td isNumeric>{numberFormatter.format(tokens)}</Td>
              <Td>{recipient.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  )
}
