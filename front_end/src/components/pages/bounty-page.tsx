"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Target, Clock, Coins, Plus, CheckCircle, AlertCircle, Users, Award, TrendingUp, Filter,
  Calendar, User, FileText, Info, Zap, Star, Trophy, AlertTriangle, Send
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
  const [bounties, setBounties] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check multiple bounty IDs using getBounty function instead of direct mapping
  const bountyChecks = Array.from({ length: 20 }, (_, i) => {
    return useReadContract({
      address: contracts.AGRI_BOUNTIES,
      abi: AgriBountiesABI,
      functionName: 'getBounty',
      args: [BigInt(i + 1)],
      query: {
        retry: false,
        staleTime: 1000,
      },
    })
  })

  useEffect(() => {
    const existingBounties = []
    
    bountyChecks.forEach((check, index) => {
      // Check if bounty exists by looking at the creator field
      if (check.data && check.data.creator && check.data.creator !== '0x0000000000000000000000000000000000000000') {
        existingBounties.push(BigInt(index + 1))
      }
    })
    
    setBounties(existingBounties.reverse()) // Newest first
    setTotalCount(existingBounties.length)
    setIsLoading(bountyChecks.some(check => check.isLoading))
  }, [bountyChecks.map(check => check.data?.creator).join(',')])
  
  const refetch = () => {
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
  const { data } = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'userProfiles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
  
  return data || null
}

// Hook to get creator bounties
const useCreatorBounties = (address) => {
  const { data } = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'creatorBounties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
  
  return Array.isArray(data) ? data : []
}

// Bounty status enum mapping
const BountyStatus = {
  0: 'ACTIVE',
  1: 'COMPLETED',
  2: 'CANCELLED',
  3: 'EXPIRED'
}

// Hook to get bounty submissions
const useBountySubmissions = (bountyId) => {
  const { data } = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBountySubmissions',
    args: bountyId ? [bountyId] : undefined,
    query: {
      enabled: !!bountyId,
    },
  })
  
  return Array.isArray(data) ? data : []
}

// Hook to get individual submission
const useSubmission = (submissionId) => {
  const { data } = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getSubmission',
    args: submissionId ? [submissionId] : undefined,
    query: {
      enabled: !!submissionId,
    },
  })
  
  return data || null
}

// Hook to get submitter bounties
const useSubmitterBounties = (address) => {
  const { data } = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'submitterBounties',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
  
  return Array.isArray(data) ? data : []
}

// Fixed Submission Card Component
const SubmissionCard = ({ submissionId, bountyCreator, userAddress }) => {
  const submission = useSubmission(submissionId)
  const { completeBounty, isConfirming } = useAgriBounties()

  if (!submission) {
    return (
      <div className="border rounded-lg p-4 bg-emerald-800/10 animate-pulse">
        <div className="h-4 bg-emerald-600/30 rounded mb-2"></div>
        <div className="h-3 bg-emerald-600/30 rounded mb-2"></div>
        <div className="h-3 bg-emerald-600/30 rounded w-1/2"></div>
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
              <Badge className="bg-blue-100 text-blue-800">Your Submission</Badge>
            )}
            {submission.selected && (
              <Badge className="bg-green-100 text-green-800">
                <Trophy className="w-3 h-3 mr-1" />
                Winner
              </Badge>
            )}
          </div>
          
          {/* Submission Content */}
          <div className="bg-emerald-800/20 p-3 rounded border border-emerald-600/30 mb-3">
            <p className="text-emerald-100 text-sm leading-relaxed">
              💡 {submission.submissionData}
            </p>
          </div>
        </div>
      </div>
      
      {/* Submission Stats */}
      <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-3">
        <span>📅 {new Date(Number(submission.timestamp) * 1000).toLocaleString()}</span>
        <span>👥 {Number(submission.votes)} votes</span>
      </div>

      {/* Action Button */}
      {isCreator && !submission.selected && (
        <Button
          size="sm"
          onClick={handleSelectWinner}
          disabled={isConfirming}
          className="bg-green-600 hover:bg-green-700 text-white w-full"
        >
          {isConfirming ? '⏳ Selecting...' : '🏆 Select as Winner'}
        </Button>
      )}

      {/* Feedback Section */}
      {submission.feedback && (
        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/50 rounded">
          <p className="text-sm text-blue-200">
            💬 Feedback: {submission.feedback}
          </p>
        </div>
      )}
    </div>
  )
}

