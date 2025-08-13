// types/next.d.ts
import type { ReactNode } from 'react'

declare module 'next' {
  // Typage global correct pour les pages App Router
  export interface PageProps {
    params?: { [key: string]: string }
    searchParams?: { [key: string]: string | undefined }
    children?: ReactNode
  }
}
