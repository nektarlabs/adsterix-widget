import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Sparkles, ShoppingBag, X } from "lucide-react"
import useCtaDetails, { CtaDetails } from "./hooks/useCtaDetails"

type CtaPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "top-center"
  | "center-left"
  | "center-right"

export interface AdsterixWidgetProps {
  /** The Farcaster cast hash to fetch ad details for (required) */
  castHash: string
  /** Callback fired when the widget is closed via the close button */
  onClose?: () => void
  /** Width of the widget container (number = px, string = any CSS value). Default: "100%" */
  width?: string | number
  /** Height of the widget container (number = px, string = any CSS value). If omitted, uses 3:2 aspect ratio */
  height?: string | number
  /** Show a small "Ad" label with sparkle icon in the top-left corner */
  showAdSparkleLabel?: boolean
  /** Show a close button in the top-right corner */
  showCloseButton?: boolean
  /** Show the "Buy Slot" button (allows users to purchase the ad slot) */
  showBuySlotButton?: boolean
  /** Show the default CTA button */
  showCtaButton?: boolean
  /** Show an external link icon inside the CTA button */
  showCtaButtonIcon?: boolean
  /** Text label for the CTA button. Default: "Learn More" */
  ctaButtonText?: string
  /** If provided, these nodes will be rendered instead of the default CTA / Buy Slot buttons */
  ctaNodes?: React.ReactNode[]
  /** Called when a custom CTA node is clicked: (index, event, ctaDetails) */
  onCtaNodeClick?: (index: number, e: React.MouseEvent, ctaDetails: CtaDetails | null) => void
  /** Callback fired when the "Buy Slot" button is clicked, receives the buySlotUrl */
  onBuySlotClick?: (buySlotUrl: string) => void
  /** Callback fired when the ad (or CTA button) is clicked, receives the destination url */
  onAdClick?: (url: string) => void
  /** Position of the CTA buttons within the widget. Default: "bottom-right" */
  position?: CtaPosition
  /** Custom styles to merge into the widget container */
  containerStyle?: React.CSSProperties
  /** Custom styles to merge into the "Buy Slot" button */
  buySlotButtonStyle?: React.CSSProperties
  /** Custom styles to merge into the CTA button */
  ctaButtonStyle?: React.CSSProperties
}

interface CtaButtonProps {
  label: string
  icon: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  showLabel: boolean
  style?: React.CSSProperties
}

const getPositionStyles = (position: CtaPosition): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    gap: 8,
  }

  const positionMap: Record<CtaPosition, React.CSSProperties> = {
    "bottom-right": { bottom: 12, right: 12 },
    "bottom-left": { bottom: 12, left: 12 },
    "top-right": { top: 12, right: 12 },
    "top-left": { top: 12, left: 12 },
    "bottom-center": { bottom: 12, left: "50%", transform: "translateX(-50%)" },
    "top-center": { top: 12, left: "50%", transform: "translateX(-50%)" },
    "center-left": { top: "50%", left: 12, transform: "translateY(-50%)" },
    "center-right": { top: "50%", right: 12, transform: "translateY(-50%)" },
  }

  return { ...baseStyles, ...positionMap[position] }
}

const CtaButton: React.FC<CtaButtonProps> = ({ label, icon, onClick, showLabel, style = {} }) => {
  const defaultStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: showLabel ? 6 : 0,
    padding: showLabel ? "8px 14px" : "8px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    color: "#0f172a",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    cursor: "pointer",
  }

  const mergedStyle = { ...defaultStyle, ...style }

  return (
    <div onClick={onClick} style={mergedStyle}>
      {showLabel && label}
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
    </div>
  )
}

