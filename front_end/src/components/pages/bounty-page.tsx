"use client"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgriBountiesABI, getContractAddresses } from "@/config"
import {
  formatTokenAmount,
  parseTokenAmount,
  useAgriBounties,
  useBounty,
  useFarmToken,
  useFarmTokenBalance,
  useHasSubmitted
} from "@/hooks/useAgriDAO"
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Clock, 
  Coins,
  FileText,
  Filter,
  Info,
  Plus,
  RefreshCw,
  Send,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  Vote,
  Settings,
  Crown
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from 'react-hot-toast'
import { useAccount, useReadContract } from "wagmi"

const contracts = getContractAddresses()

// Add safety check for contract addresses
if (!contracts.AGRI_BOUNTIES) {
  console.error('AGRI_BOUNTIES contract address is not defined. Please check your environment variables.')
}

// Type definitions
interface BountyData {
  creator: string
  title: string
  requirements: string
  category: string
  reward: bigint
  deadline: bigint
  status: number
  submissionCount: bigint
  winner: string
  createdAt: bigint
}

interface SubmissionData {
  submitter: string
  bountyId: bigint
  submissionData: string
  timestamp: bigint
  votes: bigint
  selected: boolean
  feedback: string
}

interface UserProfileData {
  0: bigint // reputation
  1: bigint // bountiesCreated
  2: bigint // bountiesWon
  3: bigint // submissionsCount
  4: bigint // totalEarned
  5: boolean // isVerified
}

// FIXED: Added missing interfaces
interface SubmissionCardProps {
  submissionId: bigint
  bountyCreator: string
  userAddress: string | undefined
  refreshTrigger: number
}

interface SubmissionsListProps {
  bountyId: bigint
  userAddress: string | undefined
  bountyCreator: string
  refreshTrigger: number
  isCreator: boolean
}

interface BountyCardProps {
  bountyId: bigint
  userAddress: string | undefined
  refreshTrigger: number
}

const useHasVoted = (submissionId?: bigint, userAddress?: string) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'hasVoted',
    args: submissionId && userAddress ? [submissionId, userAddress] : undefined,
    query: {
      enabled: !!(submissionId && userAddress) && !!contracts.AGRI_BOUNTIES,
      gcTime: 5000,
      staleTime: 0,
    },
  });

  return result.data as boolean || false;
};

// Better hook to find existing bounties - truly dynamic approach
const useAllBounties = () => {
  const [bounties, setBounties] = useState<bigint[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Use a single contract call to get all bounties more efficiently
  const bountyCountResult = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'nextBountyId', // Assuming your contract has this
    query: {
      enabled: !!contracts.AGRI_BOUNTIES,
      staleTime: 0,
      gcTime: 5000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })

  // If nextBountyId doesn't exist, we'll scan up to 50 bounties
  const maxBounties = bountyCountResult.data ? Number(bountyCountResult.data) - 1 : 50

  // Create exactly the number of hooks we need (always the same on each render)
  const NUM_BOUNTY_HOOKS = 20 // Reduced to 20 for better performance
  
  // Call hooks directly at the top level - not in a callback
  const bountyCheck0 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(1)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck1 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(2)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck2 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(3)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck3 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(4)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck4 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(5)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck5 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(6)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck6 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(7)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck7 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(8)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck8 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(9)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck9 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(10)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck10 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(11)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck11 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(12)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck12 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(13)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck13 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(14)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck14 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(15)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck15 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(16)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck16 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(17)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck17 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(18)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck18 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(19)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  const bountyCheck19 = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: [BigInt(20)],
    query: { enabled: !!contracts.AGRI_BOUNTIES, retry: false, staleTime: 0, gcTime: 5000, refetchOnWindowFocus: true, refetchOnMount: true }
  })
  
  // Combine all hook results into an array for processing
  const bountyChecks = [
    bountyCheck0, bountyCheck1, bountyCheck2, bountyCheck3, bountyCheck4,
    bountyCheck5, bountyCheck6, bountyCheck7, bountyCheck8, bountyCheck9,
    bountyCheck10, bountyCheck11, bountyCheck12, bountyCheck13, bountyCheck14,
    bountyCheck15, bountyCheck16, bountyCheck17, bountyCheck18, bountyCheck19
  ]



  // Effect to handle data updates when bounty checks change
  useEffect(() => {
    if (!contracts.AGRI_BOUNTIES) {
      setBounties([])
      setTotalCount(0)
      setIsLoading(false)
      return
    }

    try {
      const existingBounties: bigint[] = []
      
      // Process all bounty checks
      for (let i = 0; i < NUM_BOUNTY_HOOKS; i++) {
        const check = bountyChecks[i]
        if (check && check.data) {
          const bountyData = check.data as BountyData | null
          if (bountyData && bountyData.creator && bountyData.creator !== '0x0000000000000000000000000000000000000000') {
            existingBounties.push(BigInt(i + 1))
          }
        }
      }
      
      setBounties(existingBounties.reverse())
      setTotalCount(existingBounties.length)
      
      // Check if any of the bounty checks are still loading
      const anyLoading = bountyChecks.some(check => check && check.isLoading)
      setIsLoading(anyLoading)
      
      // Debug logging
      console.log(`Found ${existingBounties.length} bounties out of ${NUM_BOUNTY_HOOKS} checked. Loading: ${anyLoading}`)
      
    } catch (error) {
      console.error('Error updating bounty data:', error)
      setBounties([])
      setTotalCount(0)
      setIsLoading(false)
    }
  }, [
    bountyChecks[0]?.data, bountyChecks[1]?.data, bountyChecks[2]?.data, bountyChecks[3]?.data, bountyChecks[4]?.data,
    bountyChecks[5]?.data, bountyChecks[6]?.data, bountyChecks[7]?.data, bountyChecks[8]?.data, bountyChecks[9]?.data,
    bountyChecks[10]?.data, bountyChecks[11]?.data, bountyChecks[12]?.data, bountyChecks[13]?.data, bountyChecks[14]?.data,
    bountyChecks[15]?.data, bountyChecks[16]?.data, bountyChecks[17]?.data, bountyChecks[18]?.data, bountyChecks[19]?.data,
    bountyChecks[0]?.isLoading, bountyChecks[1]?.isLoading, bountyChecks[2]?.isLoading, bountyChecks[3]?.isLoading, bountyChecks[4]?.isLoading,
    bountyChecks[5]?.isLoading, bountyChecks[6]?.isLoading, bountyChecks[7]?.isLoading, bountyChecks[8]?.isLoading, bountyChecks[9]?.isLoading,
    bountyChecks[10]?.isLoading, bountyChecks[11]?.isLoading, bountyChecks[12]?.isLoading, bountyChecks[13]?.isLoading, bountyChecks[14]?.isLoading,
    bountyChecks[15]?.isLoading, bountyChecks[16]?.isLoading, bountyChecks[17]?.isLoading, bountyChecks[18]?.isLoading, bountyChecks[19]?.isLoading
  ])

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log('Loading timeout reached, forcing loading to false')
        setIsLoading(false)
      }, 15000) // 15 second timeout
      
      return () => clearTimeout(timeout)
    }
  }, [isLoading])
  
  const refetch = useCallback(() => {
    try {
      console.log('Refetching bounty data...')
      bountyCountResult.refetch?.()
      bountyChecks.forEach(check => check?.refetch?.())
    } catch (error) {
      console.error('Error in refetch:', error)
    }
  }, [bountyCountResult, bountyChecks])
  
  // Early return if contract address is not available
  if (!contracts.AGRI_BOUNTIES) {
    return { 
      bounties: [], 
      totalCount: 0, 
      isLoading: false,
      refetch: () => console.warn('Cannot refetch: contract address not available')
    }
  }
  
  return { 
    bounties, 
    totalCount, 
    isLoading,
    refetch 
  }
}

