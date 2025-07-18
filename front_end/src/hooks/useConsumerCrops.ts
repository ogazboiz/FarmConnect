import { useState, useEffect, useCallback } from 'react'

export interface CropData {
  tokenId: number
  cropType: string
  location: string
  farmer: string
  status: string
  isOrganic: boolean
  quantity: bigint | string
  createdAt: bigint | string
  harvestDate: bigint | string
  cropImage: string
  certifications: string
  scanCount: bigint | string
  ratingSum: bigint | string
  ratingCount: bigint | string
}

export const useAllCropsForConsumers = () => {
  const [crops, setCrops] = useState<CropData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCrops = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/getAllCrops')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch crops')
      }
      
      const data = await response.json()
      
      // Convert string values back to BigInt where needed for frontend usage
      const processedCrops = data.map((crop: CropData) => ({
        ...crop,
        quantity: BigInt(crop.quantity),
        createdAt: BigInt(crop.createdAt),
        harvestDate: BigInt(crop.harvestDate),
        scanCount: BigInt(crop.scanCount),
        ratingSum: BigInt(crop.ratingSum),
        ratingCount: BigInt(crop.ratingCount)
      }))
      
      setCrops(processedCrops)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching crops:', err)
      setCrops([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCrops()
  }, [])

  // Helper function to get filtered crops
  const getFilteredCrops = (filters?: {
    organic?: boolean
    status?: string
    location?: string
    cropType?: string
    minRating?: number
  }) => {
    if (!filters) return crops

    return crops.filter(crop => {
      if (filters.organic !== undefined && crop.isOrganic !== filters.organic) {
        return false
      }
      
      if (filters.status && crop.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false
      }
      
      if (filters.location && !crop.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      
      if (filters.cropType && !crop.cropType.toLowerCase().includes(filters.cropType.toLowerCase())) {
        return false
      }
      
      if (filters.minRating && Number(crop.ratingCount) > 0) {
        const avgRating = Number(crop.ratingSum) / Number(crop.ratingCount)
        if (avgRating < filters.minRating) {
          return false
        }
      }
      
      return true
    })
  }

  // Helper function to search crops
  const searchCrops = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return crops.filter(crop => 
      crop.cropType.toLowerCase().includes(lowercaseQuery) ||
      crop.location.toLowerCase().includes(lowercaseQuery) ||
      crop.farmer.toLowerCase().includes(lowercaseQuery) ||
      crop.status.toLowerCase().includes(lowercaseQuery) ||
      (crop.certifications && crop.certifications.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Helper function to sort crops
  const getSortedCrops = (sortBy: 'newest' | 'oldest' | 'mostScanned' | 'highestRated' | 'alphabetical') => {
    const sortedCrops = [...crops]
    
    switch (sortBy) {
      case 'newest':
        return sortedCrops.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      
      case 'oldest':
        return sortedCrops.sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
      
      case 'mostScanned':
        return sortedCrops.sort((a, b) => Number(b.scanCount) - Number(a.scanCount))
      
      case 'highestRated':
        return sortedCrops.sort((a, b) => {
          const avgA = Number(a.ratingCount) > 0 ? Number(a.ratingSum) / Number(a.ratingCount) : 0
          const avgB = Number(b.ratingCount) > 0 ? Number(b.ratingSum) / Number(b.ratingCount) : 0
          return avgB - avgA
        })
      
      case 'alphabetical':
        return sortedCrops.sort((a, b) => a.cropType.localeCompare(b.cropType))
      
      default:
        return sortedCrops
    }
  }

  return {
    crops,
    loading,
    error,
    refetch: fetchCrops,
    
    // Utility functions
    getFilteredCrops,
    searchCrops,
    getSortedCrops,
    
    // Computed values
    totalCrops: crops.length,
    organicCrops: crops.filter(crop => crop.isOrganic).length,
    harvestedCrops: crops.filter(crop => crop.status.toLowerCase() === 'harvested').length,
    
    // Loading states
    isEmpty: !loading && crops.length === 0,
    hasData: crops.length > 0,
  }
}

// Hook for single crop (for scan page)
export const useCropForConsumer = (tokenId?: string | number) => {
  const [crop, setCrop] = useState<CropData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCrop = useCallback(async () => {
    if (!tokenId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/getCropBatch?tokenId=${tokenId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch crop')
      }

      const data = await response.json()

      // Convert string values back to BigInt where needed
      const processedCrop = {
        ...data,
        tokenId: typeof tokenId === 'string' ? parseInt(tokenId) : tokenId,
        quantity: BigInt(data.quantity),
        createdAt: BigInt(data.createdAt),
        harvestDate: BigInt(data.harvestDate),
        scanCount: BigInt(data.scanCount),
        ratingSum: BigInt(data.ratingSum),
        ratingCount: BigInt(data.ratingCount)
      }

      setCrop(processedCrop)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching crop:', err)
      setCrop(null)
    } finally {
      setLoading(false)
    }
  }, [tokenId])

  useEffect(() => {
    if (tokenId) {
      fetchCrop()
    }
  }, [tokenId])

  return { crop, loading, error, refetch: fetchCrop }
}