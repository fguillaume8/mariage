'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type InviteContextType = {
  ids: string[] | null
  setIds: (ids: string[]) => void
}

const InviteContext = createContext<InviteContextType>({
  ids: null,
  setIds: () => {},
})

export const useInvite = () => useContext(InviteContext)

export const InviteProvider = ({ children }: { children: React.ReactNode }) => {
  const [ids, setIdsState] = useState<string[] | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('inviteIds')
    if (stored) setIdsState(JSON.parse(stored))
  }, [])

  const setIds = (ids: string[]) => {
    setIdsState(ids)
    sessionStorage.setItem('inviteIds', JSON.stringify(ids))
  }

  return (
    <InviteContext.Provider value={{ ids, setIds }}>
      {children}
    </InviteContext.Provider>
  )
}