// Hook to get user profile
const useUserProfile = (address: string | undefined) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'userProfiles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.AGRI_BOUNTIES,
      staleTime: 0,
      gcTime: 5000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: result.data as UserProfileData | null,
    refetch: result.refetch
  }
}

// Hook to get creator bounties
const useCreatorBounties = (address: string | undefined) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'creatorBounties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.AGRI_BOUNTIES,
      staleTime: 0,
      gcTime: 5000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: Array.isArray(result.data) ? result.data as bigint[] : [],
    refetch: result.refetch
  }
}

// Bounty status enum mapping
const BountyStatus = {
  0: 'ACTIVE',
  1: 'COMPLETED',
  2: 'CANCELLED',
  3: 'EXPIRED'
} as const

// Hook to get bounty submissions
const useBountySubmissions = (bountyId: bigint | undefined) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBountySubmissions',
    args: bountyId ? [bountyId] : undefined,
    query: {
      enabled: !!bountyId && !!contracts.AGRI_BOUNTIES,
      staleTime: 0,
      gcTime: 5000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: Array.isArray(result.data) ? result.data as bigint[] : [],
    refetch: result.refetch
  }
}

// Hook to get individual submission
const useSubmission = (submissionId: bigint | undefined) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getSubmission',
    args: submissionId ? [submissionId] : undefined,
    query: {
      enabled: !!submissionId && !!contracts.AGRI_BOUNTIES,
      staleTime: 0,
      gcTime: 5000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: result.data as SubmissionData | null,
    refetch: result.refetch
  }
}

// Hook to get submitter bounties
const useSubmitterBounties = (address: string | undefined) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'submitterBounties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.AGRI_BOUNTIES,
      staleTime: 0,
      gcTime: 5000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: Array.isArray(result.data) ? result.data as bigint[] : [],
    refetch: result.refetch
  }
}

