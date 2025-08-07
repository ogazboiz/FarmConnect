"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Vote, Plus, MessageSquare, Users, Coins, Star, TrendingUp, CheckCircle, XCircle, Clock, Wallet,
  Info, AlertTriangle, Shield, Target, Zap, Unlock, Lock
} from "lucide-react"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { toast } from "react-hot-toast"
import {
  useFarmerDAO,
  useDAOMember,
  useProposal,
  useFarmTokenBalance,
  useFarmToken,
  formatTokenAmount,
  parseTokenAmount,
  useFarmerReputation
} from "@/hooks/useAgriDAO"
import { useReadContract } from "wagmi"
import { FarmerDAOABI } from "@/config"
import { getContractAddresses } from "@/config"


interface ProposalData {
  title: string
  proposer: string
  deadline: bigint
  amount: bigint
  recipient: string
  proposalType: number
  votesFor: bigint
  votesAgainst: bigint
  executed: boolean
  cancelled: boolean
  description?: string
  [key: number]: string | number | bigint | boolean | undefined // for indexed access like proposal[3]
}

interface DAOMemberData {
  0: boolean  // isMember
  1: string   // farmLocation
  2: bigint   // joinedAt
  3: bigint   // reputation
  4: boolean  // isActive
}

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
  const hasVotedResult = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'hasUserVoted',
    args: proposalId && userAddress ? [proposalId, userAddress] : undefined,
    query: {
      enabled: !!(proposalId && userAddress),
    },
  })
  const hasVoted = hasVotedResult.data as boolean

  const { vote, isConfirming } = useFarmerDAO()
  const proposal = proposalQuery.data as ProposalData | null

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
  const isExpired = Number(proposal.deadline) <= Math.floor(Date.now() / 1000)

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
    <div className="p-6 transition-shadow border rounded-lg border-emerald-200 bg-emerald-50/30 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-800">{proposal.title}</h3>
            <Badge className={getProposalTypeColor(proposal.proposalType)}>
              {ProposalType[proposal.proposalType as keyof typeof ProposalType]}
            </Badge>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-slate-700">{proposal[3]}</p>
          <div className="flex items-center gap-4 mb-2 text-xs text-slate-600">
            <span>Proposer: {proposal.proposer?.slice(0, 6)}...{proposal.proposer?.slice(-4)}</span>
            {proposal.amount && Number(proposal.amount) > 0 && (
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-500" />
                Amount: {formatTokenAmount(proposal.amount)} ETH
              </span>
            )}
            {proposal.recipient && proposal.recipient !== '0x0000000000000000000000000000000000000000' && (
              <span>Recipient: {proposal.recipient?.slice(0, 6)}...{proposal.recipient?.slice(-4)}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <Badge className={isExpired ? "bg-red-100 text-red-800 border-red-300" : "bg-amber-100 text-amber-800 border-amber-300"}>
            <Clock className="w-3 h-3 mr-1" />
            {isExpired ? "Expired" : formatTimeLeft(proposal.deadline)}
          </Badge>
          {hasVoted && (
            <Badge className="text-blue-800 bg-blue-100 border-blue-300">
              Voted
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="grid items-start grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-3 sm:items-center">
          {/* Votes section */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <CheckCircle className="w-4 h-4 shrink-0" />
              For: {votesFor}
            </span>
            <span className="flex items-center gap-1 font-medium text-red-600">
              <XCircle className="w-4 h-4 shrink-0" />
              Against: {votesAgainst}
            </span>
          </div>

          {/* Total section */}
          <div className="font-medium text-slate-600 sm:text-right md:text-left">
            Total: {totalVotes}
          </div>
        </div>

        <Progress value={progressPercentage} className="h-3" />
        <div className="text-xs text-center text-slate-500">
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
  const stakedBalance = useStakedBalance(userAddress) as bigint
  const votingPower = useVotingPower(userAddress) as bigint

  const isMember = (daoMember.data as DAOMemberData | null)?.[0] || false
  const stakedBalanceNum = Number(formatTokenAmount(stakedBalance))
  const canVote = isMember && stakedBalanceNum >= 10

  if (isMember && canVote && !hasVoted && !isExpired) {
    return (
      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={() => onVote(true)}
          disabled={isConfirming}
          className="flex-1 text-white bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Vote For
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onVote(false)}
          disabled={isConfirming}
          className="flex-1 text-red-700 bg-transparent border-red-300 hover:bg-red-50"
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
        <p className="text-sm italic text-slate-500">Join the DAO to participate in voting</p>
      )}
      {isMember && !canVote && (
        <p className="text-sm italic text-amber-600">Stake at least {MIN_STAKE_TO_VOTE} FARM tokens to vote</p>
      )}
      {isMember && canVote && hasVoted && (
        <p className="text-sm italic text-blue-600">You have already voted on this proposal</p>
      )}
      {isExpired && (
        <p className="text-sm italic text-red-600">Voting period has ended</p>
      )}
    </div>
  )
}

export function CooperativePage() {
  const { address } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('') // NEW: Added unstake amount state
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
  const getReputationLevel = (reputation: number) => {
    if (reputation >= 1000) return { level: "Expert Farmer", color: "text-purple-600", icon: "🏆" }
    if (reputation >= 500) return { level: "Master Farmer", color: "text-blue-600", icon: "🥇" }
    if (reputation >= 200) return { level: "Experienced Farmer", color: "text-green-600", icon: "🥈" }
    if (reputation >= 50) return { level: "Skilled Farmer", color: "text-yellow-600", icon: "🥉" }
    if (reputation >= 10) return { level: "Farmer", color: "text-orange-600", icon: "🌱" }
    return { level: "New Farmer", color: "text-gray-600", icon: "🌿" }
  }

  // All hooks called at the top level, in the same order every time
  const { joinDAO, stakeTokens, unstakeTokens, createProposal, isConfirming } = useFarmerDAO() // NEW: Added unstakeTokens
  const { approve } = useFarmToken()
  const daoMember = useDAOMember(address)
  const farmBalance = useFarmTokenBalance(address)
  const activeProposalIds = useActiveProposals()
  const totalProposals = useTotalProposals()
  const memberCount = useMemberCount()
  const treasuryBalance = useTreasuryBalance() as bigint
  const totalStaked = useTotalStaked() as bigint
  const votingPowerResult = useVotingPower(address)
  const stakedBalanceResult = useStakedBalance(address)
  const farmerReputationResult = useFarmerReputation(address) // ADD THIS
  const farmerReputation = farmerReputationResult as bigint
  const totalReputation = Number(farmerReputation)
  const reputationInfo = getReputationLevel(totalReputation)

  const votingPower = votingPowerResult as bigint
  const stakedBalance = stakedBalanceResult as bigint

  const handleJoinDAO = async () => {
    if (!address || !farmLocation.trim()) {
      toast.error('Please enter your farm location')
      return
    }
    try {
      await joinDAO(farmLocation.trim())
      toast.success('DAO join request submitted! ⏳')
    } catch (error) {
      toast.error('Failed to join DAO. Please try again.')
      console.error('Join DAO error:', error)
    }
  }

  const handleApprove = async () => {
    if (!approvalAmount || !address) {
      toast.error('Please enter an approval amount')
      return
    }
    try {
      const amount = parseTokenAmount(approvalAmount)
      await approve(contracts.FARMER_DAO, amount)
      setApprovalAmount('')
      toast.success('Token approval submitted! ⏳')
    } catch (error) {
      console.error('Error approving tokens:', error)
      toast.error('Failed to approve tokens. Please try again.')
    }
  }

  const handleStakeTokens = async () => {
    if (!stakeAmount || !address) {
      toast.error('Please enter a stake amount')
      return
    }
    try {
      const amount = parseTokenAmount(stakeAmount)
      await stakeTokens(amount)
      setStakeAmount('')
      toast.success('Token staking submitted! ⏳')
    } catch (error) {
      console.error('Error staking tokens:', error)
      toast.error('Failed to stake tokens. Please try again.')
    }
  }

  // NEW: Handle unstake tokens
  const handleUnstakeTokens = async () => {
    if (!unstakeAmount || !address) return
    try {
      const amount = parseTokenAmount(unstakeAmount)
      await unstakeTokens(amount)
      setUnstakeAmount('')
    } catch (error) {
      console.error('Error unstaking tokens:', error)
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
  const memberData = daoMember.data as DAOMemberData | null
  const isMember = memberData?.[0] || false
  const reputation = memberData ? Number(memberData[3]) : 0
  const farmBalanceNum = Number(formatTokenAmount(farmBalance.data as bigint || BigInt(0)))
  const stakedBalanceNum = Number(formatTokenAmount(stakedBalance as bigint))
  const votingPowerNum = Number(formatTokenAmount(votingPower as bigint))


  // Check user capabilities
  const canJoin = farmBalanceNum > 0 && !isMember
  const canVote = isMember && stakedBalanceNum >= 10
  const canPropose = isMember && stakedBalanceNum >= 100
  const needsApproval = isMember && farmBalanceNum > 0

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-emerald-100">
                <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
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
              className="bg-transparent border-emerald-300 text-emerald-100 hover:bg-emerald-800/60"
            >
              <Info className="w-4 h-4 mr-2" />
              {showRequirements ? 'Hide' : 'Show'} Requirements
            </Button>
          </div>

          {/* Requirements Guide */}
          {showRequirements && (
            <Card className="mb-8 border-2 bg-white/90 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Target className="w-5 h-5 text-blue-600" />
                  DAO Participation Requirements & Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Step 1: Join DAO */}
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                    <div className="mb-3 text-center">
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 font-bold text-white bg-blue-600 rounded-full">1</div>
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
                          <Badge className="text-green-800 bg-green-100 border-green-300">Ready</Badge>
                        ) : isMember ? (
                          <Badge className="text-blue-800 bg-blue-100 border-blue-300">Member</Badge>
                        ) : (
                          <Badge className="text-red-800 bg-red-100 border-red-300">Need FARM</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Approve & Stake */}
                  <div className="p-4 border rounded-lg bg-emerald-50/50 border-emerald-200">
                    <div className="mb-3 text-center">
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 font-bold text-white rounded-full bg-emerald-600">2</div>
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
                          <Badge className="text-green-800 bg-green-100 border-green-300">Yes</Badge>
                        ) : (
                          <Badge className="text-red-800 bg-red-100 border-red-300">No</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Voting Power */}
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50/50">
                    <div className="mb-3 text-center">
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 font-bold text-white bg-purple-600 rounded-full">3</div>
                      <h3 className="font-semibold text-purple-800">Voting Power</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Formula:</span>
                        <span className="text-xs font-medium text-purple-700">Staked + (Rep÷100)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Your Power:</span>
                        <span className="font-medium text-purple-700">{formatTokenAmount(votingPower)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Reputation:</span>
                        <span className="font-medium text-purple-700">{totalReputation}</span> {/* FIXED: Use totalReputation */}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Vote Share:</span>
                        <span className="font-medium text-purple-700">{calculateVotingPercentage(totalStaked, votingPower)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Governance */}
                  <div className="p-4 border rounded-lg bg-amber-50/50 border-amber-200">
                    <div className="mb-3 text-center">
                      <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 font-bold text-white rounded-full bg-amber-600">4</div>
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
                          <Badge className="text-green-800 bg-green-100 border-green-300">Yes</Badge>
                        ) : (
                          <Badge className="text-red-800 bg-red-100 border-red-300">No</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Status Alert */}
                <div className="mt-6">
                  {!address && (
                    <Alert className="border-amber-300 bg-amber-50">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        Connect your wallet to participate in the DAO
                      </AlertDescription>
                    </Alert>
                  )}

                  {address && !isMember && farmBalanceNum === 0 && (
                    <Alert className="border-red-300 bg-red-50">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        You need to own FARM tokens to join the DAO. Get some FARM tokens first!
                      </AlertDescription>
                    </Alert>
                  )}

                  {address && !isMember && farmBalanceNum > 0 && (
                    <Alert className="border-green-300 bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        You&apos;re ready to join the DAO! You have {farmBalance.formatted} FARM tokens.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isMember && stakedBalanceNum < 10 && (
                    <Alert className="border-blue-300 bg-blue-50">
                      <Info className="w-4 h-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Stake at least 10 FARM tokens to vote on proposals. Stake 100+ to create proposals.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isMember && stakedBalanceNum >= 10 && stakedBalanceNum < 100 && (
                    <Alert className="border-emerald-300 bg-emerald-50">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        You can vote on proposals! Stake {100 - stakedBalanceNum} more FARM tokens to create proposals.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isMember && stakedBalanceNum >= 100 && (
                    <Alert className="border-purple-300 bg-purple-50">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        Full DAO participation unlocked! You can vote and create proposals.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* NEW: Unstaking info for members with staked tokens */}
                  {isMember && stakedBalanceNum > 0 && (
                    <Alert className="mt-4 border-indigo-300 bg-indigo-50">
                      <Unlock className="w-4 h-4 text-indigo-600" />
                      <AlertDescription className="text-indigo-800">
                        <strong>Token Recovery:</strong> You have {formatTokenAmount(stakedBalance)} FARM staked.
                        You can unstake any amount anytime - no penalties or lock periods!
                        Your tokens are safe and under your control.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* DAO Overview */}
          <Card className="mb-8 border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-100">
                <Users className="w-5 h-5 text-emerald-400" />
                Farmer DAO Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="p-4 text-center border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                  <p className="mb-2 text-emerald-200/80">Treasury</p>
                  <p className="flex items-center justify-center gap-1 text-2xl font-bold text-emerald-100">
                    <Coins className="w-5 h-5 text-amber-400" />
                    {formatTokenAmount(treasuryBalance)} ETH
                  </p>
                </div>
                <div className="p-4 text-center border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                  <p className="mb-2 text-emerald-200/80">Total Staked</p>
                  <p className="text-2xl font-bold text-emerald-100">{formatTokenAmount(totalStaked)} FARM</p>
                </div>
                <div className="p-4 text-center border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                  <p className="mb-2 text-emerald-200/80">Active Proposals</p>
                  <p className="text-2xl font-bold text-emerald-100">{activeProposalIds.length}</p>
                </div>
                <div className="p-4 text-center border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                  <p className="mb-2 text-emerald-200/80">Total Members</p>
                  <p className="text-2xl font-bold text-emerald-100">{memberCount}</p>
                </div>
              </div>

              {isMember && (
                <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-4">
                  <div className="p-4 text-center border rounded-lg bg-green-900/30 border-green-700/30">
                    <p className="mb-2 text-green-200/80">Your Staked</p>
                    <p className="text-lg font-bold text-green-100">{formatTokenAmount(stakedBalance)} FARM</p>
                  </div>
                  <div className="p-4 text-center border rounded-lg bg-green-900/30 border-green-700/30">
                    <p className="mb-2 text-green-200/80">Voting Power</p>
                    <p className="text-lg font-bold text-green-100">{formatTokenAmount(votingPower)}</p>
                  </div>
                  <div className="p-4 text-center border rounded-lg bg-green-900/30 border-green-700/30">
                    <p className="mb-2 text-green-200/80">Vote Share</p>
                    <p className="text-lg font-bold text-green-100">{calculateVotingPercentage(totalStaked, votingPower)}%</p>
                  </div>
                  {/* NEW: Reputation Display */}
                  <div className="p-4 text-center border rounded-lg bg-purple-900/30 border-purple-700/30">
                    <p className="mb-2 text-purple-200/80">Reputation</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">{reputationInfo.icon}</span>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-100">{totalReputation}</p>
                        <p className={`text-xs ${reputationInfo.color}`}>{reputationInfo.level}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {isMember && totalReputation > 0 && (
                <div className="mt-6">
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm text-purple-800">
                        <Star className="w-4 h-4" />
                        Your Farming Reputation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <span className="text-2xl">{reputationInfo.icon}</span>
                          <div>
                            <p className="text-xl font-bold text-purple-800">{totalReputation} points</p>
                            <p className={`text-sm ${reputationInfo.color} font-medium`}>{reputationInfo.level}</p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          Earn reputation by creating crops and receiving scans, ratings, and shares from consumers!
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Join DAO */}
          {!isMember && address && farmBalanceNum > 0 && (
            <Card className="mb-8 border-2 bg-white/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Join Farmer DAO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
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
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
              {/* Approve & Stake/Unstake Tokens */}
              <Card className="border-2 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    Manage FARM Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Token Balance Info */}
                    <div className="p-4 border rounded-lg bg-emerald-50 border-emerald-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Available Balance:</span>
                          <span className="ml-2 font-medium text-emerald-700">{farmBalance.formatted} FARM</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Staked Balance:</span>
                          <span className="ml-2 font-medium text-emerald-700">{formatTokenAmount(stakedBalance)} FARM</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 1: Approve */}
                    <div>
                      <h4 className="mb-2 font-semibold text-slate-700">Step 1: Approve DAO to spend your tokens</h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount to approve"
                          value={approvalAmount}
                          onChange={(e) => setApprovalAmount(e.target.value)}
                          className="flex-1 p-3 border rounded-lg border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      <h4 className="mb-2 font-semibold text-slate-700">Step 2: Stake tokens for voting rights</h4>
                      <div className="p-3 mb-3 border rounded-lg bg-emerald-50 border-emerald-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">To Vote:</span>
                            <span className="ml-2 font-medium text-emerald-700">≥{MIN_STAKE_TO_VOTE} FARM</span>
                          </div>
                          <div>
                            <span className="text-slate-600">To Propose:</span>
                            <span className="ml-2 font-medium text-emerald-700">≥{MIN_STAKE_TO_PROPOSE} FARM</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount to stake"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="flex-1 p-3 border rounded-lg border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <Button
                          onClick={handleStakeTokens}
                          disabled={isConfirming || !stakeAmount}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          {isConfirming ? 'Staking...' : 'Stake'}
                        </Button>
                      </div>
                    </div>

                    {/* NEW: Step 3: Unstake */}
                    {stakedBalanceNum > 0 && (
                      <div>
                        <h4 className="mb-2 font-semibold text-slate-700">Step 3: Unstake tokens (withdraw anytime)</h4>
                        <div className="p-3 mb-3 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center gap-2 text-sm text-blue-700">
                            <Unlock className="w-4 h-4" />
                            <span>
                              <strong>No penalties!</strong> You can unstake any amount up to {formatTokenAmount(stakedBalance)} FARM.
                              Your tokens return to your wallet immediately.
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Amount to unstake"
                            value={unstakeAmount}
                            onChange={(e) => setUnstakeAmount(e.target.value)}
                            max={formatTokenAmount(stakedBalance)}
                            className="flex-1 p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <Button
                            onClick={handleUnstakeTokens}
                            disabled={isConfirming || !unstakeAmount || Number(unstakeAmount) > stakedBalanceNum}
                            variant="outline"
                            className="text-blue-700 border-blue-300 hover:bg-blue-50"
                          >
                            <Unlock className="w-4 h-4 mr-1" />
                            {isConfirming ? 'Unstaking...' : 'Unstake'}
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setUnstakeAmount((stakedBalanceNum / 2).toString())}
                            className="text-xs text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            Half ({(stakedBalanceNum / 2).toFixed(1)})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setUnstakeAmount(stakedBalanceNum.toString())}
                            className="text-xs text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            Max ({stakedBalanceNum.toFixed(1)})
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Create Proposal */}
              <Card className="border-2 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Plus className="w-5 h-5 text-green-600" />
                    Create Proposal
                    {!canPropose && (
                      <Badge variant="outline" className="ml-2 text-red-600 border-red-300">
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
                      onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                      disabled={!canPropose}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <textarea
                      placeholder="Description"
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                      disabled={!canPropose}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <select
                      value={newProposal.proposalType}
                      onChange={(e) => setNewProposal({ ...newProposal, proposalType: Number(e.target.value) })}
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
                          onChange={(e) => setNewProposal({ ...newProposal, amount: e.target.value })}
                          disabled={!canPropose}
                          className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          placeholder="Recipient address"
                          value={newProposal.recipient}
                          onChange={(e) => setNewProposal({ ...newProposal, recipient: e.target.value })}
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
          <Card className="w-full max-w-full mb-8 overflow-hidden border-2 bg-white/80 backdrop-blur-sm border-emerald-200/50">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2 text-base break-words text-slate-800 sm:text-lg">
                <Vote className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="truncate">{`Active Proposals (${activeProposalIds.length})`}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="w-full overflow-x-auto">
              {activeProposalIds.length === 0 ? (
                <div className="py-12 text-center text-slate-600">
                  <Vote className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="mb-2 text-base font-medium sm:text-lg">No Active Proposals</h3>
                  <p className="text-sm sm:text-base">
                    Be the first to create a proposal and shape the DAO&apos;s future!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
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
          <Card className="border-2 bg-white/80 backdrop-blur-sm border-emerald-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <TrendingUp className="w-5 h-5 text-green-600" />
                DAO Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="p-6 text-center border rounded-lg bg-emerald-50/50 border-emerald-200">
                  <div className="mb-2 text-3xl font-bold text-emerald-600">{memberCount}</div>
                  <div className="text-sm text-slate-600">Total Members</div>
                </div>
                <div className="p-6 text-center border border-green-200 rounded-lg bg-green-50/50">
                  <div className="mb-2 text-3xl font-bold text-green-600">{totalProposals}</div>
                  <div className="text-sm text-slate-600">Total Proposals</div>
                </div>
                <div className="p-6 text-center border rounded-lg bg-amber-50/50 border-amber-200">
                  <div className="mb-2 text-3xl font-bold text-amber-600">{activeProposalIds.length}</div>
                  <div className="text-sm text-slate-600">Active Proposals</div>
                </div>
                <div className="p-6 text-center border border-blue-200 rounded-lg bg-blue-50/50">
                  <div className="mb-2 text-3xl font-bold text-blue-600">{Number(formatTokenAmount(totalStaked)).toFixed(0)}</div>
                  <div className="text-sm text-slate-600">FARM Staked</div>
                </div>
              </div>

              {/* Additional metrics */}
              <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
                <div className="p-4 text-center border border-purple-200 rounded-lg bg-purple-50/50">
                  <div className="mb-1 text-xl font-bold text-purple-600">{formatTokenAmount(treasuryBalance)} ETH</div>
                  <div className="text-sm text-slate-600">Treasury Balance</div>
                </div>
                <div className="p-4 text-center border border-indigo-200 rounded-lg bg-indigo-50/50">
                  <div className="mb-1 text-xl font-bold text-indigo-600">{VOTING_PERIOD_DAYS} Days</div>
                  <div className="text-sm text-slate-600">Voting Period</div>
                </div>
                <div className="p-4 text-center border border-pink-200 rounded-lg bg-pink-50/50">
                  <div className="mb-1 text-xl font-bold text-pink-600">{QUORUM_PERCENTAGE}%</div>
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