"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface RefreshContextType {
  refreshTrigger: number
  triggerRefresh: () => void
  triggerRefreshWithDelay: (delay?: number) => void
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined)

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = useCallback(() => {
    console.log('Global refresh triggered')
    setRefreshTrigger(prev => {
      const newValue = prev + 1
      console.log('Global refresh trigger updated from', prev, 'to', newValue)
      return newValue
    })
  }, [])

  const triggerRefreshWithDelay = useCallback((delay: number = 2000) => {
    console.log('Global refresh with delay triggered:', delay + 'ms')
    setTimeout(() => {
      triggerRefresh()
    }, delay)
  }, [triggerRefresh])

  return (
    <RefreshContext.Provider value={{ 
      refreshTrigger, 
      triggerRefresh, 
      triggerRefreshWithDelay 
    }}>
      {children}
    </RefreshContext.Provider>
  )
}

export function useGlobalRefresh() {
  const context = useContext(RefreshContext)
  if (context === undefined) {
    throw new Error('useGlobalRefresh must be used within a RefreshProvider')
  }
  return context
}
