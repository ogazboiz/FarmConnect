"use client"
// @ts-nocheck - Complex hooks migration, focus on functionality over types

import { useState, useEffect, useCallback } from "react"
import { toast } from 'react-hot-toast'
import { useAccount } from "wagmi"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Target, Clock, Coins, Plus, CheckCircle, Users, Award, TrendingUp, Filter,
  User, FileText, Info, Star, Trophy, AlertTriangle, Send, RefreshCw
} from "lucide-react"
import { 
  useAgriBounties,
  useBounty,
  useFarmTokenBalance,
  useFarmToken,
  formatTokenAmount,
  parseTokenAmount
} from "@/hooks/useAgriDAO"
import { useReadContract } from "wagmi"
import { AgriBountiesABI } from "@/config"
import { getContractAddresses } from "@/config"

const contracts = getContractAddresses()

// Better hook to find existing bounties using getBounty function
const useAllBounties = () => {
  const [bounties, setBounties] = useState<bigint[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check multiple bounty IDs using getBounty function with aggressive cache settings
  const bountyChecks = Array.from({ length: 20 }, (_, i) => {
    return useReadContract({
      address: contracts.AGRI_BOUNTIES,
      abi: AgriBountiesABI,
      functionName: 'getBounty',
      args: [BigInt(i + 1)],
      query: {
        retry: false,
        staleTime: 0, // Always consider stale
        cacheTime: 5000, // Keep in cache for 5 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      },
    })
  })

  useEffect(() => {
    const existingBounties: bigint[] = []
    
    bountyChecks.forEach((check, index) => {
      // Check if bounty exists by looking at the creator field
      if (check.data && check.data.creator && check.data.creator !== '0x0000000000000000000000000000000000000000') {
        existingBounties.push(BigInt(index + 1))
      }
    })
    
    setBounties(existingBounties.reverse()) // Newest first
    setTotalCount(existingBounties.length)
    setIsLoading(bountyChecks.some(check => check.isLoading))
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bountyChecks.map(check => check.data?.creator).join(',')]) // Intentionally minimal deps to avoid infinite loops
  
  const refetch = () => {
    console.log('useAllBounties refetch called - refetching all bounty checks')
    bountyChecks.forEach(check => check.refetch?.())
  }
  
  return { 
    bounties, 
    totalCount, 
    isLoading,
    refetch 
  }
}

// Hook to get user profile
const useUserProfile = (address) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'userProfiles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 0, // Always consider stale
      cacheTime: 5000, // Keep in cache for 5 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: result.data || null,
    refetch: result.refetch
  }
}

// Hook to get creator bounties
const useCreatorBounties = (address) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'creatorBounties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 0, // Always consider stale
      cacheTime: 5000, // Keep in cache for 5 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: Array.isArray(result.data) ? result.data : [],
    refetch: result.refetch
  }
}

// Bounty status enum mapping
const BountyStatus = {
  0: 'ACTIVE',
  1: 'COMPLETED',
  2: 'CANCELLED',
  3: 'EXPIRED'
}

// Hook to get bounty submissions
const useBountySubmissions = (bountyId: any) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBountySubmissions',
    args: bountyId ? [bountyId] : undefined,
    query: {
      enabled: !!bountyId,
      staleTime: 0, // Always consider stale
      cacheTime: 5000, // Keep in cache for 5 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: Array.isArray(result.data) ? result.data : [],
    refetch: result.refetch
  }
}

// Hook to get individual submission
const useSubmission = (submissionId: any) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getSubmission',
    args: submissionId ? [submissionId] : undefined,
    query: {
      enabled: !!submissionId,
      staleTime: 0, // Always consider stale
      cacheTime: 5000, // Keep in cache for 5 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: result.data || null,
    refetch: result.refetch
  }
}

// Hook to get submitter bounties
const useSubmitterBounties = (address: any) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'submitterBounties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 0, // Always consider stale
      cacheTime: 5000, // Keep in cache for 5 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  })
  
  return {
    data: Array.isArray(result.data) ? result.data : [],
    refetch: result.refetch
  }
}

