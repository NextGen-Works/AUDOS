import { useState, useEffect, useRef } from 'react'

type StorageValue = any

export function useStorage<T>(key: string, initialValue: T, storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return

    const loadValue = () => {
      try {
        const storage = storageType === 'localStorage' ? localStorage : sessionStorage
        const item = storage.getItem(key)
        if (item !== null) {
          setStoredValue(JSON.parse(item))
        } else {
          setStoredValue(initialValue)
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load from storage')
        setStoredValue(initialValue)
      } finally {
        setIsLoading(false)
        isInitialized.current = true
      }
    }

    loadValue()
  }, [key, initialValue, storageType])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      storage.setItem(key, JSON.stringify(valueToStore))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save to storage')
    }
  }

  return { storedValue, setValue, isLoading, error }
}
