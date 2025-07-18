"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Vote, Plus, MessageSquare, Users, Coins, Calendar, TrendingUp, CheckCircle, XCircle, Clock, Wallet, 
  Info, AlertTriangle, Shield, Target, Zap
} from "lucide-react"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { 
  useFarmerDAO, 
  useDAOMember, 
  useProposal, 
  useFarmTokenBalance,
  useFarmToken,
  formatTokenAmount,
  parseTokenAmount 
} from "@/hooks/useAgriDAO"
import { useReadContract } from "wagmi"
import { FarmerDAOABI } from "@/config"
import { getContractAddresses } from "@/config"

const contracts = getContractAddresses()

// Constants from contract
const MIN_STAKE_TO_PROPOSE = "100" // 100 FARM tokens
const MIN_STAKE_TO_VOTE = "10" // 10 FARM tokens
const VOTING_PERIOD_DAYS = 7
const QUORUM_PERCENTAGE = 10
const SUPER_MAJORITY = 67

// Hook to get active proposals
const useActiveProposals = () => {
  const { data: activeProposalIds } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getActiveProposals',
  })

  return Array.isArray(activeProposalIds) ? activeProposalIds : []
}

// Hook to get total proposals count
const useTotalProposals = () => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getTotalProposals',
  })
  
  return data ? Number(data) : 0
}

// Hook to get member count
const useMemberCount = () => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getMemberCount',
  })
  
  return data ? Number(data) : 0
}

// Hook to get treasury balance
const useTreasuryBalance = () => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'treasuryBalance',
  })
  
  return data || BigInt(0)
}

// Hook to get total staked amount
const useTotalStaked = () => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'totalStaked',
  })
  
  return data || BigInt(0)
}

// Hook to get voting power
const useVotingPower = (address?: string) => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getVotingPower',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
  
  return data || BigInt(0)
}

// Hook to get staked balance
const useStakedBalance = (address?: string) => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'stakedBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
  
  return data || BigInt(0)
}

// Proposal status enum mapping
const ProposalStatus = {
  0: 'ACTIVE',
  1: 'PASSED', 
  2: 'FAILED',
  3: 'EXECUTED',
  4: 'CANCELLED'
}

const ProposalType = {
  0: 'FUNDING',
  1: 'GOVERNANCE',
  2: 'CERTIFICATION',
  3: 'EQUIPMENT',
  4: 'RESEARCH'
}

