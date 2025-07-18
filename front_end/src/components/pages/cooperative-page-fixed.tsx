"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from 'react-hot-toast'
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Vote, Plus, Users, Coins, TrendingUp, CheckCircle, XCircle, Clock, Wallet, 
  Info, AlertTriangle, Shield, Target, Zap, RefreshCw
} from "lucide-react"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { 
  useFarmerDAO, 
  useDAOMember, 
  useProposal, 
  useFarmTokenBalance,
  useFarmToken,
  useStakedBalance,
  useTotalStaked,
  useTreasuryBalance,
  formatTokenAmount,
  parseTokenAmount 
} from "@/hooks/useAgriDAO"
import { useReadContract } from "wagmi"
import { FarmerDAOABI } from "@/config"
import { getContractAddresses } from "@/config"
import { useGlobalRefresh } from "@/contexts/RefreshContext"

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
    query: {
      // Reduce cache time to ensure fresh data after transactions
      cacheTime: 5000, // 5 seconds
      staleTime: 0, // Always consider stale to force refetch
    },
  })

  return Array.isArray(activeProposalIds) ? activeProposalIds : []
}

// Hook to get total proposals count
const useTotalProposals = () => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getTotalProposals',
    query: {
      // Reduce cache time to ensure fresh data after transactions
      cacheTime: 5000, // 5 seconds
      staleTime: 0, // Always consider stale to force refetch
    },
  })
  
  return data ? Number(data) : 0
}

// Hook to get member count
const useMemberCount = () => {
  const { data } = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getMemberCount',
    query: {
      // Reduce cache time to ensure fresh data after transactions
      cacheTime: 5000, // 5 seconds
      staleTime: 0, // Always consider stale to force refetch
    },
  })
  
  return data ? Number(data) : 0
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
      // Reduce cache time to ensure fresh data after transactions
      cacheTime: 5000, // 5 seconds
      staleTime: 0, // Always consider stale to force refetch
    },
  })
  
  return data || BigInt(0)
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
    0: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 shadow-sm', // FUNDING
    1: 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200 shadow-sm', // GOVERNANCE
    2: 'bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 border border-blue-200 shadow-sm', // CERTIFICATION
    3: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 shadow-sm', // EQUIPMENT
    4: 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200 shadow-sm', // RESEARCH
  }
  return colors[type as keyof typeof colors] || 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border border-slate-200 shadow-sm'
}