// FIXED: Updated Submission Card Component
const SubmissionCard = ({ submissionId, bountyCreator, userAddress, refreshTrigger }: SubmissionCardProps) => {
  const submissionResult = useSubmission(submissionId)
  const submission = submissionResult.data
  const { completeBounty, voteOnSubmission, isConfirming } = useAgriBounties()
  const hasVoted = useHasVoted(submissionId, userAddress)

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log('SubmissionCard refetch triggered for submission:', submissionId.toString(), 'trigger:', refreshTrigger)
      const timer = setTimeout(() => {
        if (submissionResult.refetch) {
          console.log('Executing SubmissionCard refetch for submission:', submissionId.toString())
          submissionResult.refetch()
        }
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [refreshTrigger])

  if (!submission) {
    return (
      <div className="p-4 border rounded-lg bg-emerald-800/10 animate-pulse">
        <div className="h-4 mb-2 rounded bg-emerald-600/30"></div>
        <div className="h-3 mb-2 rounded bg-emerald-600/30"></div>
        <div className="w-1/2 h-3 rounded bg-emerald-600/30"></div>
      </div>
    )
  }

  const isCreator = bountyCreator === userAddress
  const isSubmitter = submission.submitter === userAddress

  const handleSelectWinner = async () => {
    if (!isCreator) return
    try {
      await completeBounty(submission.bountyId, submissionId)
    } catch (error) {
      console.error('Error selecting winner:', error)
    }
  }

  const handleVote = async (support: boolean) => {
    if (!userAddress || hasVoted) return
    try {
      await voteOnSubmission(submissionId, support)
      toast.success(`${support ? '👍 Upvote' : '👎 Downvote'} submitted!`)
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to vote. You may have already voted.')
    }
  }

  return (
    <div className={`border rounded-lg p-4 ml-3 ${
      submission.selected 
        ? 'border-green-500 bg-green-50/90' 
        : 'border-slate-600/50 bg-slate-900/10'
    }`}>
      {/* Submission Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-emerald-100">
              👤 {submission.submitter.slice(0, 6)}...{submission.submitter.slice(-4)}
            </span>
            {isSubmitter && (
              <Badge className="text-blue-800 bg-blue-100">Your Submission</Badge>
            )}
            {submission.selected && (
              <Badge className="text-green-800 bg-green-100">
                <Trophy className="w-3 h-3 mr-1" />
                🏆 Winner
              </Badge>
            )}
          </div>
          
          {/* Submission Content - ALWAYS VISIBLE */}
          <div className="p-3 mb-3 border rounded bg-emerald-800/20 border-emerald-600/30">
            <p className="text-sm leading-relaxed text-emerald-100">
              💡 {submission.submissionData}
            </p>
          </div>
        </div>
      </div>
      
      {/* Submission Stats - ALWAYS VISIBLE */}
      <div className="flex items-center justify-between mb-3 text-xs text-emerald-200/80">
        <span>📅 {new Date(Number(submission.timestamp) * 1000).toLocaleString()}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            👍 {Number(submission.votes)} votes
          </span>
          {hasVoted && userAddress && (
            <Badge className="text-blue-800 bg-blue-100">
              Voted
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons - VISIBLE TO EVERYONE */}
      <div className="space-y-2">
        {/* Creator Actions */}
        {isCreator && !submission.selected && (
          <Button
            size="sm"
            onClick={handleSelectWinner}
            disabled={isConfirming}
            className="w-full text-white bg-green-600 hover:bg-green-700"
          >
            {isConfirming ? '⏳ Selecting...' : '🏆 Select as Winner'}
          </Button>
        )}

        {/* Community Voting Actions - AVAILABLE TO ALL USERS */}
        {userAddress && !isCreator && !isSubmitter && !submission.selected && !hasVoted && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleVote(true)}
              disabled={isConfirming}
              className="flex-1 text-white bg-blue-600 hover:bg-blue-700"
            >
              {isConfirming ? '⏳' : '👍 Upvote'}
            </Button>
            <Button
              size="sm"
              onClick={() => handleVote(false)}
              disabled={isConfirming}
              variant="outline"
              className="flex-1 text-red-700 bg-transparent border-red-300 hover:bg-red-50"
            >
              {isConfirming ? '⏳' : '👎 Downvote'}
            </Button>
          </div>
        )}

        {/* Status Messages */}
        {!userAddress && (
          <p className="text-xs italic text-center text-emerald-400">
            Connect wallet to vote on solutions
          </p>
        )}
        
        {userAddress && hasVoted && !submission.selected && (
          <p className="text-xs italic text-center text-blue-400">
            ✅ You have voted on this submission
          </p>
        )}

        {userAddress && isCreator && (
          <p className="text-xs italic text-center text-amber-400">
            👑 You are the bounty creator - select the best solution
          </p>
        )}

        {userAddress && isSubmitter && (
          <p className="text-xs italic text-center text-green-400">
            📝 This is your submission
          </p>
        )}

        {userAddress && !isCreator && !isSubmitter && hasVoted && (
          <p className="text-xs italic text-center text-purple-400">
            🗳️ Thanks for voting! Your vote helps identify quality solutions.
          </p>
        )}
      </div>

      {/* Feedback Section */}
      {submission.feedback && (
        <div className="p-3 mt-3 border rounded bg-blue-900/20 border-blue-700/50">
          <p className="text-sm text-blue-200">
            💬 Creator Feedback: {submission.feedback}
          </p>
        </div>
      )}
    </div>
  )
}