const getProposalTypeColor = (type: number) => {
  const colors = {
    0: 'bg-green-100 text-green-800 border-green-300', // FUNDING
    1: 'bg-purple-100 text-purple-800 border-purple-300', // GOVERNANCE
    2: 'bg-blue-100 text-blue-800 border-blue-300', // CERTIFICATION
    3: 'bg-orange-100 text-orange-800 border-orange-300', // EQUIPMENT
    4: 'bg-indigo-100 text-indigo-800 border-indigo-300', // RESEARCH
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
}

// Individual Proposal Component to isolate hooks
const ProposalCard = ({ proposalId, userAddress }: { proposalId: bigint, userAddress?: string }) => {
  const proposalQuery = useProposal(proposalId)
  const { data: hasVoted } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'hasUserVoted',
    args: proposalId && userAddress ? [proposalId, userAddress] : undefined,
    query: {
      enabled: !!(proposalId && userAddress),
    },
  })

  const { vote, isConfirming } = useFarmerDAO()
  const proposal = proposalQuery.data

  console.log("Proposal", proposal)

  const handleVote = async (support: boolean) => {
    if (!userAddress) return
    await vote(proposalId, support)
  }

  if (!proposal) return null

  const totalVotes = Number(proposal.votesFor) + Number(proposal.votesAgainst) // votesFor + votesAgainst
  const votesFor = Number(proposal.votesFor)
  const votesAgainst = Number(proposal.votesAgainst)
  const progressPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0
  const isExpired = Number(proposal.deadline ) <= Math.floor(Date.now() / 1000)

  const formatTimeLeft = (deadline: bigint) => {
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = Number(deadline) - now
    
    if (timeLeft <= 0) return "Expired"
    
    const days = Math.floor(timeLeft / 86400)
    const hours = Math.floor((timeLeft % 86400) / 3600)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }

  return (
    <div className="border border-emerald-200 rounded-lg p-6 bg-emerald-50/30 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-800 text-lg">{proposal.title}</h3>
            <Badge className={getProposalTypeColor(proposal.proposalType)}>
              {ProposalType[proposal.proposalType as keyof typeof ProposalType]}
            </Badge>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">{proposal[3]}</p>
          <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
            <span>Proposer: {proposal.proposer?.slice(0, 6)}...{proposal.proposer?.slice(-4)}</span>
            {proposal.amount && Number(proposal.amount) > 0 && (
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-500" />
                Amount: {formatTokenAmount(proposal.amount)} ETH
              </span>
            )}
            {proposal.recipient && proposal.recipient !== '0x0000000000000000000000000000000000000000' && (
              <span>Recipient: {proposal.recipient?.slice(0, 6)}...{proposal[10]?.slice(-4)}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <Badge className={isExpired ? "bg-red-100 text-red-800 border-red-300" : "bg-amber-100 text-amber-800 border-amber-300"}>
            <Clock className="w-3 h-3 mr-1" />
            {isExpired ? "Expired" : formatTimeLeft(proposal.deadline)}
          </Badge>
          {hasVoted && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              Voted
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle className="w-4 h-4" />
              For: {votesFor}
            </span>
            <span className="text-red-600 flex items-center gap-1 font-medium">
              <XCircle className="w-4 h-4" />
              Against: {votesAgainst}
            </span>
          </div>
          <span className="text-slate-600 font-medium">Total: {totalVotes}</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <div className="text-xs text-slate-500 text-center">
          {progressPercentage.toFixed(1)}% in favor • Quorum needed: {QUORUM_PERCENTAGE}% of staked tokens
        </div>
      </div>

      <ProposalActions 
        proposalId={proposalId}
        userAddress={userAddress}
        hasVoted={hasVoted || false}
        isExpired={isExpired}
        isConfirming={isConfirming}
        onVote={handleVote}
      />
    </div>
  )
}

// Separate component for proposal actions
const ProposalActions = ({ 
  proposalId, 
  userAddress, 
  hasVoted, 
  isExpired, 
  isConfirming, 
  onVote 
}: {
  proposalId: bigint
  userAddress?: string
  hasVoted: boolean
  isExpired: boolean
  isConfirming: boolean
  onVote: (support: boolean) => void
}) => {
  const daoMember = useDAOMember(userAddress)
  const stakedBalance = useStakedBalance(userAddress)
  const votingPower = useVotingPower(userAddress)

  const isMember = daoMember.data?.[0] || false
  const stakedBalanceNum = Number(formatTokenAmount(stakedBalance))
  const canVote = isMember && stakedBalanceNum >= 10

  if (isMember && canVote && !hasVoted && !isExpired) {
    return (
      <div className="flex gap-3">
        <Button 
          size="sm" 
          onClick={() => onVote(true)}
          disabled={isConfirming}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Vote For
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onVote(false)}
          disabled={isConfirming}
          className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent flex-1"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Vote Against
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 text-center">
      {!isMember && (
        <p className="text-sm text-slate-500 italic">Join the DAO to participate in voting</p>
      )}
      {isMember && !canVote && (
        <p className="text-sm text-amber-600 italic">Stake at least {MIN_STAKE_TO_VOTE} FARM tokens to vote</p>
      )}
      {isMember && canVote && hasVoted && (
        <p className="text-sm text-blue-600 italic">You have already voted on this proposal</p>
      )}
      {isExpired && (
        <p className="text-sm text-red-600 italic">Voting period has ended</p>
      )}
    </div>
  )
}

export function CooperativePage() {
  const { address } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('')
  const [approvalAmount, setApprovalAmount] = useState('')
  const [farmLocation, setFarmLocation] = useState('')
  const [showRequirements, setShowRequirements] = useState(true)
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    amount: '',
    proposalType: 0,
    recipient: ''
  })

  // All hooks called at the top level, in the same order every time
  const { joinDAO, stakeTokens, createProposal, isConfirming } = useFarmerDAO()
  const { approve } = useFarmToken()
  const daoMember = useDAOMember(address)
  const farmBalance = useFarmTokenBalance(address)
  const activeProposalIds = useActiveProposals()
  const totalProposals = useTotalProposals()
  const memberCount = useMemberCount()
  const treasuryBalance = useTreasuryBalance()
  const totalStaked = useTotalStaked()
  const votingPower = useVotingPower(address)
  const stakedBalance = useStakedBalance(address)

  const handleJoinDAO = async () => {
    if (!address || !farmLocation.trim()) return
    await joinDAO(farmLocation.trim())
  }

  const handleApprove = async () => {
    if (!approvalAmount || !address) return
    try {
      const amount = parseTokenAmount(approvalAmount)
      await approve(contracts.FARMER_DAO, amount)
      setApprovalAmount('')
    } catch (error) {
      console.error('Error approving tokens:', error)
    }
  }

  const handleStakeTokens = async () => {
    if (!stakeAmount || !address) return
    try {
      const amount = parseTokenAmount(stakeAmount)
      await stakeTokens(amount)
      setStakeAmount('')
    } catch (error) {
      console.error('Error staking tokens:', error)
    }
  }

  const handleCreateProposal = async () => {
    if (!newProposal.title || !address) return
    try {
      const amount = newProposal.amount ? parseTokenAmount(newProposal.amount) : BigInt(0)
      await createProposal(
        newProposal.title,
        newProposal.description,
        amount,
        newProposal.proposalType,
        newProposal.recipient || '0x0000000000000000000000000000000000000000'
      )
      setNewProposal({ title: '', description: '', amount: '', proposalType: 0, recipient: '' })
    } catch (error) {
      console.error('Error creating proposal:', error)
    }
  }

  const calculateVotingPercentage = (totalStakedAmount: bigint, userVotingPower: bigint) => {
    if (totalStakedAmount === BigInt(0)) return "0.0"
    return ((Number(userVotingPower) / Number(totalStakedAmount)) * 100).toFixed(1)
  }

  // Check if user is a DAO member
  const isMember = daoMember.data?.[0] || false
  const memberInfo = daoMember.data
  const reputation = memberInfo ? Number(memberInfo[3]) : 0
  const farmBalanceNum = Number(formatTokenAmount(farmBalance.data || BigInt(0)))
  const stakedBalanceNum = Number(formatTokenAmount(stakedBalance))
  const votingPowerNum = Number(formatTokenAmount(votingPower))

  // Check user capabilities
  const canJoin = farmBalanceNum > 0 && !isMember
  const canVote = isMember && stakedBalanceNum >= 10
  const canPropose = isMember && stakedBalanceNum >= 100
  const needsApproval = isMember && farmBalanceNum > 0

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
                  Farmer DAO
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">
                Participate in decentralized farmer governance and decision making
              </p>
            </div>
            <Button 
              onClick={() => setShowRequirements(!showRequirements)}
              variant="outline"
              className="border-emerald-300 text-emerald-100 hover:bg-emerald-800/60 bg-transparent"
            >
              <Info className="w-4 h-4 mr-2" />
              {showRequirements ? 'Hide' : 'Show'} Requirements
            </Button>
          </div>

          {/* Requirements Guide */}
          {showRequirements && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 mb-8">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  DAO Participation Requirements & Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Step 1: Join DAO */}
                  <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                      <h3 className="font-semibold text-blue-800">Join DAO</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Required:</span>
                        <span className="font-medium text-blue-700">Any FARM tokens</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Your Balance:</span>
                        <span className={`font-medium ${farmBalanceNum > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {farmBalance.formatted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Status:</span>
                        {canJoin ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">Ready</Badge>
                        ) : isMember ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300">Member</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-300">Need FARM</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Approve & Stake */}
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                      <h3 className="font-semibold text-emerald-800">Stake Tokens</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">To Vote:</span>
                        <span className="font-medium text-emerald-700">≥{MIN_STAKE_TO_VOTE} FARM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">To Propose:</span>
                        <span className="font-medium text-emerald-700">≥{MIN_STAKE_TO_PROPOSE} FARM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Your Staked:</span>
                        <span className={`font-medium ${stakedBalanceNum >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatTokenAmount(stakedBalance)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Can Vote:</span>
                        {canVote ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">Yes</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-300">No</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Voting Power */}
                  <div className="bg-purple-50/50 border border-purple-200 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                      <h3 className="font-semibold text-purple-800">Voting Power</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Formula:</span>
                        <span className="font-medium text-purple-700 text-xs">Staked + (Rep÷100)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Your Power:</span>
                        <span className="font-medium text-purple-700">{formatTokenAmount(votingPower)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Reputation:</span>
                        <span className="font-medium text-purple-700">{reputation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Vote Share:</span>
                        <span className="font-medium text-purple-700">{calculateVotingPercentage(totalStaked, votingPower)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Governance */}
                  <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">4</div>
                      <h3 className="font-semibold text-amber-800">Governance</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Voting Period:</span>
                        <span className="font-medium text-amber-700">{VOTING_PERIOD_DAYS} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Quorum:</span>
                        <span className="font-medium text-amber-700">{QUORUM_PERCENTAGE}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Super Majority:</span>
                        <span className="font-medium text-amber-700">{SUPER_MAJORITY}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Can Propose:</span>
                        {canPropose ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">Yes</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-300">No</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Status Alert */}
                <div className="mt-6">
                  {!address && (
                    <Alert className="border-amber-300 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        Connect your wallet to participate in the DAO
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {address && !isMember && farmBalanceNum === 0 && (
                    <Alert className="border-red-300 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        You need to own FARM tokens to join the DAO. Get some FARM tokens first!
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {address && !isMember && farmBalanceNum > 0 && (
                    <Alert className="border-green-300 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        You're ready to join the DAO! You have {farmBalance.formatted} FARM tokens.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isMember && stakedBalanceNum < 10 && (
                    <Alert className="border-blue-300 bg-blue-50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Stake at least 10 FARM tokens to vote on proposals. Stake 100+ to create proposals.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isMember && stakedBalanceNum >= 10 && stakedBalanceNum < 100 && (
                    <Alert className="border-emerald-300 bg-emerald-50">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        You can vote on proposals! Stake {100 - stakedBalanceNum} more FARM tokens to create proposals.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isMember && stakedBalanceNum >= 100 && (
                    <Alert className="border-purple-300 bg-purple-50">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        Full DAO participation unlocked! You can vote and create proposals.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* DAO Overview */}
          <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 mb-8">
            <CardHeader>
              <CardTitle className="text-emerald-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Farmer DAO Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-emerald-900/30 border border-emerald-700/30 p-4 rounded-lg text-center">
                  <p className="text-emerald-200/80 mb-2">Treasury</p>
                  <p className="text-2xl font-bold text-emerald-100 flex items-center justify-center gap-1">
                    <Coins className="w-5 h-5 text-amber-400" />
                    {formatTokenAmount(treasuryBalance)} ETH
                  </p>
                </div>
                <div className="bg-emerald-900/30 border border-emerald-700/30 p-4 rounded-lg text-center">
                  <p className="text-emerald-200/80 mb-2">Total Staked</p>
                  <p className="text-2xl font-bold text-emerald-100">{formatTokenAmount(totalStaked)} FARM</p>
                </div>
                <div className="bg-emerald-900/30 border border-emerald-700/30 p-4 rounded-lg text-center">
                  <p className="text-emerald-200/80 mb-2">Active Proposals</p>
                  <p className="text-2xl font-bold text-emerald-100">{activeProposalIds.length}</p>
                </div>
              </div>

              {isMember && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-900/30 border border-green-700/30 p-4 rounded-lg text-center">
                    <p className="text-green-200/80 mb-2">Your Staked</p>
                    <p className="text-lg font-bold text-green-100">{formatTokenAmount(stakedBalance)} FARM</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-700/30 p-4 rounded-lg text-center">
                    <p className="text-green-200/80 mb-2">Voting Power</p>
                    <p className="text-lg font-bold text-green-100">{formatTokenAmount(votingPower)}</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-700/30 p-4 rounded-lg text-center">
                    <p className="text-green-200/80 mb-2">Vote Share</p>
                    <p className="text-lg font-bold text-green-100">{calculateVotingPercentage(totalStaked, votingPower)}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Join DAO */}
          {!isMember && address && farmBalanceNum > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200/50 mb-8">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Join Farmer DAO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Farm Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Lagos, Nigeria"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button 
                    onClick={handleJoinDAO}
                    disabled={isConfirming || !farmLocation.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isConfirming ? 'Joining...' : 'Join DAO'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Member Actions */}
          {isMember && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Approve & Stake Tokens */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    Approve & Stake FARM Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Step 1: Approve */}
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Step 1: Approve DAO to spend your tokens</h4>
                      <p className="text-sm text-slate-600 mb-3">
                        Available Balance: {farmBalance.formatted} FARM
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount to approve"
                          value={approvalAmount}
                          onChange={(e) => setApprovalAmount(e.target.value)}
                          className="flex-1 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <Button 
                          onClick={handleApprove}
                          disabled={isConfirming || !approvalAmount}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {isConfirming ? 'Approving...' : 'Approve'}
                        </Button>
                      </div>
                    </div>

                    {/* Step 2: Stake */}
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Step 2: Stake tokens for voting rights</h4>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">To Vote:</span>
                            <span className="font-medium text-emerald-700 ml-2">≥{MIN_STAKE_TO_VOTE} FARM</span>
                          </div>
                          <div>
                            <span className="text-slate-600">To Propose:</span>
                            <span className="font-medium text-emerald-700 ml-2">≥{MIN_STAKE_TO_PROPOSE} FARM</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount to stake"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="flex-1 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <Button 
                          onClick={handleStakeTokens}
                          disabled={isConfirming || !stakeAmount}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {isConfirming ? 'Staking...' : 'Stake'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Create Proposal */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    Create Proposal
                    {!canPropose && (
                      <Badge variant="outline" className="text-red-600 border-red-300 ml-2">
                        Need {MIN_STAKE_TO_PROPOSE}+ FARM
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Proposal title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                      disabled={!canPropose}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <textarea
                      placeholder="Description"
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                      disabled={!canPropose}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <select
                      value={newProposal.proposalType}
                      onChange={(e) => setNewProposal({...newProposal, proposalType: Number(e.target.value)})}
                      disabled={!canPropose}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value={0}>💰 Funding - Fund a farmer or project</option>
                      <option value={1}>⚖️ Governance - Change DAO parameters</option>
                      <option value={2}>🎓 Certification - Approve certification programs</option>
                      <option value={3}>🚜 Equipment - Purchase shared equipment</option>
                      <option value={4}>🔬 Research - Fund agricultural research</option>
                    </select>
                    {(newProposal.proposalType === 0 || newProposal.proposalType === 3) && (
                      <>
                        <input
                          type="number"
                          placeholder="Amount (ETH)"
                          value={newProposal.amount}
                          onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
                          disabled={!canPropose}
                          className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          placeholder="Recipient address"
                          value={newProposal.recipient}
                          onChange={(e) => setNewProposal({...newProposal, recipient: e.target.value})}
                          disabled={!canPropose}
                          className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </>
                    )}
                    <Button 
                      onClick={handleCreateProposal}
                      disabled={isConfirming || !newProposal.title || !canPropose}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isConfirming ? 'Creating...' : canPropose ? 'Create Proposal' : `Need ${MIN_STAKE_TO_PROPOSE} FARM Staked`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Active Proposals */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 mb-8">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Vote className="w-5 h-5 text-emerald-600" />
                Active Proposals ({activeProposalIds.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeProposalIds.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <Vote className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium mb-2">No Active Proposals</h3>
                  <p className="text-sm">Be the first to create a proposal and shape the DAO's future!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeProposalIds.map((proposalId) => (
                    <ProposalCard 
                      key={proposalId.toString()} 
                      proposalId={proposalId} 
                      userAddress={address} 
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* DAO Stats */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                DAO Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-emerald-50/50 rounded-lg border border-emerald-200">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{memberCount}</div>
                  <div className="text-sm text-slate-600">Total Members</div>
                </div>
                <div className="text-center p-6 bg-green-50/50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{totalProposals}</div>
                  <div className="text-sm text-slate-600">Total Proposals</div>
                </div>
                <div className="text-center p-6 bg-amber-50/50 rounded-lg border border-amber-200">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{activeProposalIds.length}</div>
                  <div className="text-sm text-slate-600">Active Proposals</div>
                </div>
                <div className="text-center p-6 bg-blue-50/50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{Number(formatTokenAmount(totalStaked)).toFixed(0)}</div>
                  <div className="text-sm text-slate-600">FARM Staked</div>
                </div>
              </div>
              
              {/* Additional metrics */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-purple-50/50 rounded-lg border border-purple-200">
                  <div className="text-xl font-bold text-purple-600 mb-1">{formatTokenAmount(treasuryBalance)} ETH</div>
                  <div className="text-sm text-slate-600">Treasury Balance</div>
                </div>
                <div className="text-center p-4 bg-indigo-50/50 rounded-lg border border-indigo-200">
                  <div className="text-xl font-bold text-indigo-600 mb-1">{VOTING_PERIOD_DAYS} Days</div>
                  <div className="text-sm text-slate-600">Voting Period</div>
                </div>
                <div className="text-center p-4 bg-pink-50/50 rounded-lg border border-pink-200">
                  <div className="text-xl font-bold text-pink-600 mb-1">{QUORUM_PERCENTAGE}%</div>
                  <div className="text-sm text-slate-600">Quorum Required</div>
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