export const AdsterixWidget: React.FC<AdsterixWidgetProps> = ({
  castHash,
  onClose,
  width = "100%",
  position = "bottom-right",
  height,
  showAdSparkleLabel = false,
  showCloseButton = false,
  showBuySlotButton = false,
  showCtaButton = false,
  showCtaButtonIcon = false,
  ctaButtonText = "Learn More",
  ctaButtonStyle,
  buySlotButtonStyle,
  onBuySlotClick,
  onAdClick,
  onCtaNodeClick,
  containerStyle: _containerStyle,
  ctaNodes,
}) => {
  const { ctaDetails, loading, error } = useCtaDetails({ castHash })
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [visible, setVisible] = React.useState(true)
  const [isSmall, setIsSmall] = React.useState(true) // Start with true to avoid flash
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!containerRef.current) return

    const checkSize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        setIsSmall(width < 270)
      }
    }

    const resizeObserver = new ResizeObserver(checkSize)
    resizeObserver.observe(containerRef.current)

    // Initial check
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      setIsSmall(width < 400)
    }

    return () => resizeObserver.disconnect()
  }, [loading, ctaDetails]) // Re-run when content changes

  const handleAdClick = () => {
    if (ctaDetails?.url) {
      window.open(ctaDetails.url, "_blank", "noopener,noreferrer")
      onAdClick?.(ctaDetails.url)
    }
  }

  const handleBuySlotClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (ctaDetails?.buySlotUrl) {
      window.open(ctaDetails.buySlotUrl, "_blank", "noopener,noreferrer")
      onBuySlotClick?.(ctaDetails?.buySlotUrl)
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setVisible(false)
    onClose?.()
  }

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: typeof width === "number" ? `${width}px` : width,
    ...(height ? { height: typeof height === "number" ? `${height}px` : height } : { aspectRatio: "3 / 2" }),
    borderRadius: 12,
    overflow: "hidden",
    ..._containerStyle,
  }

  if (!visible) return null

  if (error) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f87171",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Unable to load ad
      </div>
    )
  }

  if (loading || !ctaDetails) {
    return (
      <div
        ref={containerRef}
        style={{
          ...containerStyle,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        ...containerStyle,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <AnimatePresence>
        {imageLoaded && (
          <motion.img
            src={ctaDetails.image}
            alt="Advertisement"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </AnimatePresence>

      <img src={ctaDetails.image} alt="" onLoad={() => setImageLoaded(true)} style={{ display: "none" }} />

      {/* Close button */}
      {showCloseButton && (
        <motion.div
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
          }}
          whileHover={{
            background: "rgba(0,0,0,0.7)",
            color: "rgba(255,255,255,1)",
            scale: 1.1,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <X size={14} strokeWidth={2.5} />
        </motion.div>
      )}

      <div style={getPositionStyles(position)}>
        {ctaNodes && ctaNodes.length > 0 ? (
          // Render custom nodes provided by the consumer. Each node is wrapped to
          // keep spacing consistent with the default layout and to avoid
          // accidental propagation of clicks to the ad container.
          ctaNodes.map((node, idx) => (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center" }}
              onClick={(e) => {
                e.stopPropagation()
                onCtaNodeClick?.(idx, e, ctaDetails)
              }}
            >
              {node}
            </div>
          ))
        ) : (
          <>
            {showBuySlotButton && (
              <CtaButton
                label="Buy Slot"
                icon={<ShoppingBag size={14} strokeWidth={2.5} />}
                onClick={handleBuySlotClick}
                showLabel={!isSmall}
                style={buySlotButtonStyle}
              />
            )}
            {showCtaButton && (
              <CtaButton
                label={ctaButtonText}
                icon={showCtaButtonIcon && <ExternalLink size={14} strokeWidth={2.5} />}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAdClick()
                }}
                showLabel={!isSmall}
                style={ctaButtonStyle}
              />
            )}
          </>
        )}
      </div>

      {showAdSparkleLabel && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 8px",
            borderRadius: 6,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.8)",
            fontSize: 10,
            fontWeight: 500,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          <Sparkles size={10} />
          Ad
        </div>
      )}
    </div>
  )
}
