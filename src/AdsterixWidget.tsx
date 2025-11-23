import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Sparkles, ShoppingBag, X } from "lucide-react"

export interface AdsterixWidgetProps {
  castHash?: string
  onClose?: () => void
}

interface CtaDetails {
  image: string
  url: string
  buySlotUrl: string
}

const CtaButton: React.FC<{
  label: string
  icon: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  showLabel: boolean
}> = ({ label, icon, onClick, showLabel }) => (
  <motion.div
    onClick={onClick}
    style={{
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
    }}
    whileHover={{
      y: -2,
      background: "rgba(255,255,255,0.98)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
  >
    {showLabel && label}
    <motion.span
      style={{ display: "flex", alignItems: "center" }}
      whileHover={{ x: showLabel ? 2 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {icon}
    </motion.span>
  </motion.div>
)

export const AdsterixWidget: React.FC<AdsterixWidgetProps> = ({ castHash, onClose }) => {
  const [ctaDetails, setCtaDetails] = React.useState<CtaDetails | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [visible, setVisible] = React.useState(true)
  const [isSmall, setIsSmall] = React.useState(true) // Start with true to avoid flash
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!castHash) return

    const fetchCtaDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://www.adsterix.xyz/api/ads/cta-details/${castHash}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        setCtaDetails(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchCtaDetails()
  }, [castHash])

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
    }
  }

  const handleBuySlotClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (ctaDetails?.buySlotUrl) window.open(ctaDetails.buySlotUrl, "_blank", "noopener,noreferrer")
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setVisible(false)
    onClose?.()
  }

  if (!visible) return null

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          borderRadius: 12,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f87171",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Unable to load ad
      </motion.div>
    )
  }

  if (loading || !ctaDetails) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 2",
          borderRadius: 12,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      onClick={handleAdClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3 / 2",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
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

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
        }}
        whileHover={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Close button */}
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

      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          display: "flex",
          gap: 8,
        }}
      >
        <CtaButton
          label="Buy Slot"
          icon={<ShoppingBag size={14} strokeWidth={2.5} />}
          onClick={handleBuySlotClick}
          showLabel={!isSmall}
        />
        <CtaButton
          label="Learn More"
          icon={<ExternalLink size={14} strokeWidth={2.5} />}
          onClick={(e) => {
            e.stopPropagation()
            handleAdClick()
          }}
          showLabel={!isSmall}
        />
      </div>

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
    </motion.div>
  )
}
