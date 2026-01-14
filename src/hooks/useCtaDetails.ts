import * as React from "react"

export interface CtaDetails {
  image: string
  url: string
  buySlotUrl: string
  buyer?: {
    fid: number
    username: string
    avatar: string
    displayName: string
    address: string
  }
}

export interface UseCtaDetailsReturn {
  ctaDetails: CtaDetails | null
  loading: boolean
  error: string | null
  refetch: () => void
  reset: () => void
}

export const useCtaDetails = (params: { castHash: string }): UseCtaDetailsReturn => {
  const { castHash } = params
  const [ctaDetails, setCtaDetails] = React.useState<CtaDetails | null>(null)
  // Start loading if we have a valid castHash to avoid flash of empty state
  const [loading, setLoading] = React.useState(Boolean(castHash.trim()))
  const [error, setError] = React.useState<string | null>(null)

  const fetchCta = React.useCallback(
    async (signal?: AbortSignal) => {
      const trimmedHash = castHash?.trim()
      if (!trimmedHash) {
        setCtaDetails(null)
        setLoading(false)
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://www.adsterix.xyz/api/ads/cta-details/${trimmedHash}`, { signal })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        setCtaDetails(data)
      } catch (err) {
        if ((err as any)?.name === "AbortError") return
        setError(err instanceof Error ? err.message : "Unknown error")
        setCtaDetails(null)
      } finally {
        setLoading(false)
      }
    },
    [castHash],
  )

  React.useEffect(() => {
    const controller = new AbortController()
    fetchCta(controller.signal)
    return () => controller.abort()
  }, [fetchCta])

  const refetch = React.useCallback(() => {
    fetchCta()
  }, [fetchCta])

  const reset = React.useCallback(() => {
    setCtaDetails(null)
    setLoading(false)
    setError(null)
  }, [])

  return { ctaDetails, loading, error, refetch, reset }
}

export default useCtaDetails
