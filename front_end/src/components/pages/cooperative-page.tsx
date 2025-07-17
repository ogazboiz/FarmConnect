"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Vote, Plus, MessageSquare, Users, Coins, Calendar, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"

export function CooperativePage() {
  const daos = [
    {
      id: 1,
      name: "Organic Farmers Collective",
      members: 156,
      yourRole: "Member",
      votingPower: "2.5%",
      treasury: "45,000 $FARM",
      activeProposals: 3,
      description: "A cooperative focused on organic farming practices and sustainable agriculture.",
      joined: "2024-01-15",
    },
    {
      id: 2,
      name: "Sustainable Agriculture DAO",
      members: 89,
      yourRole: "Delegate",
      votingPower: "5.2%",
      treasury: "28,500 $FARM",
      activeProposals: 1,
      description: "Promoting sustainable farming methods and environmental conservation.",
      joined: "2024-02-01",
    },
    {
      id: 3,
      name: "Local Produce Network",
      members: 234,
      yourRole: "Member",
      votingPower: "1.8%",
      treasury: "67,200 $FARM",
      activeProposals: 5,
      description: "Connecting local farmers with community markets and consumers.",
      joined: "2024-01-20",
    },
  ]

  const proposals = [
    {
      id: 1,
      title: "Purchase Shared Harvesting Equipment",
      dao: "Organic Farmers Collective",
      description:
        "Proposal to buy a combine harvester for shared use among members to reduce individual costs and improve efficiency.",
      votesFor: 78,
      votesAgainst: 12,
      totalVotes: 90,
      timeLeft: "2 days",
      status: "active",
      proposer: "FarmerJoe.eth",
      created: "2024-02-28",
    },
    {
      id: 2,
      title: "Implement Carbon Credit Program",
      dao: "Sustainable Agriculture DAO",
      description: "Create a system to track and monetize carbon sequestration efforts across member farms.",
      votesFor: 45,
      votesAgainst: 8,
      totalVotes: 53,
      timeLeft: "5 days",
      status: "active",
      proposer: "GreenFarmer.eth",
      created: "2024-02-25",
    },
    {
      id: 3,
      title: "Establish Seed Bank Initiative",
      dao: "Local Produce Network",
      description: "Create a community seed bank to preserve heirloom varieties and reduce seed costs.",
      votesFor: 92,
      votesAgainst: 15,
      totalVotes: 107,
      timeLeft: "1 day",
      status: "active",
      proposer: "SeedKeeper.eth",
      created: "2024-02-20",
    },
  ]

  const votingHistory = [
    { proposal: "Organic Certification Fund", vote: "For", result: "Passed", date: "2024-02-15" },
    { proposal: "Equipment Maintenance Pool", vote: "For", result: "Passed", date: "2024-02-10" },
    { proposal: "Marketing Campaign Budget", vote: "Against", result: "Failed", date: "2024-02-05" },
    { proposal: "Training Program Initiative", vote: "For", result: "Passed", date: "2024-01-30" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-emerald-100 mb-2">
                <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Farmer Cooperatives
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">
                Participate in decentralized farmer governance and decision making
              </p>
            </div>
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Join DAO
            </Button>
          </div>

          {/* DAOs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {daos.map((dao) => (
              <Card
                key={dao.id}
                className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-emerald-100 text-lg">{dao.name}</CardTitle>
                    <Badge variant="outline" className="text-emerald-300 border-emerald-500/50 bg-emerald-900/20">
                      {dao.yourRole}
                    </Badge>
                  </div>
                  <p className="text-sm text-emerald-200/80 leading-relaxed">{dao.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-emerald-900/30 border border-emerald-700/30 p-3 rounded-lg">
                      <p className="text-emerald-200/80 mb-1">Members</p>
                      <p className="font-semibold text-emerald-100 text-lg">{dao.members}</p>
                    </div>
                    <div className="bg-emerald-900/30 border border-emerald-700/30 p-3 rounded-lg">
                      <p className="text-emerald-200/80 mb-1">Voting Power</p>
                      <p className="font-semibold text-emerald-100 text-lg">{dao.votingPower}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200/80">Treasury</span>
                      <span className="font-medium text-emerald-100 flex items-center gap-1">
                        <Coins className="w-4 h-4 text-amber-400" />
                        {dao.treasury}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200/80">Active Proposals</span>
                      <Badge variant="secondary" className="bg-amber-900/30 text-amber-300 border-amber-500/50">
                        {dao.activeProposals}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200/80">Joined</span>
                      <span className="text-emerald-100">{dao.joined}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent hover:border-emerald-500"
                    >
                      <Vote className="w-4 h-4 mr-1" />
                      Vote
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-600/50 text-green-200 hover:bg-green-800/60 bg-transparent hover:border-green-500"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Discuss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Active Proposals */}
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardHeader>
                <CardTitle className="text-emerald-100 flex items-center gap-2">
                  <Vote className="w-5 h-5 text-emerald-400" />
                  Active Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{proposal.title}</h3>
                          <p className="text-sm text-emerald-600 mb-2">{proposal.dao}</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{proposal.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                            <span>By: {proposal.proposer}</span>
                            <span>Created: {proposal.created}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-300 ml-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          {proposal.timeLeft} left
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              For: {proposal.votesFor}
                            </span>
                            <span className="text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              Against: {proposal.votesAgainst}
                            </span>
                          </div>
                          <span className="text-slate-600">Total: {proposal.totalVotes}</span>
                        </div>
                        <Progress value={(proposal.votesFor / proposal.totalVotes) * 100} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          Vote For
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                        >
                          Vote Against
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-700">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                >
                  View All Proposals
                </Button>
              </CardContent>
            </Card>

            {/* Voting History */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Voting History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {votingHistory.map((vote, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg border border-green-200/50"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{vote.proposal}</p>
                        <p className="text-sm text-slate-600">{vote.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            vote.vote === "For" ? "text-emerald-700 border-emerald-300" : "text-red-700 border-red-300"
                          }
                        >
                          {vote.vote}
                        </Badge>
                        <p className={`text-sm mt-1 ${vote.result === "Passed" ? "text-emerald-600" : "text-red-600"}`}>
                          {vote.result}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  View Full History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* DAO Stats */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Your DAO Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-emerald-50/50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">3</div>
                  <div className="text-sm text-slate-600">DAOs Joined</div>
                </div>
                <div className="text-center p-4 bg-green-50/50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">24</div>
                  <div className="text-sm text-slate-600">Votes Cast</div>
                </div>
                <div className="text-center p-4 bg-amber-50/50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600 mb-2">7</div>
                  <div className="text-sm text-slate-600">Proposals Created</div>
                </div>
                <div className="text-center p-4 bg-yellow-50/50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">92%</div>
                  <div className="text-sm text-slate-600">Participation Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