// FIXED: Updated Submissions List Component
const SubmissionsList = ({ bountyId, userAddress, bountyCreator, refreshTrigger, isCreator }: SubmissionsListProps) => {
  const submissionIdsResult = useBountySubmissions(bountyId)
  const submissionIds = submissionIdsResult.data
  
  console.log('SubmissionsList - bountyId:', bountyId)
  console.log('SubmissionsList - submissionIds:', submissionIds)
  console.log('SubmissionsList - userAddress:', userAddress)
  
  if (!submissionIds || submissionIds.length === 0) {
    return (
      <div className="py-8 text-center border rounded-lg text-emerald-200/60 bg-emerald-900/20 border-emerald-700/30">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <h5 className="mb-1 font-medium">No Submissions Yet</h5>
        <p className="text-sm">Be the first to submit a solution!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-medium text-emerald-200">
          📋 Solutions ({submissionIds.length})
        </h5>
        <div className="text-xs text-emerald-200/80">
          {userAddress ? 
            (isCreator ? "Select the best solution" : "Vote for quality solutions") 
            : "Connect wallet to vote"
          }
        </div>
      </div>
      
      <div className="space-y-4 overflow-y-auto max-h-96">
        {submissionIds.map((submissionId: bigint, index: number) => (
          <div key={submissionId.toString()} className="relative">
            <div className="absolute z-10 -left-3 top-3">
              <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-purple-600 rounded-full">
                {index + 1}
              </div>
            </div>
            <SubmissionCard
              submissionId={submissionId}
              bountyCreator={bountyCreator}
              userAddress={userAddress}
              refreshTrigger={refreshTrigger}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const getStatusColor = (status: number) => {
  const colors = {
    0: 'bg-green-100 text-green-800 border-green-300', // ACTIVE
    1: 'bg-blue-100 text-blue-800 border-blue-300', // COMPLETED
    2: 'bg-red-100 text-red-800 border-red-300', // CANCELLED
    3: 'bg-gray-100 text-gray-800 border-gray-300', // EXPIRED
  } as const
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
}

// FIXED: Updated BountyCard Component
const BountyCard = ({ bountyId, userAddress, refreshTrigger }: BountyCardProps) => {
  const bountyQuery = useBounty(bountyId)
  const { submitToBounty, isConfirming } = useAgriBounties()
  const [submissionData, setSubmissionData] = useState('')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showSubmissions, setShowSubmissions] = useState(false) // RENAMED: was showManagement

  const hasSubmitted = useHasSubmitted(bountyId, userAddress)
  const bounty = bountyQuery.data as BountyData | null

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log('BountyCard refetch triggered for bounty:', bountyId.toString(), 'trigger:', refreshTrigger)
      const timer = setTimeout(() => {
        if (bountyQuery.refetch) {
          console.log('Executing BountyCard refetch for bounty:', bountyId.toString())
          bountyQuery.refetch()
        }
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [refreshTrigger])

  console.log('BountyCard - bountyId:', bountyId)
  console.log('BountyCard - bounty:', bounty)
  console.log('BountyCard - userAddress:', userAddress)
  console.log('BountyCard - showSubmissions:', showSubmissions)

  const handleSubmit = async () => {
    if (!userAddress || !submissionData.trim()) return
    try {
      await submitToBounty(bountyId, submissionData.trim())
      setSubmissionData('')
      setShowSubmissionForm(false)
    } catch (error) {
      console.error('Error submitting to bounty:', error)
    }
  }

  if (!bounty) {
    return (
      <div className="p-6 border rounded-lg border-emerald-700/50 bg-emerald-900/30 animate-pulse">
        <div className="h-6 mb-4 rounded bg-emerald-600/30"></div>
        <div className="h-4 mb-2 rounded bg-emerald-600/30"></div>
        <div className="h-4 mb-2 rounded bg-emerald-600/30"></div>
        <div className="w-3/4 h-4 rounded bg-emerald-600/30"></div>
      </div>
    )
  }

  const isExpired = Number(bounty.deadline) <= Math.floor(Date.now() / 1000)
  const isActive = Number(bounty.status) === 0 && !isExpired
  const isCreator = bounty.creator === userAddress

  const formatTimeLeft = (deadline: bigint) => {
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = Number(deadline) - now
    
    if (timeLeft <= 0) return "Expired"
    
    const days = Math.floor(timeLeft / 86400)
    const hours = Math.floor((timeLeft % 86400) / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60
    
    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    if (minutes > 0) return `${minutes}m ${seconds}s left`
    return `${seconds}s left`
  }

  return (
    <div className="p-6 transition-all duration-300 border rounded-lg border-emerald-700/50 hover:shadow-2xl bg-gradient-to-r from-emerald-900/30 to-green-900/30 hover:from-emerald-800/40 hover:to-green-800/40">
      
      {/* Bounty Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-emerald-100">{bounty.title}</h3>
            <Badge className={`${getStatusColor(bounty.status)} border backdrop-blur-sm`}>
              {BountyStatus[bounty.status as keyof typeof BountyStatus] || 'ACTIVE'}
            </Badge>
            {isCreator && (
              <Badge className="text-blue-800 bg-blue-100 border-blue-300">
                Your Bounty
              </Badge>
            )}
          </div>
          <p className="mb-3 leading-relaxed text-emerald-200/80">{bounty.requirements}</p>
          <div className="mb-3 text-sm text-emerald-200/80">
            <span className="font-medium">Created by:</span> {bounty.creator?.slice(0, 6)}...{bounty.creator?.slice(-4)}
          </div>
        </div>
      </div>

      {/* Bounty Stats */}
      <div className="flex items-center gap-6 mb-4 text-sm text-emerald-200/80">
        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-base font-medium text-amber-300">{formatTokenAmount(bounty.reward)} FARM</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{isExpired ? "Expired" : formatTimeLeft(bounty.deadline)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{Number(bounty.submissionCount)} submissions</span>
        </div>
        <Badge variant="outline" className="text-emerald-300 border-emerald-500/50 bg-emerald-900/20">
          {bounty.category}
        </Badge>
      </div>

      {/* Creation and Deadline Info */}
      <div className="mb-4">
        <div className="mb-2 text-sm text-emerald-200/80">
          <span className="font-medium">Created:</span> {new Date(Number(bounty.createdAt) * 1000).toLocaleDateString()}
        </div>
        <div className="text-sm text-emerald-200/80">
          <span className="font-medium">Deadline:</span> {new Date(Number(bounty.deadline) * 1000).toLocaleDateString()}
        </div>
      </div>

      {/* Winner Display */}
      {bounty.winner && bounty.winner !== '0x0000000000000000000000000000000000000000' && (
        <div className="p-3 mb-4 border rounded-lg bg-green-900/30 border-green-700/50">
          <div className="flex items-center gap-2 text-green-300">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">Winner: {bounty.winner.slice(0, 6)}...{bounty.winner.slice(-4)}</span>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS - UPDATED */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* ALWAYS SHOW VIEW SUBMISSIONS BUTTON (for everyone) */}
        <Button
          size="sm"
          onClick={() => setShowSubmissions(!showSubmissions)}
          className="text-white bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
        >
          <Users className="w-4 h-4 mr-1" />
          {showSubmissions ? 'Hide Submissions' : `View Submissions (${Number(bounty?.submissionCount || 0)})`}
        </Button>

                 {/* SUBMISSION BUTTON - Only for active bounties and NOT for creators */}
         {isActive && userAddress && !isCreator && (
           <>
             {!hasSubmitted ? (
               <Button 
                 size="sm" 
                 onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                 className="font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900"
               >
                 <Send className="w-4 h-4 mr-1" />
                 {showSubmissionForm ? 'Cancel Submit' : 'Submit Solution'}
               </Button>
             ) : (
               <Badge className="text-green-800 bg-green-100 border-green-300">
                 ✅ Solution Submitted
               </Badge>
             )}
           </>
         )}

        {/* CREATOR MANAGEMENT BUTTON */}
        {isCreator && (
          <Button
            size="sm"
            variant="outline"
            className="text-blue-200 bg-transparent border-blue-600/50 hover:bg-blue-800/60"
          >
            <Settings className="w-4 h-4 mr-1" />
            Creator Tools
          </Button>
        )}

                 {/* STATUS MESSAGES */}
         {!isActive && (
           <div className="flex items-center gap-2 text-sm text-emerald-400">
             <Info className="w-4 h-4" />
             {isExpired ? "Bounty expired" : "Bounty completed"}
           </div>
         )}
         
         {!userAddress && (
           <div className="text-sm italic text-emerald-400">
             Connect wallet to submit solutions and vote
           </div>
         )}

         
      </div>

             {/* SUBMISSION FORM - Only show if user wants to submit and is NOT the creator */}
       {showSubmissionForm && !hasSubmitted && isActive && userAddress && !isCreator && (
        <div className="p-4 mb-4 border rounded-lg bg-emerald-900/20 border-emerald-700/50">
          <h4 className="mb-3 font-medium text-emerald-100">Submit Your Solution</h4>
          {isCreator && (
            <Alert className="mb-3 border-amber-300 bg-amber-50">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Warning:</strong> You&apos;re submitting to your own bounty. This may be seen as unfair by the community.
              </AlertDescription>
            </Alert>
          )}
          <textarea
            placeholder="Describe your solution in detail..."
            value={submissionData}
            onChange={(e) => setSubmissionData(e.target.value)}
            className="w-full p-3 border rounded-lg border-emerald-600 bg-emerald-900/20 text-emerald-100 placeholder-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={4}
          />
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm"
              onClick={handleSubmit}
              disabled={isConfirming || !submissionData.trim()}
              className="text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isConfirming ? 'Submitting...' : 'Submit Solution'}
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => {
                setShowSubmissionForm(false)
                setSubmissionData('')
              }}
              className="bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* SUBMISSIONS VIEWER - ALWAYS SHOW WHEN TOGGLED (for everyone) */}
      {showSubmissions && (
        <div className="p-4 border rounded-lg bg-slate-900/20 border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="flex items-center gap-2 font-medium text-emerald-100">
              <FileText className="w-4 h-4" />
              💡 Community Solutions
            </h4>
            <div className="flex items-center gap-2">
              <Badge className="text-purple-800 bg-purple-100">
                {Number(bounty?.submissionCount || 0)} Solution{Number(bounty?.submissionCount || 0) !== 1 ? 's' : ''}
              </Badge>
              {!userAddress && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  Connect to Vote
                </Badge>
              )}
            </div>
          </div>

          {/* INFO CARD FOR VOTERS */}
          {userAddress && !isCreator && (
            <Alert className="mb-4 border-purple-300 bg-purple-50">
              <Vote className="w-4 h-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Community Voting:</strong> Review the solutions below and vote for the best ones. 
                Your votes help the bounty creator identify quality solutions.
              </AlertDescription>
            </Alert>
          )}

          {/* CREATOR INFO */}
          {isCreator && (
            <Alert className="mb-4 border-blue-300 bg-blue-50">
              <Crown className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Creator View:</strong> Review all submissions and select the winner. 
                Community votes can help guide your decision.
              </AlertDescription>
            </Alert>
          )}

          {/* SUBMISSIONS LIST - ALWAYS SHOW */}
          <SubmissionsList 
            bountyId={bountyId} 
            userAddress={userAddress} 
            bountyCreator={bounty?.creator || ''}
            refreshTrigger={refreshTrigger}
            isCreator={isCreator}
          />
        </div>
      )}
    </div>
  )
}

// Create Bounty Form Component
interface CreateBountyFormProps {
  userAddress: string | undefined
}

const CreateBountyForm = ({ userAddress }: CreateBountyFormProps) => {
  const [showForm, setShowForm] = useState(false)
     const [newBounty, setNewBounty] = useState({
     title: '',
     requirements: '',
     category: '',
     reward: '',
     duration: '1'
   })

  const { createBounty, isConfirming } = useAgriBounties()
  const { approve } = useFarmToken()
  const farmBalance = useFarmTokenBalance(userAddress)

  const handleCreateBounty = async () => {
    if (!userAddress || !newBounty.title || !newBounty.requirements || !newBounty.reward) return
    
    if (Number(newBounty.reward) < 50) {
      alert('Minimum reward is 50 FARM tokens')
      return
    }
    
    try {
      const rewardAmount = parseTokenAmount(newBounty.reward)
      const feeAmount = (rewardAmount * BigInt(250)) / BigInt(10000)
      const totalAmount = rewardAmount + feeAmount
      
             const durationInDays = Number(newBounty.duration)
       const contractDuration = Math.max(1, durationInDays)
      
      if (!contracts.AGRI_BOUNTIES) {
        throw new Error('Contract address not available')
      }
      await approve(contracts.AGRI_BOUNTIES, totalAmount)
      
      await createBounty(
        newBounty.title,
        newBounty.requirements,
        newBounty.category || 'General',
        rewardAmount,
        BigInt(contractDuration)
      )
      
             setNewBounty({ title: '', requirements: '', category: '', reward: '', duration: '1' })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating bounty:', error)
    }
  }

  const categories = [
    'Research', 'Pest Control', 'Soil Management', 'Water Conservation',
    'Technology', 'Education', 'Environmental', 'Marketing', 'General'
  ]

  if (!showForm) {
    return (
      <Button 
        onClick={() => setShowForm(true)}
        className="font-semibold shadow-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Bounty
      </Button>
    )
  }

  return (
    <Card className="mb-8 border-2 bg-white/90 backdrop-blur-sm border-amber-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Plus className="w-5 h-5 text-amber-600" />
          Create New Bounty
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Bounty title"
            value={newBounty.title}
            onChange={(e) => setNewBounty({...newBounty, title: e.target.value})}
            className="w-full p-3 border rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <textarea
            placeholder="Requirements and description"
            value={newBounty.requirements}
            onChange={(e) => setNewBounty({...newBounty, requirements: e.target.value})}
            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
          />
          <select
            value={newBounty.category}
            onChange={(e) => setNewBounty({...newBounty, category: e.target.value})}
            className="w-full p-3 border rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
                     <div className="grid grid-cols-2 gap-4">
             <input
               type="number"
               placeholder="Reward (FARM tokens)"
               min="50"
               value={newBounty.reward}
               onChange={(e) => setNewBounty({...newBounty, reward: e.target.value})}
               className="p-3 border rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
             />
             <input
               type="number"
               placeholder="Duration (days)"
               min="1"
               value={newBounty.duration}
               onChange={(e) => setNewBounty({...newBounty, duration: e.target.value})}
               className="p-3 border rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
             />
           </div>
          
                     {newBounty.reward && (
             <Alert className={Number(newBounty.reward) < 50 ? "border-red-300 bg-red-50" : 
               Number(newBounty.duration) < 1 ? "border-orange-300 bg-orange-50" : "border-amber-300 bg-amber-50"}>
               <Info className={`h-4 w-4 ${Number(newBounty.reward) < 50 ? "text-red-600" : 
                 Number(newBounty.duration) < 1 ? "text-orange-600" : "text-amber-600"}`} />
               <AlertDescription className={Number(newBounty.reward) < 50 ? "text-red-800" : 
                 Number(newBounty.duration) < 1 ? "text-orange-800" : "text-amber-800"}>
                 {Number(newBounty.reward) < 50 ? (
                   <>⚠️ Minimum reward is 50 FARM tokens</>
                 ) : Number(newBounty.duration) < 1 ? (
                   <>
                     ⚠️ Contract minimum is 1 day. Your {newBounty.duration} day(s) will become 1 day | 
                     Platform fee: {(Number(newBounty.reward) * 0.025).toFixed(2)} FARM | 
                     Total: {(Number(newBounty.reward) * 1.025).toFixed(2)} FARM
                   </>
                 ) : (
                   <>
                     Duration: {newBounty.duration} day(s) | 
                     Platform fee: {(Number(newBounty.reward) * 0.025).toFixed(2)} FARM | 
                     Total required: {(Number(newBounty.reward) * 1.025).toFixed(2)} FARM | 
                     Your balance: {farmBalance.formatted} FARM
                   </>
                 )}
               </AlertDescription>
             </Alert>
           )}
          
          <div className="flex gap-3">
            <Button 
              onClick={handleCreateBounty}
              disabled={isConfirming || !newBounty.title || !newBounty.requirements || !newBounty.reward || Number(newBounty.reward) < 50}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900"
            >
              {isConfirming ? 'Creating...' : 'Create Bounty'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowForm(false)}
              className="bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const VotingInfoCard = () => (
  <Card className="border-2 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-slate-800">
        <Info className="w-5 h-5 text-purple-600" />
        Community Voting
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-purple-600 rounded-full">1</div>
          <div>
            <p className="font-medium text-slate-800">Review Solutions</p>
            <p className="text-slate-600">Read submitted solutions carefully</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-purple-600 rounded-full">2</div>
          <div>
            <p className="font-medium text-slate-800">Vote for Quality</p>
            <p className="text-slate-600">Upvote innovative and practical solutions</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-purple-600 rounded-full">3</div>
          <div>
            <p className="font-medium text-slate-800">Creator Decides</p>
            <p className="text-slate-600">Bounty creator selects final winner</p>
          </div>
        </div>
      </div>
      <Alert className="mt-4 border-purple-300 bg-purple-50">
        <Info className="w-4 h-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <strong>Note:</strong> Voting helps the bounty creator identify the best solutions, 
          but they make the final decision on winners.
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
)

export function BountyPage() {
  const { address } = useAccount()

  // Contract hooks
  const { bounties: selectedBounties, totalCount: totalBounties, isLoading, refetch } = useAllBounties()
  const userProfileResult = useUserProfile(address)
  const userProfile = userProfileResult.data
  const creatorBountiesResult = useCreatorBounties(address)
  const creatorBounties = creatorBountiesResult.data
  const submitterBountiesResult = useSubmitterBounties(address)
  const submitterBounties = submitterBountiesResult.data
  const farmBalance = useFarmTokenBalance(address)
  
  // Get the bounty contract instance for transaction watching
  const bountyContract = useAgriBounties()

  // Cache invalidation function for all bounty-related data
  const invalidateQueries = useCallback(() => {
    console.log('Invalidating bounty queries - refetching all bounty data')
    
    // Refetch main bounty list
    refetch()
    
    // Refetch user-specific data
    if (userProfileResult.refetch) userProfileResult.refetch()
    if (creatorBountiesResult.refetch) creatorBountiesResult.refetch()
    if (submitterBountiesResult.refetch) submitterBountiesResult.refetch()
    if (farmBalance.refetch) farmBalance.refetch()
    
    console.log('Bounty queries invalidated')
  }, [refetch, userProfileResult, creatorBountiesResult, submitterBountiesResult, farmBalance])

  // Force refetch all bounties after mutations
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const forceRefreshBounties = useCallback(async () => {
    console.log('Force refresh bounties triggered - updating refresh trigger and invalidating queries')
    
    // Update refresh trigger
    setRefreshTrigger(prev => prev + 1)
    
    // Initial refresh
    invalidateQueries()
    
    // Single retry after delay to allow blockchain state to propagate
    setTimeout(() => {
      console.log('Bounty retry refresh after 3 seconds')
      invalidateQueries()
    }, 3000)
  }, [invalidateQueries])

  // Track processed transaction hashes to avoid duplicate refreshes
  const [processedTxHashes, setProcessedTxHashes] = useState<Set<string>>(new Set())

  // Watch for transaction success to trigger refetch
  useEffect(() => {
    console.log('Bounty transaction watcher triggered:', {
      isSuccess: bountyContract.isSuccess,
      hash: bountyContract.hash,
      isConfirming: bountyContract.isConfirming,
      isPending: bountyContract.isPending,
      processedHashes: Array.from(processedTxHashes)
    })

    if (bountyContract.isSuccess && bountyContract.hash && !processedTxHashes.has(bountyContract.hash)) {
      console.log('Bounty transaction confirmed, refreshing UI:', bountyContract.hash)
      
      // Show success toast
      toast.success('Transaction confirmed! UI updating... ✅')
      
      // Mark this hash as processed
      setProcessedTxHashes(prev => new Set(prev).add(bountyContract.hash!))
      
      // Add a delay to allow blockchain state to propagate before refetching
      setTimeout(() => {
        console.log('Executing delayed refresh after bounty transaction confirmation')
        forceRefreshBounties()
      }, 2000) // 2 second delay
    }
  }, [bountyContract.isSuccess, bountyContract.hash, bountyContract.isConfirming, bountyContract.isPending, forceRefreshBounties, processedTxHashes])

  // Refresh bounties periodically - but only when not loading to prevent spam
  useEffect(() => {
    if (isLoading) return // Don't refresh while already loading
    
    const interval = setInterval(() => {
      if (!isLoading) {
        refetch()
      }
    }, 10000) // Check every 10 seconds instead of 5 to reduce load
    
    return () => clearInterval(interval)
  }, [refetch, isLoading])

  // Debug: Log contract addresses and user data - only when important values change
  useEffect(() => {
    console.log('🔍 Debug Info:')
    console.log('Contract Address:', contracts.AGRI_BOUNTIES || 'Not available')
    console.log('User Address:', address)
    console.log('Farm Balance:', farmBalance.formatted)
    console.log('User Profile:', userProfile)
    console.log('Creator Bounties:', creatorBounties)
    console.log('Total Bounties Found:', totalBounties)
    console.log('Selected Bounties:', selectedBounties)
  }, [address, farmBalance.formatted]) // Only log when user or balance changes, not on every bounty update

  // Add safety check for contract availability AFTER all hooks
  if (!contracts.AGRI_BOUNTIES) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Contract Not Available</h1>
            <p className="text-gray-600">The AgriBounties contract address is not configured. Please check your environment variables.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-emerald-100">
                <span className="text-transparent bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text">
                  Agricultural Bounties
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">Solve farming challenges and earn rewards for your innovations</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={forceRefreshBounties}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" className="bg-transparent border-amber-600/50 text-amber-200 hover:bg-amber-800/60 hover:border-amber-500">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <CreateBountyForm userAddress={address} />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                <div className="mb-1 text-2xl font-bold text-emerald-100">{totalBounties}</div>
                <div className="text-sm text-emerald-200/80">Total Bounties</div>
              </CardContent>
            </Card>
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <div className="mb-1 text-2xl font-bold text-emerald-100">{userProfile ? Number(userProfile[3]) : 0}</div>
                <div className="text-sm text-emerald-200/80">My Submissions</div>
              </CardContent>
            </Card>
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Coins className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                <div className="mb-1 text-2xl font-bold text-emerald-100">
                  {userProfile ? formatTokenAmount(userProfile[4]).split('.')[0] : 0}
                </div>
                <div className="text-sm text-emerald-200/80">FARM Earned</div>
              </CardContent>
            </Card>
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                <div className="mb-1 text-2xl font-bold text-emerald-100">{userProfile ? Number(userProfile[2]) : 0}</div>
                <div className="text-sm text-emerald-200/80">Bounties Won</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
            {/* Available Bounties */}
            <div className="lg:col-span-2">
              <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-100">
                    <Target className="w-5 h-5 text-amber-400" />
                    Available Bounties ({selectedBounties.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-12 text-center text-emerald-200/80">
                      <div className="w-8 h-8 mx-auto mb-4 border-2 rounded-full animate-spin border-emerald-400 border-t-transparent"></div>
                      <h3 className="mb-2 text-lg font-medium">Loading Bounties...</h3>
                      <p className="text-sm">Scanning bounties 1-20 on the blockchain...</p>
                    </div>
                  ) : selectedBounties.length === 0 ? (
                                         <div className="py-12 text-center text-emerald-200/80">
                       <Target className="w-16 h-16 mx-auto mb-4 text-emerald-400/50" />
                       <h3 className="mb-2 text-lg font-medium">No Bounties Available Yet</h3>
                       <p className="text-sm">Be the first to create a bounty and start building the community!</p>
                       <p className="mt-2 text-xs text-emerald-300">
                         Contract connected successfully | 
                         Ready to create bounties
                       </p>
                      <Button 
                        onClick={() => refetch()}
                        variant="outline"
                        size="sm"
                        className="mt-3 bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                      >
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedBounties.map((bountyId) => (
                        <BountyCard 
                          key={`${String(bountyId)}-${refreshTrigger}`} 
                          bountyId={bountyId} 
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
              {/* User Profile */}
              <Card className="border-2 bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <User className="w-5 h-5 text-emerald-600" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {address ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Reputation</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="font-medium text-slate-800">{userProfile ? Number(userProfile[0]) : 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Bounties Created</span>
                        <span className="font-medium text-slate-800">{userProfile ? Number(userProfile[1]) : 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Bounties Won</span>
                        <span className="font-medium text-slate-800">{userProfile ? Number(userProfile[2]) : 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Earned</span>
                        <span className="font-medium text-slate-800">{userProfile ? formatTokenAmount(userProfile[4]) : '0'} FARM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">FARM Balance</span>
                        <span className="font-medium text-slate-800">{farmBalance.formatted} FARM</span>
                      </div>
                      {userProfile && userProfile[5] && (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Verified Expert</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                      <p className="mb-3 text-slate-600">Connect your wallet to view your bounty profile</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-2 bg-white/80 backdrop-blur-sm border-green-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Total Bounties</span>
                      <span className="font-medium text-slate-800">{totalBounties}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Your Created</span>
                      <span className="font-medium text-slate-800">{creatorBounties.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Your Submissions</span>
                      <span className="font-medium text-slate-800">{submitterBounties.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Platform Fee</span>
                      <span className="font-medium text-slate-800">2.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Info className="w-5 h-5 text-blue-600" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">1</div>
                      <div>
                        <p className="font-medium text-slate-800">Create or Find Bounties</p>
                        <p className="text-slate-600">Post challenges or browse existing ones</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">2</div>
                      <div>
                        <p className="font-medium text-slate-800">Submit Solutions</p>
                        <p className="text-slate-600">Share your innovative ideas and implementations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">3</div>
                      <div>
                        <p className="font-medium text-slate-800">Earn Rewards</p>
                        <p className="text-slate-600">Get FARM tokens and build your reputation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <VotingInfoCard />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}