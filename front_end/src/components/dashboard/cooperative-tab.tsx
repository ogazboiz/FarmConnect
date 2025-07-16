"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vote, Plus, MessageSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function CooperativeTab() {
  const daos = [
    {
      id: 1,
      name: "Organic Farmers Collective",
      members: 156,
      yourRole: "Member",
      votingPower: "2.5%",
      treasury: "45,000 $FARM",
      activeProposals: 3,
    },
    {
      id: 2,
      name: "Sustainable Agriculture DAO",
      members: 89,
      yourRole: "Delegate",
      votingPower: "5.2%",
      treasury: "28,500 $FARM",
      activeProposals: 1,
    },
    {
      id: 3,
      name: "Local Produce Network",
      members: 234,
      yourRole: "Member",
      votingPower: "1.8%",
      treasury: "67,200 $FARM",
      activeProposals: 5,
    },
  ]

  const proposals = [
    {
      id: 1,
      title: "Purchase Shared Harvesting Equipment",
      dao: "Organic Farmers Collective",
      description: "Proposal to buy a combine harvester for shared use among members",
      votesFor: 78,
      votesAgainst: 12,
      totalVotes: 90,
      timeLeft: "2 days",
      status: "active",
    },
    {
      id: 2,
      title: "Implement Carbon Credit Program",
      dao: "Sustainable Agriculture DAO",
      description: "Create a system to track and monetize carbon sequestration efforts",
      votesFor: 45,
      votesAgainst: 8,
      totalVotes: 53,
      timeLeft: "5 days",
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Farmer Cooperatives</h1>
          <p className="text-green-600">Participate in decentralized farmer governance and decision making</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Join DAO
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {daos.map((dao) => (
          <Card
            key={dao.id}
            className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-800">{dao.name}</CardTitle>
                <Badge variant="outline" className="text-green-700">
                  {dao.yourRole}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-600">Members</p>
                  <p className="font-semibold text-green-800">{dao.members}</p>
                </div>
                <div>
                  <p className="text-green-600">Voting Power</p>
                  <p className="font-semibold text-green-800">{dao.votingPower}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Treasury</span>
                  <span className="font-medium text-green-800">{dao.treasury}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Active Proposals</span>
                  <Badge variant="secondary">{dao.activeProposals}</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <Vote className="w-4 h-4 mr-1" />
                  Vote
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Discuss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Active Proposals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">{proposal.title}</h3>
                    <p className="text-sm text-green-600 mb-2">{proposal.dao}</p>
                    <p className="text-sm text-green-700">{proposal.description}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{proposal.timeLeft} left</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Votes For: {proposal.votesFor}</span>
                    <span className="text-green-600">Votes Against: {proposal.votesAgainst}</span>
                  </div>
                  <Progress value={(proposal.votesFor / proposal.totalVotes) * 100} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Vote For
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    Vote Against
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-700">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
