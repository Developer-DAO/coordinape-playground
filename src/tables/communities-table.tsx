import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {useMemo} from 'react'
import {communitiesWithUsers, createGraph} from '../graph'
import {Community, EpochData} from '../types'
import {numberFormatter} from '../utils'

export type CommunitiesTableProps = Pick<EpochData, 'gifts' | 'users'>

interface CommunityProps {
  community: Community
}

const Community = ({community}: CommunityProps) => {
  const sortedUsers = [...community.users].sort(
    (a, b) => b.receivedGive - a.receivedGive,
  )

  return (
    <Stack>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Received from Community</Th>
            <Th isNumeric>Sent to Community</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedUsers.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td isNumeric>{numberFormatter.format(user.receivedGive)}</Td>
              <Td isNumeric>{numberFormatter.format(user.sentGive)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  )
}

export const CommunitiesTable = ({gifts, users}: CommunitiesTableProps) => {
  const graph = useMemo(() => createGraph({users, gifts}), [users, gifts])
  const communities = useMemo(() => {
    const communities = communitiesWithUsers(graph)
    return communities.sort((a, b) => b.users.length - a.users.length)
  }, [graph])

  return (
    <Accordion allowMultiple allowToggle>
      {communities.map((community) => (
        <AccordionItem key={community.id}>
          <h2>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {community.users.length} members
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Community community={community} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
