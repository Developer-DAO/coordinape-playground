import {MultiDirectedGraph} from 'graphology'
import louvain from 'graphology-communities-louvain'
import {Community, EpochData, User} from './types'

export interface NodeAttributes {
  user: User
}

export interface EdgeAttributes {
  tokens: number
}

export const createGraph = ({
  users,
  gifts,
}: Pick<EpochData, 'gifts' | 'users'>): MultiDirectedGraph<
  NodeAttributes,
  EdgeAttributes
> => {
  const graph = new MultiDirectedGraph<NodeAttributes, EdgeAttributes>({
    allowSelfLoops: false,
  })

  users.forEach((user) => {
    graph.addNode(user.id, {
      user,
    })
  })

  gifts
    .filter((gift) => gift.tokens !== 0)
    .forEach((gift) => {
      graph.addEdge(gift.senderId, gift.recipientId, {
        tokens: gift.tokens,
      })
    })

  graph.setAttribute('order', graph.order)
  graph.setAttribute('size', graph.size)

  louvain.assign(graph, {getEdgeWeight: 'tokens'})

  return graph
}

export const communitiesWithUsers = (
  graph: MultiDirectedGraph,
): Community[] => {
  const communities: Map<string, User[]> = new Map()

  graph.forEachNode((node) => {
    const attributes = graph.getNodeAttributes(node)
    const community = communities.get(attributes.community) || []
    community.push(attributes.user)
    communities.set(attributes.community, community)
  })

  const entries = Object.values(Object.fromEntries(communities))
  const entriesWithMultipleUsers = entries.filter(
    (community) => community.length > 1,
  )

  return entriesWithMultipleUsers.map((users, i) => {
    const communityUsers = users.map((user) => {
      const giftsFromCommunityMembers = user.gifts.received.filter(
        ({senderId}) => users.some(({id}) => id === senderId),
      )
      const giftsToCommunityMembers = user.gifts.sent.filter(({recipientId}) =>
        users.some(({id}) => id === recipientId),
      )

      const receivedGifts = giftsFromCommunityMembers.filter(
        ({recipientId}) => user.id === recipientId,
      )
      const receivedGive = receivedGifts.reduce(
        (sum, {tokens}) => sum + tokens,
        0,
      )

      const sentGifts = giftsToCommunityMembers.filter(
        ({senderId}) => user.id === senderId,
      )
      const sentGive = sentGifts.reduce((sum, {tokens}) => sum + tokens, 0)

      return {
        ...user,
        receivedGive,
        receivedGifts,
        sentGive,
        sentGifts,
        communityGifts: giftsFromCommunityMembers,
      }
    })

    const totalGive = communityUsers.reduce(
      (sum, {receivedGive}) => sum + receivedGive,
      0,
    )

    return {
      id: i,
      users: communityUsers,
      totalGive,
    }
  })
}
