import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { useCtaDetails } from "../hooks/useCtaDetails"
import type { CtaDetails } from "../hooks/useCtaDetails"

const mockCtaDetails: CtaDetails = {
  image: "https://example.com/ad-image.jpg",
  url: "https://example.com/ad-destination",
  buySlotUrl: "https://example.com/buy-slot",
  buyer: {
    fid: 12345,
    username: "testuser",
    avatar: "https://example.com/avatar.jpg",
    displayName: "Test User",
    address: "0x1234567890abcdef",
  },
}

describe("useCtaDetails", () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.fetch = originalFetch
  })

  it("returns initial loading state when castHash is provided", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as any

    const { result } = renderHook(() => useCtaDetails({ castHash: "0x123" }))

    expect(result.current.loading).toBe(true)
    expect(result.current.ctaDetails).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("returns non-loading state when castHash is empty", () => {
    const { result } = renderHook(() => useCtaDetails({ castHash: "" }))

    expect(result.current.loading).toBe(false)
    expect(result.current.ctaDetails).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("returns non-loading state when castHash is whitespace only", () => {
    const { result } = renderHook(() => useCtaDetails({ castHash: "   " }))

    expect(result.current.loading).toBe(false)
    expect(result.current.ctaDetails).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("fetches and returns ctaDetails on success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCtaDetails),
    })

    const { result } = renderHook(() => useCtaDetails({ castHash: "0x123" }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.ctaDetails).toEqual(mockCtaDetails)
    expect(result.current.error).toBeNull()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://www.adsterix.xyz/api/ads/cta-details/0x123",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it("sets error on fetch failure", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    })

    const { result } = renderHook(() => useCtaDetails({ castHash: "0x123" }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.ctaDetails).toBeNull()
    expect(result.current.error).toBe("Failed to fetch: 404")
  })

  it("sets error on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useCtaDetails({ castHash: "0x123" }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.ctaDetails).toBeNull()
    expect(result.current.error).toBe("Network error")
  })

  it("ignores abort errors", async () => {
    const abortError = new Error("Aborted")
    abortError.name = "AbortError"
    globalThis.fetch = vi.fn().mockRejectedValue(abortError)

    const { result } = renderHook(() => useCtaDetails({ castHash: "0x123" }))

    // Wait a bit for the fetch to be called
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Should not set error for abort
    expect(result.current.error).toBeNull()
  })

  it("refetches data when refetch is called", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCtaDetails),
    })

    const { result } = renderHook(() => useCtaDetails({ castHash: "0x123" }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    })
  })

  it("resets state when reset is called", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCtaDetails),
    })

    const { result } = renderHook(() => useCtaDetails({ castHash: "0x123" }))

    await waitFor(() => {
      expect(result.current.ctaDetails).toEqual(mockCtaDetails)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.ctaDetails).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("refetches when castHash changes", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCtaDetails),
    })

    const { result, rerender } = renderHook(({ castHash }: { castHash: string }) => useCtaDetails({ castHash }), {
      initialProps: { castHash: "0x123" },
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)

    rerender({ castHash: "0x456" })

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    })

    expect(globalThis.fetch).toHaveBeenLastCalledWith(
      "https://www.adsterix.xyz/api/ads/cta-details/0x456",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it("trims whitespace from castHash", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCtaDetails),
    })

    renderHook(() => useCtaDetails({ castHash: "  0x123  " }))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://www.adsterix.xyz/api/ads/cta-details/0x123",
        expect.any(Object),
      )
    })
  })
})
