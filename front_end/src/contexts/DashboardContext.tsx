"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Types
export type CropType = {
  id: number
  name: string
  variety: string
  planted: string
  location: string
  stage: string
  progress: number
  health: string
  nextAction: string
  image: string
  soil: {
    ph: number
    nitrogen: string
    phosphorus: string
    potassium: string
  }
  weather: {
    temperature: string
    humidity: string
    rainfall: string
  }
  nftId: string
  contractAddress: string
  blockchainData: {
    totalTransactions: number
    lastUpdate: string
    carbonCredits: number
    sustainabilityScore: number
  }
}

export type BountyType = {
  id: number
  title: string
  description: string
  reward: number
  difficulty: string
  category: string
  timeRemaining: string
  participants: number
  status: string
  image: string
  requirements: string[]
  submittedBy: string
  deadline: string
}

export type CooperativeType = {
  id: number
  name: string
  description: string
  members: number
  founded: string
  category: string
  votingPower: number
  status: string
  proposals: number
  treasury: number
}

export type BlockchainRecordType = {
  crop: string
  action: string
  block: string
  gas: string
  timestamp: string
  status: string
  txHash: string
  cropId: number
}

// Context interface
interface DashboardContextType {
  // State
  crops: CropType[]
  bounties: BountyType[]
  cooperatives: CooperativeType[]
  blockchainRecords: BlockchainRecordType[]
  isLoading: boolean
  
  // Actions
  addCrop: (crop: Omit<CropType, 'id'>) => void
  updateCrop: (id: number, updates: Partial<CropType>) => void
  deleteCrop: (id: number) => void
  addBounty: (bounty: Omit<BountyType, 'id'>) => void
  updateBounty: (id: number, updates: Partial<BountyType>) => void
  joinCooperative: (cooperativeId: number) => void
  addBlockchainRecord: (record: Omit<BlockchainRecordType, 'id'>) => void
  refreshData: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Initial mock data
const initialCrops: CropType[] = [
  {
    id: 1,
    name: "Organic Tomatoes",
    variety: "Cherry Tomatoes",
    planted: "2024-01-15",
    location: "Field A-1",
    stage: "Flowering",
    progress: 65,
    health: "Excellent",
    nextAction: "Watering in 2 days",
    image: "/placeholder.svg?height=200&width=300",
    soil: { ph: 6.5, nitrogen: "High", phosphorus: "Medium", potassium: "High" },
    weather: { temperature: "22°C", humidity: "65%", rainfall: "12mm" },
    nftId: "0x1a2b...3c4d",
    contractAddress: "0xAbC123...DeF456",
    blockchainData: {
      totalTransactions: 15,
      lastUpdate: "2024-03-01 14:30",
      carbonCredits: 2.5,
      sustainabilityScore: 95
    }
  },
  {
    id: 2,
    name: "Sweet Corn",
    variety: "Golden Bantam",
    planted: "2024-02-01",
    location: "Field B-2",
    stage: "Growing",
    progress: 45,
    health: "Good",
    nextAction: "Fertilize tomorrow",
    image: "/placeholder.svg?height=200&width=300",
    soil: { ph: 6.8, nitrogen: "Medium", phosphorus: "High", potassium: "Medium" },
    weather: { temperature: "25°C", humidity: "70%", rainfall: "8mm" },
    nftId: "0x2b3c...4d5e",
    contractAddress: "0xAbC123...DeF456",
    blockchainData: {
      totalTransactions: 12,
      lastUpdate: "2024-02-28 09:15",
      carbonCredits: 1.8,
      sustainabilityScore: 88
    }
  },
  {
    id: 3,
    name: "Lettuce",
    variety: "Romaine",
    planted: "2024-02-20",
    location: "Greenhouse 1",
    stage: "Seedling",
    progress: 25,
    health: "Good",
    nextAction: "Monitor growth",
    image: "/placeholder.svg?height=200&width=300",
    soil: { ph: 6.2, nitrogen: "High", phosphorus: "Medium", potassium: "Medium" },
    weather: { temperature: "20°C", humidity: "75%", rainfall: "5mm" },
    nftId: "0x3c4d...5e6f",
    contractAddress: "0xAbC123...DeF456",
    blockchainData: {
      totalTransactions: 8,
      lastUpdate: "2024-02-25 16:45",
      carbonCredits: 1.2,
      sustainabilityScore: 92
    }
  }
]

const initialBounties: BountyType[] = [
  {
    id: 1,
    title: "Organic Pest Control Solution",
    description: "Develop an organic solution for controlling aphids in vegetable crops without harmful chemicals.",
    reward: 500,
    difficulty: "Medium",
    category: "Pest Control",
    timeRemaining: "5 days",
    participants: 12,
    status: "Active",
    image: "/placeholder.svg?height=200&width=300",
    requirements: ["Organic certification", "Field testing", "Documentation"],
    submittedBy: "GreenFarms DAO",
    deadline: "2024-03-15"
  },
  {
    id: 2,
    title: "Water-Efficient Irrigation System",
    description: "Design an automated irrigation system that reduces water usage by 30% while maintaining crop yield.",
    reward: 1200,
    difficulty: "Hard",
    category: "Water Management",
    timeRemaining: "12 days",
    participants: 8,
    status: "Active",
    image: "/placeholder.svg?height=200&width=300",
    requirements: ["Engineering background", "Prototype development", "Cost analysis"],
    submittedBy: "AquaFarm Collective",
    deadline: "2024-03-22"
  }
]

const initialCooperatives: CooperativeType[] = [
  {
    id: 1,
    name: "Organic Farmers United",
    description: "A collective of farmers committed to sustainable and organic farming practices.",
    members: 245,
    founded: "2023-05-15",
    category: "Organic Farming",
    votingPower: 1250,
    status: "Active",
    proposals: 8,
    treasury: 125000
  },
  {
    id: 2,
    name: "Tech-Forward Agriculture",
    description: "Embracing technology and blockchain solutions for modern farming challenges.",
    members: 189,
    founded: "2023-08-20",
    category: "AgriTech",
    votingPower: 890,
    status: "Active",
    proposals: 12,
    treasury: 98500
  }
]

const initialBlockchainRecords: BlockchainRecordType[] = [
  {
    crop: "Organic Tomatoes",
    action: "Planting Record",
    block: "0x1a2b3c4d...",
    gas: "21,000",
    timestamp: "2024-01-15 08:30",
    status: "Confirmed",
    txHash: "0x1234567890abcdef...",
    cropId: 1
  },
  {
    crop: "Sweet Corn",
    action: "Growth Update",
    block: "0x2b3c4d5e...",
    gas: "18,500",
    timestamp: "2024-02-15 14:20",
    status: "Confirmed",
    txHash: "0x2345678901bcdef0...",
    cropId: 2
  }
]

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [crops, setCrops] = useState<CropType[]>(initialCrops)
  const [bounties, setBounties] = useState<BountyType[]>(initialBounties)
  const [cooperatives, setCooperatives] = useState<CooperativeType[]>(initialCooperatives)
  const [blockchainRecords, setBlockchainRecords] = useState<BlockchainRecordType[]>(initialBlockchainRecords)
  const [isLoading, setIsLoading] = useState(false)