// Fixed Submissions List Component
const BountySubmissionsList = ({ bountyId, userAddress, bountyCreator }) => {
  const submissionIds = useBountySubmissions(bountyId)
  
  // Debug logging
  console.log('BountySubmissionsList - bountyId:', bountyId)
  console.log('BountySubmissionsList - submissionIds:', submissionIds)
  console.log('BountySubmissionsList - userAddress:', userAddress)
  
  if (!submissionIds || submissionIds.length === 0) {
    return (
      <div className="text-center py-8 text-emerald-200/60 bg-emerald-900/20 rounded-lg border border-emerald-700/30">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <h5 className="font-medium mb-1">No Submissions Yet</h5>
        <p className="text-sm">Waiting for community solutions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h5 className="font-medium text-emerald-200 mb-3">
        📋 Submissions ({submissionIds.length})
      </h5>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {submissionIds.map((submissionId) => (
          <SubmissionCard
            key={submissionId.toString()}
            submissionId={submissionId}
            bountyCreator={bountyCreator}
            userAddress={userAddress}
          />
        ))}
      </div>
    </div>
  )
}

const getStatusColor = (status) => {
  const colors = {
    0: 'bg-green-100 text-green-800 border-green-300', // ACTIVE
    1: 'bg-blue-100 text-blue-800 border-blue-300', // COMPLETED
    2: 'bg-red-100 text-red-800 border-red-300', // CANCELLED
    3: 'bg-gray-100 text-gray-800 border-gray-300', // EXPIRED
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
}

// Fixed Individual Bounty Component
const BountyCard = ({ bountyId, userAddress }) => {
  const bountyQuery = useBounty(bountyId)
  const { submitToBounty, isConfirming } = useAgriBounties()
  const [submissionData, setSubmissionData] = useState('')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showManagement, setShowManagement] = useState(false)

  const bounty = bountyQuery.data

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
      <div className="border border-emerald-700/50 rounded-lg p-6 bg-emerald-900/30 animate-pulse">
        <div className="h-6 bg-emerald-600/30 rounded mb-4"></div>
        <div className="h-4 bg-emerald-600/30 rounded mb-2"></div>
        <div className="h-4 bg-emerald-600/30 rounded mb-2"></div>
        <div className="h-4 bg-emerald-600/30 rounded w-3/4"></div>
      </div>
    )
  }

  const isExpired = Number(bounty.deadline) <= Math.floor(Date.now() / 1000)
  const isActive = Number(bounty.status) === 0 && !isExpired
  const isCreator = bounty.creator === userAddress

  const formatTimeLeft = (deadline) => {
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
    <div className="border border-emerald-700/50 rounded-lg p-6 hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-emerald-900/30 to-green-900/30 hover:from-emerald-800/40 hover:to-green-800/40">
      {/* Bounty Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-emerald-100 text-lg">{bounty.title}</h3>
            <Badge className={`${getStatusColor(bounty.status)} border backdrop-blur-sm`}>
              {BountyStatus[bounty.status] || 'ACTIVE'}
            </Badge>
            {isCreator && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                Your Bounty
              </Badge>
            )}
          </div>
          <p className="text-emerald-200/80 mb-3 leading-relaxed">{bounty.requirements}</p>
          <div className="text-sm text-emerald-200/80 mb-3">
            <span className="font-medium">Created by:</span> {bounty.creator?.slice(0, 6)}...{bounty.creator?.slice(-4)}
          </div>
        </div>
      </div>

      {/* Bounty Stats */}
      <div className="flex items-center gap-6 text-sm text-emerald-200/80 mb-4">
        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-amber-300 text-base">{formatTokenAmount(bounty.reward)} FARM</span>
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
        <div className="text-sm text-emerald-200/80 mb-2">
          <span className="font-medium">Created:</span> {new Date(Number(bounty.createdAt) * 1000).toLocaleDateString()}
        </div>
        <div className="text-sm text-emerald-200/80">
          <span className="font-medium">Deadline:</span> {new Date(Number(bounty.deadline) * 1000).toLocaleDateString()}
        </div>
      </div>

      {/* Winner Display */}
      {bounty.winner && bounty.winner !== '0x0000000000000000000000000000000000000000' && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
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
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                >
                  <Users className="w-4 h-4 mr-1" />
                  {showManagement ? 'Hide Management' : 'Manage Bounty'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                  variant="outline"
                  className="border-amber-600/50 text-amber-200 hover:bg-amber-800/60 bg-transparent"
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
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold"
              >
                <Send className="w-4 h-4 mr-1" />
                {showSubmissionForm ? 'Cancel' : 'Submit Solution'}
              </Button>
            )}
          </>
        )}
        
        {!isActive && (
          <div className="text-sm text-emerald-400 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {isExpired ? "Bounty expired" : "Bounty completed"}
          </div>
        )}
        
        {!userAddress && (
          <div className="text-sm text-emerald-400 italic">
            Connect wallet to submit solutions
          </div>
        )}
      </div>

      {/* Submission Form */}
      {showSubmissionForm && (
        <div className="mb-4 p-4 bg-emerald-900/20 border border-emerald-700/50 rounded-lg">
          <h4 className="font-medium text-emerald-100 mb-3">Submit Your Solution</h4>
          {isCreator && (
            <Alert className="border-amber-300 bg-amber-50 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Warning:</strong> You're submitting to your own bounty. This may be seen as unfair by the community.
              </AlertDescription>
            </Alert>
          )}
          <textarea
            placeholder="Describe your solution in detail..."
            value={submissionData}
            onChange={(e) => setSubmissionData(e.target.value)}
            className="w-full p-3 border border-emerald-600 rounded-lg bg-emerald-900/20 text-emerald-100 placeholder-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={4}
          />
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm"
              onClick={handleSubmit}
              disabled={isConfirming || !submissionData.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
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
              className="border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* MANAGEMENT PANEL - This should now be visible */}
      {showManagement && isCreator && (
        <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-emerald-100 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              🔧 Manage Your Bounty
            </h4>
            <Badge className="bg-blue-100 text-blue-800">
              {Number(bounty.submissionCount)} Submission{Number(bounty.submissionCount) !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Debug Info */}
          <div className="mb-4 p-2 bg-yellow-900/20 border border-yellow-700/50 rounded text-xs text-yellow-200">
            🐛 Debug: Management panel is visible! BountyId: {bountyId.toString()}, Creator: {isCreator ? 'YES' : 'NO'}
          </div>

          {/* Management Actions */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-300 text-emerald-200 hover:bg-emerald-800/60 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-1" />
              Refresh Submissions
            </Button>
            
            {Number(bounty.submissionCount) === 0 && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-200 hover:bg-red-800/60 bg-transparent"
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
          />
        </div>
      )}
    </div>
  )
}

// Create Bounty Form Component
const CreateBountyForm = ({ userAddress }) => {
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
        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 shadow-xl font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Bounty
      </Button>
    )
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 mb-8">
      <CardHeader>
        <CardTitle className="text-slate-800 flex items-center gap-2">
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
            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              className="p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <input
              type="number"
              placeholder="Duration"
              min="1"
              value={newBounty.duration}
              onChange={(e) => setNewBounty({...newBounty, duration: e.target.value})}
              className="p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <select
              value={newBounty.durationUnit}
              onChange={(e) => setNewBounty({...newBounty, durationUnit: e.target.value})}
              className="p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
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
  const userProfile = useUserProfile(address)
  const creatorBounties = useCreatorBounties(address)
  const submitterBounties = useSubmitterBounties(address)
  const farmBalance = useFarmTokenBalance(address)

  // Refresh bounties when user creates one
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-emerald-100 mb-2">
                <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  Agricultural Bounties
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">Solve farming challenges and earn rewards for your innovations</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-amber-600/50 text-amber-200 hover:bg-amber-800/60 bg-transparent hover:border-amber-500">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <CreateBountyForm userAddress={address} />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">{totalBounties}</div>
                <div className="text-sm text-emerald-200/80">Total Bounties</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">{userProfile ? Number(userProfile[3]) : 0}</div>
                <div className="text-sm text-emerald-200/80">My Submissions</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Coins className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">
                  {userProfile ? formatTokenAmount(userProfile[4]).split('.')[0] : 0}
                </div>
                <div className="text-sm text-emerald-200/80">FARM Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">{userProfile ? Number(userProfile[2]) : 0}</div>
                <div className="text-sm text-emerald-200/80">Bounties Won</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Available Bounties */}
            <div className="lg:col-span-2">
              <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="text-emerald-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    Available Bounties ({selectedBounties.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-12 text-emerald-200/80">
                      <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <h3 className="text-lg font-medium mb-2">Loading Bounties...</h3>
                      <p className="text-sm">Scanning bounties 1-20 on the blockchain...</p>
                    </div>
                  ) : selectedBounties.length === 0 ? (
                    <div className="text-center py-12 text-emerald-200/80">
                      <Target className="w-16 h-16 mx-auto mb-4 text-emerald-400/50" />
                      <h3 className="text-lg font-medium mb-2">No Bounties Found</h3>
                      <p className="text-sm">Create the first bounty or check if your contract is deployed correctly!</p>
                      <p className="text-xs mt-2 text-emerald-300">
                        Searched bounties 1-20. Found: {totalBounties} | 
                        Contract: {contracts.AGRI_BOUNTIES?.slice(0, 10)}...
                      </p>
                      <Button 
                        onClick={() => refetch()}
                        variant="outline"
                        size="sm"
                        className="mt-3 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent"
                      >
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedBounties.map((bountyId) => (
                        <BountyCard key={bountyId.toString()} bountyId={bountyId} userAddress={address} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Profile */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
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
                    <div className="text-center py-6">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                      <p className="text-slate-600 mb-3">Connect your wallet to view your bounty profile</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
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
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="font-medium text-slate-800">Create or Find Bounties</p>
                        <p className="text-slate-600">Post challenges or browse existing ones</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <p className="font-medium text-slate-800">Submit Solutions</p>
                        <p className="text-slate-600">Share your innovative ideas and implementations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
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