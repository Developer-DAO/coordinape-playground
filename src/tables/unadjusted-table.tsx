import {
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {EpochData} from '../types'
import {
  codeReceivedFromGive,
  decimalToPercent,
  giveReceived,
  numberFormatter,
  userReceivedGive,
} from '../utils'
import {TableDescription} from './components'

export type UnadjustedTableProps = Pick<EpochData, 'users' | 'totalGive'>

export const UnadjustedTable = ({users, totalGive}: UnadjustedTableProps) => {
  const sortedUsers = [...users]
    .filter(userReceivedGive)
    .sort((a, b) => giveReceived(b) - giveReceived(a))
  const codePerGive = codeReceivedFromGive(1, totalGive)

  return (
    <Stack>
      <TableDescription>
        Raw, unadjusted allocations from our Coordinape circle
      </TableDescription>
      <Table>
        <TableCaption>CODE per GIVE = {codePerGive}</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>GIVE Received</Th>
            <Th isNumeric>% of GIVE</Th>
            <Th isNumeric>CODE Distribution</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedUsers.map((user) => {
            const giveReceived = user.gifts.received.reduce(
              (acc, gift) => acc + gift.tokens,
              0,
            )
            const percentGive = decimalToPercent(giveReceived / totalGive)
            const codeReceived = codeReceivedFromGive(giveReceived, totalGive)

            return (
              <Tr key={user.address}>
                <Td>{user.name}</Td>
                <Td isNumeric>{numberFormatter.format(giveReceived)}</Td>
                <Td isNumeric>{percentGive}</Td>
                <Td isNumeric>{numberFormatter.format(codeReceived)}</Td>
              </Tr>
            )
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td>Totals</Td>
            <Td isNumeric>{numberFormatter.format(totalGive)}</Td>
            <Td />
            <Td isNumeric>{numberFormatter.format(1000000)}</Td>
          </Tr>
        </Tfoot>
      </Table>
    </Stack>
  )
}