  // Crop actions
  const addCrop = useCallback((newCrop: Omit<CropType, 'id'>) => {
    const crop: CropType = {
      ...newCrop,
      id: Date.now() // Simple ID generation
    }
    setCrops(prev => [...prev, crop])
    
    // Add blockchain record for new crop
    const record: BlockchainRecordType = {
      crop: crop.name,
      action: "Planting Record",
      block: `0x${Math.random().toString(16).substr(2, 8)}...`,
      gas: "21,000",
      timestamp: new Date().toLocaleString(),
      status: "Confirmed",
      txHash: `0x${Math.random().toString(16).substr(2, 16)}...`,
      cropId: crop.id
    }
    setBlockchainRecords(prev => [record, ...prev])
  }, [])

  const updateCrop = useCallback((id: number, updates: Partial<CropType>) => {
    setCrops(prev => prev.map(crop => 
      crop.id === id ? { ...crop, ...updates } : crop
    ))
    
    // Add blockchain record for update
    const crop = crops.find(c => c.id === id)
    if (crop) {
      const record: BlockchainRecordType = {
        crop: crop.name,
        action: "Growth Update",
        block: `0x${Math.random().toString(16).substr(2, 8)}...`,
        gas: "18,500",
        timestamp: new Date().toLocaleString(),
        status: "Confirmed",
        txHash: `0x${Math.random().toString(16).substr(2, 16)}...`,
        cropId: id
      }
      setBlockchainRecords(prev => [record, ...prev])
    }
  }, [crops])

  const deleteCrop = useCallback((id: number) => {
    setCrops(prev => prev.filter(crop => crop.id !== id))
    setBlockchainRecords(prev => prev.filter(record => record.cropId !== id))
  }, [])

  // Bounty actions
  const addBounty = useCallback((newBounty: Omit<BountyType, 'id'>) => {
    const bounty: BountyType = {
      ...newBounty,
      id: Date.now()
    }
    setBounties(prev => [...prev, bounty])
  }, [])

  const updateBounty = useCallback((id: number, updates: Partial<BountyType>) => {
    setBounties(prev => prev.map(bounty => 
      bounty.id === id ? { ...bounty, ...updates } : bounty
    ))
  }, [])

  // Cooperative actions
  const joinCooperative = useCallback((cooperativeId: number) => {
    setCooperatives(prev => prev.map(coop => 
      coop.id === cooperativeId 
        ? { ...coop, members: coop.members + 1 }
        : coop
    ))
  }, [])

  // Blockchain actions
  const addBlockchainRecord = useCallback((newRecord: Omit<BlockchainRecordType, 'id'>) => {
    const record: BlockchainRecordType = {
      ...newRecord
    }
    setBlockchainRecords(prev => [record, ...prev])
  }, [])

  // Refresh data (for future API integration)
  const refreshData = useCallback(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const contextValue: DashboardContextType = {
    crops,
    bounties,
    cooperatives,
    blockchainRecords,
    isLoading,
    addCrop,
    updateCrop,
    deleteCrop,
    addBounty,
    updateBounty,
    joinCooperative,
    addBlockchainRecord,
    refreshData
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
