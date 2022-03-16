import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'
import {EpochData} from '../types'
import {CappedTable} from './capped-table'
import {CommunitiesTable} from './communities-table'
import {DropGt10Table} from './drop-gt-10-table'
import {PairsTable} from './pairs-table'
import {TransactionsTable} from './transactions-table'
import {UnadjustedTable} from './unadjusted-table'

export interface DataProps extends EpochData {}

export const Tables = ({gifts, users, totalGive}: DataProps) => {
  return (
    <Tabs isLazy>
      <TabList>
        <Tab>Unadjusted</Tab>
        <Tab>&gt;10 -&gt; 10</Tab>
        <Tab>Drop &gt;10</Tab>
        <Tab>Transactions</Tab>
        <Tab>Pairs</Tab>
        <Tab>Communities</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <UnadjustedTable users={users} totalGive={totalGive} />
        </TabPanel>
        <TabPanel>
          <CappedTable users={users} />
        </TabPanel>
        <TabPanel>
          <DropGt10Table users={users} />
        </TabPanel>
        <TabPanel>
          <TransactionsTable gifts={gifts} users={users} />
        </TabPanel>
        <TabPanel>
          <PairsTable gifts={gifts} users={users} />
        </TabPanel>
        <TabPanel>
          <CommunitiesTable gifts={gifts} users={users} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