// Individual Proposal Component to isolate hooks
const ProposalCard = ({ proposalId, userAddress, refreshTrigger }: { 
  proposalId: bigint, 
  userAddress?: string,
  refreshTrigger?: number 
}) => {
  const proposalQuery = useProposal(proposalId)
  const hasVotedQuery = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'hasUserVoted',
    args: proposalId && userAddress ? [proposalId, userAddress] : undefined,
    query: {
      enabled: !!(proposalId && userAddress),
      // Reduce cache time to ensure fresh data after transactions
      cacheTime: 5000, // 5 seconds
      staleTime: 0, // Always consider stale to force refetch
    },
  })

  const { vote, isConfirming, isSuccess, hash, isPending } = useFarmerDAO()
  const proposal = proposalQuery.data
  const hasVoted = hasVotedQuery.data
  
  // Global refresh context
  const { triggerRefreshWithDelay } = useGlobalRefresh()

  // Track processed transaction hashes for this proposal card
  const [processedTxHashes, setProcessedTxHashes] = useState<Set<string>>(new Set())

  // Watch for voting transaction success
  useEffect(() => {
    console.log('ProposalCard voting transaction watcher triggered:', {
      proposalId: proposalId.toString(),
      isSuccess,
      hash,
      isConfirming,
      isPending,
      processedHashes: Array.from(processedTxHashes)
    })

    if (isSuccess && hash && !processedTxHashes.has(hash)) {
      console.log('Voting transaction confirmed for proposal:', proposalId.toString(), 'hash:', hash)
      
      // Show success toast
      toast.success('Vote confirmed! Updating proposal... ✅')
      
      // Mark this hash as processed
      setProcessedTxHashes(prev => new Set(prev).add(hash))
      
      // Trigger global refresh (which will update header)
      triggerRefreshWithDelay(1500)
      
      // Immediate refresh of this proposal's data
      setTimeout(() => {
        console.log('Refreshing proposal data after vote confirmation')
        if (proposalQuery.refetch) {
          proposalQuery.refetch()
        }
        if (hasVotedQuery.refetch) {
          hasVotedQuery.refetch()
        }
      }, 1000) // 1 second delay for proposal refresh
      
      // Secondary refresh for vote propagation
      setTimeout(() => {
        console.log('Secondary refresh for proposal:', proposalId.toString())
        if (proposalQuery.refetch) {
          proposalQuery.refetch()
        }
        if (hasVotedQuery.refetch) {
          hasVotedQuery.refetch()
        }
      }, 3000) // 3 second delay for secondary refresh
    }
  }, [isSuccess, hash, isConfirming, isPending, proposalId, proposalQuery, hasVotedQuery, triggerRefreshWithDelay, processedTxHashes])

  // Refetch when refreshTrigger changes, but with debouncing to avoid excessive calls
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log('ProposalCard refetch triggered for proposal:', proposalId.toString(), 'trigger:', refreshTrigger)
      const timer = setTimeout(() => {
        if (proposalQuery.refetch) {
          console.log('Executing ProposalCard refetch for proposal:', proposalId.toString())
          proposalQuery.refetch()
        }
        if (hasVotedQuery.refetch) {
          console.log('Executing hasVoted refetch for proposal:', proposalId.toString())
          hasVotedQuery.refetch()
        }
      }, 500) // Debounce refetch calls
      
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]) // Intentionally excluding query objects to avoid infinite loops

  console.log("Proposal", proposal)

  const handleVote = async (support: boolean) => {
    if (!userAddress) return
    console.log('Voting on proposal:', proposalId.toString(), 'support:', support)
    await vote(proposalId, support)
    console.log('Vote initiated, waiting for confirmation...')
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
    <div className="p-8 transition-all duration-300 bg-white border shadow-lg border-slate-200 rounded-xl hover:shadow-xl hover:border-slate-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-semibold leading-tight text-slate-800">{proposal.title}</h3>
            <Badge className={`${getProposalTypeColor(proposal.proposalType)} font-medium`}>
              {ProposalType[proposal.proposalType as keyof typeof ProposalType]}
            </Badge>
          </div>
          <p className="mb-4 leading-relaxed text-slate-600">{proposal[3]}</p>
          <div className="flex items-center gap-6 mb-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              Proposer: {proposal.proposer?.slice(0, 6)}...{proposal.proposer?.slice(-4)}
            </span>
            {proposal.amount && Number(proposal.amount) > 0 && (
              <span className="flex items-center gap-2 px-3 py-1 border rounded-full bg-emerald-50 border-emerald-200">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-emerald-700">{formatTokenAmount(proposal.amount)} ETH</span>
              </span>
            )}
            {proposal.recipient && proposal.recipient !== '0x0000000000000000000000000000000000000000' && (
              <span className="text-slate-500">Recipient: {proposal.recipient?.slice(0, 6)}...{proposal[10]?.slice(-4)}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 ml-6">
          <Badge className={`${isExpired ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"} font-medium shadow-sm`}>
            <Clock className="w-3 h-3 mr-2" />
            {isExpired ? "Expired" : formatTimeLeft(proposal.deadline)}
          </Badge>
          {hasVoted && (
            <Badge className="font-medium text-blue-700 border-blue-200 shadow-sm bg-blue-50">
              <CheckCircle className="w-3 h-3 mr-2" />
              Voted
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-semibold text-emerald-700">For: {votesFor}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-red-700">Against: {votesAgainst}</span>
            </div>
          </div>
          <span className="font-semibold text-slate-700">Total: {totalVotes}</span>
        </div>
        <div className="w-full h-3 overflow-hidden rounded-full shadow-inner bg-slate-200">
          <div 
            className="h-full transition-all duration-500 ease-out bg-gradient-to-r from-emerald-500 to-emerald-600"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-sm text-center text-slate-500">
          <span className="font-medium">{progressPercentage.toFixed(1)}%</span> in favor • Quorum needed: <span className="font-medium">{QUORUM_PERCENTAGE}%</span> of staked tokens
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

  const isMember = daoMember.data?.[0] || false
  const stakedBalanceNum = Number(formatTokenAmount(stakedBalance.data || BigInt(0)))
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
  const { joinDAO, stakeTokens, createProposal, isConfirming, isSuccess, hash, isPending } = useFarmerDAO()
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

  // Global refresh context
  const { triggerRefreshWithDelay } = useGlobalRefresh()

  // Get refetch functions for the local hooks
  const activeProposalsQuery = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getActiveProposals',
    query: {
      cacheTime: 5000,
      staleTime: 0,
    },
  })

  const totalProposalsQuery = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getTotalProposals',
    query: {
      cacheTime: 5000,
      staleTime: 0,
    },
  })

  const memberCountQuery = useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getMemberCount',
    query: {
      cacheTime: 5000,
      staleTime: 0,
    },
  })

  // Cache invalidation function
  const invalidateQueries = useCallback(() => {
    console.log('Invalidating DAO queries - refetching member data and proposals')
    
    // Refetch member-specific data
    if (daoMember.refetch) daoMember.refetch()
    if (farmBalance.refetch) farmBalance.refetch()
    if (treasuryBalance.refetch) treasuryBalance.refetch()
    if (totalStaked.refetch) totalStaked.refetch()
    if (stakedBalance.refetch) stakedBalance.refetch()
    
    // Refetch DAO-wide data
    if (activeProposalsQuery.refetch) activeProposalsQuery.refetch()
    if (totalProposalsQuery.refetch) totalProposalsQuery.refetch()
    if (memberCountQuery.refetch) memberCountQuery.refetch()
    
    console.log('DAO queries invalidated')
  }, [daoMember, farmBalance, treasuryBalance, totalStaked, stakedBalance, activeProposalsQuery, totalProposalsQuery, memberCountQuery])

  // Force refetch with retry mechanism
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const forceRefreshDAO = useCallback(async () => {
    console.log('Force refresh DAO triggered - updating refresh trigger and invalidating queries')
    setRefreshTrigger(prev => {
      const newValue = prev + 1
      console.log('DAO refresh trigger updated from', prev, 'to', newValue)
      return newValue
    })
    
    // Initial refresh
    invalidateQueries()
    
    // Retry mechanism - sometimes blockchain state takes time to propagate
    setTimeout(() => {
      console.log('DAO retry refresh #1 after 3 seconds')
      invalidateQueries()
    }, 3000)
    
    setTimeout(() => {
      console.log('DAO retry refresh #2 after 6 seconds')
      invalidateQueries()
    }, 6000)
  }, [invalidateQueries])

  // Track processed transaction hashes to avoid duplicate refreshes
  const [processedTxHashes, setProcessedTxHashes] = useState<Set<string>>(new Set())

  // Watch for transaction success to trigger refetch
  useEffect(() => {
    console.log('DAO transaction watcher triggered:', {
      isSuccess,
      hash,
      isConfirming,
      isPending,
      processedHashes: Array.from(processedTxHashes)
    })

    if (isSuccess && hash && !processedTxHashes.has(hash)) {
      console.log('DAO transaction confirmed, refreshing UI:', hash)
      
      // Show success toast
      toast.success('Transaction confirmed! UI updating... ✅')
      
      // Mark this hash as processed
      setProcessedTxHashes(prev => new Set(prev).add(hash))
      
      // Trigger global refresh (which will update header and this page)
      triggerRefreshWithDelay(2000) // 2 second delay
      
      // Also trigger local refresh for immediate feedback
      setTimeout(() => {
        console.log('Executing delayed DAO refresh after transaction confirmation')
        forceRefreshDAO()
      }, 2000) // 2 second delay
    }
  }, [isSuccess, hash, isConfirming, isPending, forceRefreshDAO, processedTxHashes, triggerRefreshWithDelay])

  const handleJoinDAO = async () => {
    if (!address || !farmLocation.trim()) return
    console.log('Joining DAO with location:', farmLocation.trim())
    await joinDAO(farmLocation.trim())
    console.log('DAO join initiated, waiting for confirmation...')
  }

  const handleApprove = async () => {
    if (!approvalAmount || !address) return
    try {
      console.log('Approving tokens for DAO:', approvalAmount)
      const amount = parseTokenAmount(approvalAmount)
      await approve(contracts.FARMER_DAO, amount)
      console.log('Token approval initiated, waiting for confirmation...')
      setApprovalAmount('')
    } catch (error) {
      console.error('Error approving tokens:', error)
    }
  }

  const handleStakeTokens = async () => {
    if (!stakeAmount || !address) return
    try {
      console.log('Staking tokens:', stakeAmount)
      const amount = parseTokenAmount(stakeAmount)
      await stakeTokens(amount)
      console.log('Token staking initiated, waiting for confirmation...')
      setStakeAmount('')
    } catch (error) {
      console.error('Error staking tokens:', error)
    }
  }

  const handleCreateProposal = async () => {
    if (!newProposal.title || !address) return
    try {
      console.log('Creating proposal:', newProposal.title)
      const amount = newProposal.amount ? parseTokenAmount(newProposal.amount) : BigInt(0)
      await createProposal(
        newProposal.title,
        newProposal.description,
        amount,
        newProposal.proposalType,
        newProposal.recipient || '0x0000000000000000000000000000000000000000'
      )
      console.log('Proposal creation initiated, waiting for confirmation...')
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
  const stakedBalanceNum = Number(formatTokenAmount(stakedBalance.data || BigInt(0)))

  // Check user capabilities
  const canJoin = farmBalanceNum > 0 && !isMember
  const canVote = isMember && stakedBalanceNum >= 10
  const canPropose = isMember && stakedBalanceNum >= 100

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
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={forceRefreshDAO}
                disabled={isConfirming}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isConfirming ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={() => setShowRequirements(!showRequirements)}
                variant="outline"
                className="bg-transparent border-emerald-300 text-emerald-100 hover:bg-emerald-800/60"
              >
                <Info className="w-4 h-4 mr-2" />
                {showRequirements ? 'Hide' : 'Show'} Requirements
              </Button>
            </div>
          </div>

          {/* Requirements Guide */}
          {showRequirements && (
            <Card className="mb-8 border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40 ">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-100">
                  <Target className="w-5 h-5 text-emerald-600" />
                  DAO Participation Requirements & Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Step 1: Join DAO */}
                  <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
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
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
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
                          {formatTokenAmount(stakedBalance.data || BigInt(0))}
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
                  <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50">
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
                        <span className="font-medium text-purple-700">{formatTokenAmount(votingPower.data || BigInt(0))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Reputation:</span>
                        <span className="font-medium text-purple-700">{reputation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Vote Share:</span>
                        <span className="font-medium text-purple-700">{calculateVotingPercentage(totalStaked.data || BigInt(0), votingPower.data || BigInt(0))}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Governance */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
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
                    <Alert className="border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        Connect your wallet to participate in the DAO
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {address && !isMember && farmBalanceNum === 0 && (
                    <Alert className="border-red-300 bg-gradient-to-r from-red-50 to-rose-50">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        You need to own FARM tokens to join the DAO. Get some FARM tokens first!
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {address && !isMember && farmBalanceNum > 0 && (
                    <Alert className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        You&apos;re ready to join the DAO! You have {farmBalance.formatted} FARM tokens.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isMember && stakedBalanceNum < 10 && (
                    <Alert className="border-blue-300 bg-gradient-to-r from-blue-50 to-sky-50">
                      <Info className="w-4 h-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Stake at least 10 FARM tokens to vote on proposals. Stake 100+ to create proposals.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isMember && stakedBalanceNum >= 10 && stakedBalanceNum < 100 && (
                    <Alert className="border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        You can vote on proposals! Stake {100 - stakedBalanceNum} more FARM tokens to create proposals.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isMember && stakedBalanceNum >= 100 && (
                    <Alert className="border-purple-300 bg-gradient-to-r from-purple-50 to-violet-50">
                      <Zap className="w-4 h-4 text-purple-600" />
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
          <div className="p-8 mb-8 border shadow-xl bg-emerald-800/40 border-emerald-700/40 backdrop-blur-lg rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-100">Farmer DAO Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-6 text-center transition-all duration-300 border shadow-md bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 rounded-xl hover:shadow-lg hover:scale-105">
                <div className="flex justify-center mb-3">
                  <div className="p-3 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="mb-2 text-sm font-medium tracking-wide uppercase text-amber-700">Treasury Balance</p>
                <p className="text-3xl font-bold text-amber-800">
                  {formatTokenAmount(treasuryBalance.data || BigInt(0))} ETH
                </p>
              </div>
              
              <div className="p-6 text-center transition-all duration-300 border shadow-md bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 rounded-xl hover:shadow-lg hover:scale-105">
                <div className="flex justify-center mb-3">
                  <div className="p-3 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="mb-2 text-sm font-medium tracking-wide uppercase text-emerald-700">Total Staked</p>
                <p className="text-3xl font-bold text-emerald-800">
                  {formatTokenAmount(totalStaked.data || BigInt(0))} FARM
                </p>
              </div>
              
              <div className="p-6 text-center transition-all duration-300 border border-blue-200 shadow-md bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl hover:shadow-lg hover:scale-105">
                <div className="flex justify-center mb-3">
                  <div className="p-3 shadow-lg bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl">
                    <Vote className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="mb-2 text-sm font-medium tracking-wide text-blue-700 uppercase">Active Proposals</p>
                <p className="text-3xl font-bold text-blue-800">{activeProposalIds.length}</p>
              </div>
            </div>

            {isMember && (
              <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
                <div className="p-5 text-center transition-all duration-300 border shadow-md bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-xl hover:shadow-lg hover:scale-105">
                  <p className="mb-2 text-sm font-medium tracking-wide uppercase text-violet-700">Your Staked</p>
                  <p className="text-2xl font-bold text-violet-800">{formatTokenAmount(stakedBalance.data || BigInt(0))} FARM</p>
                </div>
                <div className="p-5 text-center transition-all duration-300 border border-indigo-200 shadow-md bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl hover:shadow-lg hover:scale-105">
                  <p className="mb-2 text-sm font-medium tracking-wide text-indigo-700 uppercase">Voting Power</p>
                  <p className="text-2xl font-bold text-indigo-800">{formatTokenAmount(votingPower.data || BigInt(0))}</p>
                </div>
                <div className="p-5 text-center transition-all duration-300 border border-pink-200 shadow-md bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl hover:shadow-lg hover:scale-105">
                  <p className="mb-2 text-sm font-medium tracking-wide text-pink-700 uppercase">Vote Share</p>
                  <p className="text-2xl font-bold text-pink-800">{calculateVotingPercentage(totalStaked.data || BigInt(0), votingPower.data || BigInt(0))}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
            {/* Main Content - Proposals and Actions */}
            <div className="lg:col-span-2">
              {/* Join DAO Section */}
              {!isMember && address && farmBalanceNum > 0 && (
                <Card className="mb-6 border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-100">
                      <Shield className="w-5 h-5 text-amber-400" />
                      Join Farmer DAO
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-emerald-200">
                          Farm Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Lagos, Nigeria"
                          value={farmLocation}
                          onChange={(e) => setFarmLocation(e.target.value)}
                          className="w-full p-3 border rounded-lg border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-emerald-300/60"
                        />
                      </div>
                      <Button 
                        onClick={handleJoinDAO}
                        disabled={isConfirming || !farmLocation.trim()}
                        className="w-full text-white bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isConfirming ? 'Joining...' : 'Join DAO'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Member Actions */}
              {isMember && (
                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                  {/* Approve & Stake Tokens */}
                  <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-100">
                        <Wallet className="w-5 h-5 text-amber-400" />
                        Stake FARM Tokens
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Approve */}
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-emerald-200">Approve DAO Access</h4>
                          <p className="mb-3 text-xs text-emerald-300/80">
                            Balance: {farmBalance.formatted} FARM
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Amount"
                              value={approvalAmount}
                              onChange={(e) => setApprovalAmount(e.target.value)}
                              className="flex-1 p-2 text-sm border rounded border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-1 focus:ring-emerald-500 placeholder:text-emerald-300/60"
                            />
                            <Button 
                              onClick={handleApprove}
                              disabled={isConfirming || !approvalAmount}
                              size="sm"
                              className="text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                              Approve
                            </Button>
                          </div>
                        </div>

                        {/* Stake */}
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-emerald-200">Stake for Voting</h4>
                          <div className="p-2 mb-3 border rounded bg-emerald-900/30 border-emerald-600/30">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-emerald-300/80">Vote: ≥{MIN_STAKE_TO_VOTE}</div>
                              <div className="text-emerald-300/80">Propose: ≥{MIN_STAKE_TO_PROPOSE}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Amount"
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                              className="flex-1 p-2 text-sm border rounded border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-1 focus:ring-emerald-500 placeholder:text-emerald-300/60"
                            />
                            <Button 
                              onClick={handleStakeTokens}
                              disabled={isConfirming || !stakeAmount}
                              size="sm"
                              className="text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                              Stake
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Create Proposal */}
                  <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-100">
                        <Plus className="w-5 h-5 text-amber-400" />
                        Create Proposal
                        {!canPropose && (
                          <Badge variant="outline" className="ml-2 text-red-300 border-red-400/50 bg-red-900/20">
                            Need {MIN_STAKE_TO_PROPOSE}+ FARM
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Proposal title"
                          value={newProposal.title}
                          onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                          disabled={!canPropose}
                          className="w-full p-2 text-sm border rounded border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 placeholder:text-emerald-300/60"
                        />
                        <textarea
                          placeholder="Description"
                          value={newProposal.description}
                          onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                          disabled={!canPropose}
                          rows={2}
                          className="w-full p-2 text-sm border rounded border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 placeholder:text-emerald-300/60"
                        />
                        <select
                          value={newProposal.proposalType}
                          onChange={(e) => setNewProposal({...newProposal, proposalType: Number(e.target.value)})}
                          disabled={!canPropose}
                          className="w-full p-2 text-sm border rounded border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                        >
                          <option value={0}>💰 Funding</option>
                          <option value={1}>⚖️ Governance</option>
                          <option value={2}>🎓 Certification</option>
                          <option value={3}>🚜 Equipment</option>
                          <option value={4}>🔬 Research</option>
                        </select>
                        {(newProposal.proposalType === 0 || newProposal.proposalType === 3) && (
                          <>
                            <input
                              type="number"
                              placeholder="Amount (ETH)"
                              value={newProposal.amount}
                              onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
                              disabled={!canPropose}
                              className="w-full p-2 text-sm border rounded border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 placeholder:text-emerald-300/60"
                            />
                            <input
                              type="text"
                              placeholder="Recipient address"
                              value={newProposal.recipient}
                              onChange={(e) => setNewProposal({...newProposal, recipient: e.target.value})}
                              disabled={!canPropose}
                              className="w-full p-2 text-sm border rounded border-emerald-600/50 bg-emerald-900/20 text-emerald-100 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 placeholder:text-emerald-300/60"
                            />
                          </>
                        )}
                        <Button 
                          onClick={handleCreateProposal}
                          disabled={isConfirming || !newProposal.title || !canPropose}
                          size="sm"
                          className="w-full text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500"
                        >
                          {isConfirming ? 'Creating...' : canPropose ? 'Create Proposal' : `Need ${MIN_STAKE_TO_PROPOSE} FARM`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Active Proposals */}
              <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-100">
                    <Vote className="w-5 h-5 text-amber-400" />
                    Active Proposals ({activeProposalIds.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeProposalIds.length === 0 ? (
                    <div className="py-12 text-center text-emerald-200/80">
                      <Vote className="w-16 h-16 mx-auto mb-4 text-emerald-400/50" />
                      <h3 className="mb-2 text-lg font-medium">No Active Proposals</h3>
                      <p className="text-sm">Be the first to create a proposal and shape the DAO&apos;s future!</p>
                      <Button 
                        onClick={() => forceRefreshDAO()}
                        variant="outline"
                        size="sm"
                        className="mt-3 bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                      >
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activeProposalIds.map((proposalId) => (
                        <ProposalCard 
                          key={`${proposalId.toString()}-${refreshTrigger}`}
                          proposalId={proposalId} 
                          userAddress={address}
                          refreshTrigger={refreshTrigger}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* DAO Stats */}
              <Card className="border-2 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 backdrop-blur-sm border-slate-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    DAO Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total Members</span>
                      <span className="font-medium text-slate-800">{memberCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total Proposals</span>
                      <span className="font-medium text-slate-800">{totalProposals}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Active Proposals</span>
                      <span className="font-medium text-slate-800">{activeProposalIds.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">FARM Staked</span>
                      <span className="font-medium text-slate-800">{Number(formatTokenAmount(totalStaked.data || BigInt(0))).toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Treasury Balance</span>
                      <span className="font-medium text-slate-800">{formatTokenAmount(treasuryBalance.data || BigInt(0))} ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Voting Period</span>
                      <span className="font-medium text-slate-800">{VOTING_PERIOD_DAYS} Days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Quorum Required</span>
                      <span className="font-medium text-slate-800">{QUORUM_PERCENTAGE}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Profile */}
              {address && isMember && (
                <Card className="border-2 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm border-emerald-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Reputation</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-800">{reputation}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">FARM Balance</span>
                        <span className="font-medium text-slate-800">{farmBalance.formatted} FARM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Staked</span>
                        <span className="font-medium text-slate-800">{formatTokenAmount(stakedBalance.data || BigInt(0))} FARM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Voting Power</span>
                        <span className="font-medium text-slate-800">{formatTokenAmount(votingPower.data || BigInt(0))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Vote Share</span>
                        <span className="font-medium text-slate-800">{calculateVotingPercentage(totalStaked.data || BigInt(0), votingPower.data || BigInt(0))}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Can Vote</span>
                        {canVote ? (
                          <Badge className="text-green-800 bg-green-100 border-green-300">Yes</Badge>
                        ) : (
                          <Badge className="text-red-800 bg-red-100 border-red-300">No</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Can Propose</span>
                        {canPropose ? (
                          <Badge className="text-green-800 bg-green-100 border-green-300">Yes</Badge>
                        ) : (
                          <Badge className="text-red-800 bg-red-100 border-red-300">No</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* How It Works */}
              <Card className="border-2 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Info className="w-5 h-5 text-blue-600" />
                    How DAO Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">1</div>
                      <div>
                        <p className="font-medium text-slate-800">Join & Stake</p>
                        <p className="text-slate-600">Stake FARM tokens to participate in governance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">2</div>
                      <div>
                        <p className="font-medium text-slate-800">Vote on Proposals</p>
                        <p className="text-slate-600">Use your voting power to shape the DAO&apos;s future</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">3</div>
                      <div>
                        <p className="font-medium text-slate-800">Create Proposals</p>
                        <p className="text-slate-600">Submit ideas and initiatives for community voting</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 