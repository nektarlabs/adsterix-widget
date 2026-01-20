import * as React from "react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AdsterixWidget } from "../AdsterixWidget"
import type { CtaDetails } from "../hooks/useCtaDetails"

// Mock the useCtaDetails hook
vi.mock("../hooks/useCtaDetails", () => ({
  default: vi.fn(),
  useCtaDetails: vi.fn(),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock ResizeObserver to always report a large width (so labels show)
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
vi.stubGlobal("ResizeObserver", mockResizeObserver)

// Mock window.open
const mockWindowOpen = vi.fn()
vi.stubGlobal("open", mockWindowOpen)

import useCtaDetails from "../hooks/useCtaDetails"

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

const mockCtaDetailsNoBuyer: CtaDetails = {
  image: "https://example.com/ad-image.jpg",
  url: "https://example.com/ad-destination",
  buySlotUrl: "https://example.com/buy-slot",
}

describe("AdsterixWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useCtaDetails as any).mockReturnValue({
      ctaDetails: mockCtaDetails,
      loading: false,
      error: null,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("Rendering", () => {
    it("renders loading state when loading", () => {
      ;(useCtaDetails as any).mockReturnValue({
        ctaDetails: null,
        loading: true,
        error: null,
      })

      const { container } = render(<AdsterixWidget castHash="0x123" />)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders error state when there is an error", () => {
      ;(useCtaDetails as any).mockReturnValue({
        ctaDetails: null,
        loading: false,
        error: "Failed to fetch",
      })

      render(<AdsterixWidget castHash="0x123" />)
      expect(screen.getByText("Unable to load ad")).toBeInTheDocument()
    })

    it("renders the hidden image for preloading", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" />)
      const hiddenImg = container.querySelector('img[style*="display: none"]')
      expect(hiddenImg).toHaveAttribute("src", mockCtaDetails.image)
    })

    it("renders with custom width and height", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" width={400} height={200} />)
      const widget = container.firstChild as HTMLElement
      expect(widget.style.width).toBe("400px")
      expect(widget.style.height).toBe("200px")
    })

    it("renders with string width and height", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" width="50%" height="auto" />)
      const widget = container.firstChild as HTMLElement
      expect(widget.style.width).toBe("50%")
      expect(widget.style.height).toBe("auto")
    })

    it("returns null when not visible", () => {
      const onClose = vi.fn()
      const { container } = render(<AdsterixWidget castHash="0x123" showCloseButton onClose={onClose} />)

      const closeButton = container.querySelector('[style*="border-radius: 50%"]')
      if (closeButton) {
        fireEvent.click(closeButton)
      }

      expect(container.firstChild).toBeNull()
    })
  })

  describe("Ad Sparkle Label", () => {
    it("does not show ad sparkle label by default", () => {
      render(<AdsterixWidget castHash="0x123" />)
      expect(screen.queryByText("Ad")).not.toBeInTheDocument()
    })

    it("shows ad sparkle label when showAdSparkleLabel is true", () => {
      render(<AdsterixWidget castHash="0x123" showAdSparkleLabel />)
      expect(screen.getByText("Ad")).toBeInTheDocument()
    })
  })

  describe("Close Button", () => {
    it("does not show close button by default", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" />)
      // Close button has X icon, check there's no element with that specific style
      const closeButtons = container.querySelectorAll('[style*="border-radius: 50%"]')
      expect(closeButtons.length).toBe(0)
    })

    it("shows close button when showCloseButton is true", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" showCloseButton />)
      const closeButton = container.querySelector('[style*="border-radius: 50%"]')
      expect(closeButton).toBeInTheDocument()
    })

    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn()
      const { container } = render(<AdsterixWidget castHash="0x123" showCloseButton onClose={onClose} />)

      const closeButton = container.querySelector('[style*="border-radius: 50%"]')
      if (closeButton) {
        fireEvent.click(closeButton)
      }

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe("Buy Slot Button", () => {
    it("does not show buy slot button by default", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" />)
      const buttons = container.querySelectorAll('[style*="cursor: pointer"]')
      // Should only have the main container with cursor pointer, no buttons
      expect(buttons.length).toBe(1)
    })

    it("shows buy slot button when showBuySlotButton is true", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" showBuySlotButton />)
      // Check for the shopping bag icon (SVG)
      const svg = container.querySelector('svg.lucide-shopping-bag')
      expect(svg).toBeInTheDocument()
    })

    it("calls onBuySlotClick and opens new window when buy slot button is clicked", () => {
      const onBuySlotClick = vi.fn()
      const { container } = render(<AdsterixWidget castHash="0x123" showBuySlotButton onBuySlotClick={onBuySlotClick} />)

      const button = container.querySelector('svg.lucide-shopping-bag')?.closest('div[style*="cursor: pointer"]')
      if (button) {
        fireEvent.click(button)
      }

      expect(mockWindowOpen).toHaveBeenCalledWith(mockCtaDetails.buySlotUrl, "_blank", "noopener,noreferrer")
      expect(onBuySlotClick).toHaveBeenCalledWith(mockCtaDetails.buySlotUrl)
    })

    it("applies custom buySlotButtonStyle", () => {
      const customStyle = { background: "red", color: "white" }
      const { container } = render(<AdsterixWidget castHash="0x123" showBuySlotButton buySlotButtonStyle={customStyle} />)

      const button = container.querySelector('svg.lucide-shopping-bag')?.closest('div[style*="cursor: pointer"]')
      expect(button).toHaveStyle({ background: "red" })
      // Color gets computed as rgb value
      expect(button).toHaveStyle({ color: "rgb(255, 255, 255)" })
    })
  })

  describe("CTA Button", () => {
    it("does not show CTA button by default", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" />)
      const buttons = container.querySelectorAll('[style*="cursor: pointer"]')
      // Should only have the main container with cursor pointer, no buttons
      expect(buttons.length).toBe(1)
    })

    it("shows CTA button when showCtaButton is true", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" showCtaButton />)
      // The button should exist
      const buttonContainer = container.querySelector('[style*="bottom: 12px"]')
      expect(buttonContainer?.children.length).toBeGreaterThan(0)
    })

    it("calls onCtaButtonClick and opens new window when CTA button is clicked", () => {
      const onCtaButtonClick = vi.fn()
      const { container } = render(<AdsterixWidget castHash="0x123" showCtaButton onCtaButtonClick={onCtaButtonClick} />)

      const buttonContainer = container.querySelector('[style*="bottom: 12px"]')
      const button = buttonContainer?.querySelector('div[style*="cursor: pointer"]')
      if (button) {
        fireEvent.click(button)
      }

      expect(mockWindowOpen).toHaveBeenCalledWith(mockCtaDetails.url, "_blank", "noopener,noreferrer")
      expect(onCtaButtonClick).toHaveBeenCalledWith(mockCtaDetails)
    })

    it("applies custom ctaButtonStyle", () => {
      const customStyle = { background: "blue", borderRadius: "0px" }
      const { container } = render(<AdsterixWidget castHash="0x123" showCtaButton ctaButtonStyle={customStyle} />)

      const buttonContainer = container.querySelector('[style*="bottom: 12px"]')
      const button = buttonContainer?.querySelector('div[style*="cursor: pointer"]')
      expect(button).toHaveStyle({ background: "blue", borderRadius: "0px" })
    })
  })

  describe("onAdClick", () => {
    it("calls onAdClick when the ad container is clicked", () => {
      const onAdClick = vi.fn()
      const { container } = render(<AdsterixWidget castHash="0x123" onAdClick={onAdClick} />)

      const adContainer = container.firstChild as HTMLElement
      fireEvent.click(adContainer)

      expect(onAdClick).toHaveBeenCalledWith(mockCtaDetails)
    })

    it("does not call onAdClick when ctaDetails is null", () => {
      ;(useCtaDetails as any).mockReturnValue({
        ctaDetails: null,
        loading: false,
        error: null,
      })

      const onAdClick = vi.fn()
      const { container } = render(<AdsterixWidget castHash="0x123" onAdClick={onAdClick} />)

      // When loading is false and ctaDetails is null, it shows loading state
      // So clicking shouldn't trigger onAdClick
      const adContainer = container.firstChild as HTMLElement
      if (adContainer) {
        fireEvent.click(adContainer)
      }

      expect(onAdClick).not.toHaveBeenCalled()
    })
  })

  describe("Custom CTA Nodes", () => {
    it("renders custom CTA nodes instead of default buttons", () => {
      render(
        <AdsterixWidget
          castHash="0x123"
          showCtaButton
          showBuySlotButton
          ctaNodes={[
            <button key="custom1">Custom Button 1</button>,
            <button key="custom2">Custom Button 2</button>,
          ]}
        />,
      )

      expect(screen.getByText("Custom Button 1")).toBeInTheDocument()
      expect(screen.getByText("Custom Button 2")).toBeInTheDocument()
    })

    it("calls onCtaNodeClick when a custom node is clicked", () => {
      const onCtaNodeClick = vi.fn()
      render(
        <AdsterixWidget
          castHash="0x123"
          ctaNodes={[<button key="custom">Custom Button</button>]}
          onCtaNodeClick={onCtaNodeClick}
        />,
      )

      fireEvent.click(screen.getByText("Custom Button"))

      expect(onCtaNodeClick).toHaveBeenCalledWith(0, expect.any(Object), mockCtaDetails)
    })

    it("passes correct index for multiple custom nodes", () => {
      const onCtaNodeClick = vi.fn()
      render(
        <AdsterixWidget
          castHash="0x123"
          ctaNodes={[
            <button key="custom1">Button 1</button>,
            <button key="custom2">Button 2</button>,
          ]}
          onCtaNodeClick={onCtaNodeClick}
        />,
      )

      fireEvent.click(screen.getByText("Button 2"))

      expect(onCtaNodeClick).toHaveBeenCalledWith(1, expect.any(Object), mockCtaDetails)
    })
  })

  describe("Default Image", () => {
    it("uses ad image when buyer exists", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" defaultImage="https://example.com/default.jpg" />)

      const hiddenImg = container.querySelector('img[style*="display: none"]')
      expect(hiddenImg).toHaveAttribute("src", mockCtaDetails.image)
    })

    it("uses defaultImage when no buyer and defaultImage is provided", () => {
      ;(useCtaDetails as any).mockReturnValue({
        ctaDetails: mockCtaDetailsNoBuyer,
        loading: false,
        error: null,
      })

      const { container } = render(<AdsterixWidget castHash="0x123" defaultImage="https://example.com/default.jpg" />)

      const hiddenImg = container.querySelector('img[style*="display: none"]')
      expect(hiddenImg).toHaveAttribute("src", "https://example.com/default.jpg")
    })

    it("uses ad image when no buyer and no defaultImage", () => {
      ;(useCtaDetails as any).mockReturnValue({
        ctaDetails: mockCtaDetailsNoBuyer,
        loading: false,
        error: null,
      })

      const { container } = render(<AdsterixWidget castHash="0x123" />)

      const hiddenImg = container.querySelector('img[style*="display: none"]')
      expect(hiddenImg).toHaveAttribute("src", mockCtaDetailsNoBuyer.image)
    })
  })

  describe("Position", () => {
    it("uses bottom-right position by default", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" showCtaButton />)

      const buttonContainer = container.querySelector('[style*="position: absolute"][style*="bottom: 12px"][style*="right: 12px"]')
      expect(buttonContainer).toBeInTheDocument()
    })

    it("applies top-left position", () => {
      const { container } = render(<AdsterixWidget castHash="0x123" showCtaButton position="top-left" />)

      const buttonContainer = container.querySelector('[style*="position: absolute"][style*="top: 12px"][style*="left: 12px"]')
      expect(buttonContainer).toBeInTheDocument()
    })
  })

  describe("Container Style", () => {
    it("applies custom container styles", () => {
      const { container } = render(
        <AdsterixWidget castHash="0x123" containerStyle={{ borderRadius: "0px", border: "2px solid red" }} />,
      )

      const widget = container.firstChild as HTMLElement
      expect(widget).toHaveStyle({ borderRadius: "0px", border: "2px solid red" })
    })
  })

  describe("Event propagation", () => {
    it("stops propagation when buy slot button is clicked", () => {
      const onAdClick = vi.fn()
      const onBuySlotClick = vi.fn()

      const { container } = render(<AdsterixWidget castHash="0x123" showBuySlotButton onAdClick={onAdClick} onBuySlotClick={onBuySlotClick} />)

      const button = container.querySelector('svg.lucide-shopping-bag')?.closest('div[style*="cursor: pointer"]')
      if (button) {
        fireEvent.click(button)
      }

      expect(onBuySlotClick).toHaveBeenCalled()
      expect(onAdClick).not.toHaveBeenCalled()
    })

    it("stops propagation when CTA button is clicked", () => {
      const onAdClick = vi.fn()
      const onCtaButtonClick = vi.fn()

      const { container } = render(<AdsterixWidget castHash="0x123" showCtaButton onAdClick={onAdClick} onCtaButtonClick={onCtaButtonClick} />)

      const buttonContainer = container.querySelector('[style*="bottom: 12px"]')
      const button = buttonContainer?.querySelector('div[style*="cursor: pointer"]')
      if (button) {
        fireEvent.click(button)
      }

      expect(onCtaButtonClick).toHaveBeenCalled()
      expect(onAdClick).not.toHaveBeenCalled()
    })

    it("stops propagation when close button is clicked", () => {
      const onAdClick = vi.fn()
      const onClose = vi.fn()

      const { container } = render(<AdsterixWidget castHash="0x123" showCloseButton onAdClick={onAdClick} onClose={onClose} />)

      const closeButton = container.querySelector('[style*="border-radius: 50%"]')
      if (closeButton) {
        fireEvent.click(closeButton)
      }

      expect(onClose).toHaveBeenCalled()
      expect(onAdClick).not.toHaveBeenCalled()
    })

    it("stops propagation when custom CTA node is clicked", () => {
      const onAdClick = vi.fn()
      const onCtaNodeClick = vi.fn()

      render(
        <AdsterixWidget
          castHash="0x123"
          ctaNodes={[<button key="custom">Custom</button>]}
          onAdClick={onAdClick}
          onCtaNodeClick={onCtaNodeClick}
        />,
      )

      fireEvent.click(screen.getByText("Custom"))

      expect(onCtaNodeClick).toHaveBeenCalled()
      expect(onAdClick).not.toHaveBeenCalled()
    })
  })
})