// Fixed Submission Card Component
const SubmissionCard = ({ submissionId, bountyCreator, userAddress, refreshTrigger }: any) => {
  const submissionResult = useSubmission(submissionId)
  const submission = submissionResult.data
  const { completeBounty, isConfirming } = useAgriBounties()

  // Refetch when refreshTrigger changes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]) // Intentionally excluding submission to avoid infinite loops

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

  return (
    <div className={`border rounded-lg p-4 ${
      submission.selected 
        ? 'border-green-500 bg-green-50/90' 
        : 'border-emerald-600/50 bg-emerald-900/10'
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
                Winner
              </Badge>
            )}
          </div>
          
          {/* Submission Content */}
          <div className="p-3 mb-3 border rounded bg-emerald-800/20 border-emerald-600/30">
            <p className="text-sm leading-relaxed text-emerald-100">
              💡 {submission.submissionData}
            </p>
          </div>
        </div>
      </div>
      
      {/* Submission Stats */}
      <div className="flex items-center justify-between mb-3 text-xs text-emerald-200/80">
        <span>📅 {new Date(Number(submission.timestamp) * 1000).toLocaleString()}</span>
        <span>👥 {Number(submission.votes)} votes</span>
      </div>

      {/* Action Button */}
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

      {/* Feedback Section */}
      {submission.feedback && (
        <div className="p-3 mt-3 border rounded bg-blue-900/20 border-blue-700/50">
          <p className="text-sm text-blue-200">
            💬 Feedback: {submission.feedback}
          </p>
        </div>
      )}
    </div>
  )
}

// Fixed Submissions List Component
const BountySubmissionsList = ({ bountyId, userAddress, bountyCreator, refreshTrigger }: any) => {
  const submissionIdsResult = useBountySubmissions(bountyId)
  const submissionIds = submissionIdsResult.data
  
  // Debug logging
  console.log('BountySubmissionsList - bountyId:', bountyId)
  console.log('BountySubmissionsList - submissionIds:', submissionIds)
  console.log('BountySubmissionsList - userAddress:', userAddress)
  
  if (!submissionIds || submissionIds.length === 0) {
    return (
      <div className="py-8 text-center border rounded-lg text-emerald-200/60 bg-emerald-900/20 border-emerald-700/30">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <h5 className="mb-1 font-medium">No Submissions Yet</h5>
        <p className="text-sm">Waiting for community solutions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h5 className="mb-3 font-medium text-emerald-200">
        📋 Submissions ({submissionIds.length})
      </h5>
      
      <div className="space-y-3 overflow-y-auto max-h-80">
        {submissionIds.map((submissionId: any) => (
          <SubmissionCard
            key={submissionId.toString()}
            submissionId={submissionId}
            bountyCreator={bountyCreator}
            userAddress={userAddress}
            refreshTrigger={refreshTrigger}
          />
        ))}
      </div>
    </div>
  )
}

const getStatusColor = (status: any) => {
  const colors = {
    0: 'bg-green-100 text-green-800 border-green-300', // ACTIVE
    1: 'bg-blue-100 text-blue-800 border-blue-300', // COMPLETED
    2: 'bg-red-100 text-red-800 border-red-300', // CANCELLED
    3: 'bg-gray-100 text-gray-800 border-gray-300', // EXPIRED
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
}

// Fixed Individual Bounty Component
const BountyCard = ({ bountyId, userAddress, refreshTrigger }: any) => {
  const bountyQuery = useBounty(bountyId)
  const { submitToBounty, isConfirming } = useAgriBounties()
  const [submissionData, setSubmissionData] = useState('')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showManagement, setShowManagement] = useState(false)

  const bounty = bountyQuery.data

  // Refetch when refreshTrigger changes, but with debouncing to avoid excessive calls
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log('BountyCard refetch triggered for bounty:', bountyId.toString(), 'trigger:', refreshTrigger)
      const timer = setTimeout(() => {
        if (bountyQuery.refetch) {
          console.log('Executing BountyCard refetch for bounty:', bountyId.toString())
          bountyQuery.refetch()
        }
      }, 500) // Debounce refetch calls
      
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]) // Intentionally excluding bountyQuery to avoid infinite loops

  // Debug logging
  console.log('BountyCard - bountyId:', bountyId)
  console.log('BountyCard - bounty:', bounty)
  console.log('BountyCard - userAddress:', userAddress)
  console.log('BountyCard - showManagement:', showManagement)

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

  const formatTimeLeft = (deadline: any) => {
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

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        {isActive && userAddress && (
          <>
            {isCreator ? (
              // Creator buttons
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => {
                    console.log('Toggling management from', showManagement, 'to', !showManagement)
                    setShowManagement(!showManagement)
                  }}
                  className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Users className="w-4 h-4 mr-1" />
                  {showManagement ? 'Hide Management' : 'Manage Bounty'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                  variant="outline"
                  className="bg-transparent border-amber-600/50 text-amber-200 hover:bg-amber-800/60"
                >
                  <Send className="w-4 h-4 mr-1" />
                  {showSubmissionForm ? 'Cancel Submit' : 'Submit Solution'}
                </Button>
              </div>
            ) : (
              // Regular user buttons
              <Button 
                size="sm" 
                onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                className="font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900"
              >
                <Send className="w-4 h-4 mr-1" />
                {showSubmissionForm ? 'Cancel' : 'Submit Solution'}
              </Button>
            )}
          </>
        )}
        
        {!isActive && (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <Info className="w-4 h-4" />
            {isExpired ? "Bounty expired" : "Bounty completed"}
          </div>
        )}
        
        {!userAddress && (
          <div className="text-sm italic text-emerald-400">
            Connect wallet to submit solutions
          </div>
        )}
      </div>

      {/* Submission Form */}
      {showSubmissionForm && (
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

      {/* MANAGEMENT PANEL - This should now be visible */}
      {showManagement && isCreator && (
        <div className="p-4 border rounded-lg bg-blue-900/20 border-blue-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="flex items-center gap-2 font-medium text-emerald-100">
              <FileText className="w-4 h-4" />
              🔧 Manage Your Bounty
            </h4>
            <Badge className="text-blue-800 bg-blue-100">
              {Number(bounty.submissionCount)} Submission{Number(bounty.submissionCount) !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Debug Info */}
          <div className="p-2 mb-4 text-xs text-yellow-200 border rounded bg-yellow-900/20 border-yellow-700/50">
            🐛 Debug: Management panel is visible! BountyId: {bountyId.toString()}, Creator: {isCreator ? 'YES' : 'NO'}
          </div>

          {/* Management Actions */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent border-emerald-300 text-emerald-200 hover:bg-emerald-800/60"
            >
              <Filter className="w-4 h-4 mr-1" />
              Refresh Submissions
            </Button>
            
            {Number(bounty.submissionCount) === 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-200 bg-transparent border-red-300 hover:bg-red-800/60"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Cancel Bounty
              </Button>
            )}
          </div>

          {/* Submissions List */}
          <BountySubmissionsList 
            bountyId={bountyId} 
            userAddress={userAddress} 
            bountyCreator={bounty.creator}
            refreshTrigger={refreshTrigger}
          />
        </div>
      )}
    </div>
  )
}

// Create Bounty Form Component
const CreateBountyForm = ({ userAddress }: any) => {
  const [showForm, setShowForm] = useState(false)
  const [newBounty, setNewBounty] = useState({
    title: '',
    requirements: '',
    category: '',
    reward: '',
    duration: '1',
    durationUnit: 'days'
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
      
      let durationInDays
      const durationValue = Number(newBounty.duration)
      
      switch (newBounty.durationUnit) {
        case 'minutes':
          durationInDays = durationValue / (24 * 60)
          break
        case 'hours':
          durationInDays = durationValue / 24
          break
        case 'days':
          durationInDays = durationValue
          break
        default:
          durationInDays = durationValue
      }
      
      const contractDuration = Math.max(1, Math.ceil(durationInDays))
      
      if (durationInDays < 1) {
        const userWantsToString = `${durationValue} ${newBounty.durationUnit}`
        const willBeString = `${contractDuration} day${contractDuration > 1 ? 's' : ''}`
        
        if (!confirm(`⚠️ Contract minimum is 1 day.\n\nYou want: ${userWantsToString}\nWill be: ${willBeString}\n\nContinue anyway?`)) {
          return
        }
      }
      
      await approve(contracts.AGRI_BOUNTIES, totalAmount)
      
      await createBounty(
        newBounty.title,
        newBounty.requirements,
        newBounty.category || 'General',
        rewardAmount,
        BigInt(contractDuration)
      )
      
      setNewBounty({ title: '', requirements: '', category: '', reward: '', duration: '1', durationUnit: 'days' })
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
          <div className="grid grid-cols-3 gap-4">
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
              placeholder="Duration"
              min="1"
              value={newBounty.duration}
              onChange={(e) => setNewBounty({...newBounty, duration: e.target.value})}
              className="p-3 border rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <select
              value={newBounty.durationUnit}
              onChange={(e) => setNewBounty({...newBounty, durationUnit: e.target.value})}
              className="p-3 border rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
          
          {newBounty.reward && (
            <Alert className={Number(newBounty.reward) < 50 ? "border-red-300 bg-red-50" : 
              (newBounty.durationUnit !== 'days' && Number(newBounty.duration) < 1440) ? "border-orange-300 bg-orange-50" : "border-amber-300 bg-amber-50"}>
              <Info className={`h-4 w-4 ${Number(newBounty.reward) < 50 ? "text-red-600" : 
                (newBounty.durationUnit !== 'days' && Number(newBounty.duration) < 1440) ? "text-orange-600" : "text-amber-600"}`} />
              <AlertDescription className={Number(newBounty.reward) < 50 ? "text-red-800" : 
                (newBounty.durationUnit !== 'days' && Number(newBounty.duration) < 1440) ? "text-orange-800" : "text-amber-800"}>
                {Number(newBounty.reward) < 50 ? (
                  <>⚠️ Minimum reward is 50 FARM tokens</>
                ) : (newBounty.durationUnit !== 'days' && Number(newBounty.duration) < 1440) ? (
                  <>
                    ⚠️ Contract minimum is 1 day. Your {newBounty.duration} {newBounty.durationUnit} will become 1 day | 
                    Platform fee: {(Number(newBounty.reward) * 0.025).toFixed(2)} FARM | 
                    Total: {(Number(newBounty.reward) * 1.025).toFixed(2)} FARM
                  </>
                ) : (
                  <>
                    Duration: {newBounty.duration} {newBounty.durationUnit} | 
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
    setRefreshTrigger(prev => {
      const newValue = prev + 1
      console.log('Bounty refresh trigger updated from', prev, 'to', newValue)
      return newValue
    })
    
    // Initial refresh
    invalidateQueries()
    
    // Retry mechanism - sometimes blockchain state takes time to propagate
    setTimeout(() => {
      console.log('Bounty retry refresh #1 after 3 seconds')
      invalidateQueries()
    }, 3000)
    
    setTimeout(() => {
      console.log('Bounty retry refresh #2 after 6 seconds')
      invalidateQueries()
    }, 6000)
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

  // Refresh bounties when user creates one (keep existing logic)
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5000) // Check every 5 seconds
    
    return () => clearInterval(interval)
  }, [refetch])

  // Debug: Log contract addresses and user data
  useEffect(() => {
    console.log('🔍 Debug Info:')
    console.log('Contract Address:', contracts.AGRI_BOUNTIES)
    console.log('User Address:', address)
    console.log('Farm Balance:', farmBalance.formatted)
    console.log('User Profile:', userProfile)
    console.log('Creator Bounties:', creatorBounties)
    console.log('Total Bounties Found:', totalBounties)
    console.log('Selected Bounties:', selectedBounties)
  }, [totalBounties, userProfile, creatorBounties, selectedBounties, farmBalance.formatted, address])

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
                      <h3 className="mb-2 text-lg font-medium">No Bounties Found</h3>
                      <p className="text-sm">Create the first bounty or check if your contract is deployed correctly!</p>
                      <p className="mt-2 text-xs text-emerald-300">
                        Searched bounties 1-20. Found: {totalBounties} | 
                        Contract: {contracts.AGRI_BOUNTIES?.slice(0, 10)}...
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}