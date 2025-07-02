'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type InviteContextType = {
  ids: string[] | null
  setIds: (ids: string[]) => void
  loading: boolean
}

const InviteContext = createContext<InviteContextType>({
  ids: null,
  setIds: () => {},
  loading: true,
})

export const useInvite = () => useContext(InviteContext)

export const InviteProvider = ({ children }: { children: React.ReactNode }) => {
  const [ids, setIdsState] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('inviteIds')
    if (stored) {
      setIdsState(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const setIds = (ids: string[]) => {
    setIdsState(ids)
    sessionStorage.setItem('inviteIds', JSON.stringify(ids))
  }

  return (
    <InviteContext.Provider value={{ ids, setIds, loading }}>
      {children}
    </InviteContext.Provider>
  )
}
