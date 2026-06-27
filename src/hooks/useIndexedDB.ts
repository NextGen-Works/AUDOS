import { useEffect, useState } from 'react'

export type StorageKey = 
  | 'entries' 
  | 'lessons' 
  | 'nodes' 
  | 'audioSettings'
  | 'journalSettings'

type StorageData = {
  entries: any[]
  lessons: any[]
  nodes: any[]
  audioSettings: any
  journalSettings: any
}

const STORAGE_PREFIX = 'audos_'

export function useIndexedDB(storageKey: StorageKey, initialData: any, version: number = 1) {
  const [data, setData] = useState<any[]>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const storageKeyWithPrefix = `${STORAGE_PREFIX}${storageKey}`

  useEffect(() => {
    loadData()
  }, [storageKey])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const stored = localStorage.getItem(storageKeyWithPrefix)
      if (stored) {
        const parsed = JSON.parse(stored)
        setData(parsed)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async (newData: any) => {
    setIsLoading(true)
    setError(null)
    
    try {
      localStorage.setItem(storageKeyWithPrefix, JSON.stringify(newData))
      setData(newData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data')
    } finally {
      setIsLoading(false)
    }
  }

  const resetData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      localStorage.removeItem(storageKeyWithPrefix)
      setData(initialData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset data')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    data,
    setData: saveData,
    resetData,
    isLoading,
    error,
    loadData,
  }
}
