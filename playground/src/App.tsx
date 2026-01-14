import { AdsterixWidget, useCtaDetails } from "@nektarlabs/adsterix-widget"

export function App() {
  const { ctaDetails, loading, error } = useCtaDetails({ castHash: "0xbf59074b94c5fd1c6b3ee1a7201708da3f60998f" })
  console.log({ ctaDetails, loading, error })

  return (
    <div style={{ padding: 24 }}>
      <h1>Playground</h1>
      <AdsterixWidget
        castHash="0xbf59074b94c5fd1c6b3ee1a7201708da3f60998f"
        width={300}
        height={90}
        showCtaButton
        ctaButtonText="Open"
        position="center-right"
        onAdClick={() => console.log("onAdClick")}
        containerStyle={{
          borderRadius: 0,
        }}
        ctaButtonStyle={{
          borderRadius: 0,
          background: "orange",
          color: "#ffffff",
        }}
      />

      <h2 style={{ marginTop: 32 }}>With Custom CTA Nodes</h2>
      <AdsterixWidget
        castHash="0xbf59074b94c5fd1c6b3ee1a7201708da3f60998f"
        width={400}
        height={120}
        position="center-right"
        ctaNodes={[
          <button
            key="cta"
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: "orange",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Learn More
          </button>,
          <button
            key="info"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "rgba(128, 128, 128, 0.3)",
              color: "#6b7280",
              cursor: "pointer",
            }}
            title="Info"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>,
        ]}
        onCtaNodeClick={(index, e, details) => {
          console.log("CTA node clicked:", { index, event: e, ctaDetails: details })
        }}
      />

      <h2 style={{ marginTop: 32 }}>With Default Image (No Buyer)</h2>
      <AdsterixWidget
        castHash="0xbf59074b94c5fd1c6b3ee1a7201708da3f60998f"
        width={500}
        height={100}
        defaultImage="https://i.kym-cdn.com/entries/icons/original/000/028/021/work.jpg"
        position="center-right"
        containerStyle={{
          borderRadius: 12,
          border: "3px solid #f97316",
        }}
        ctaNodes={[
          <button
            key="buy"
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              background: "#f97316",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Buy Slot
          </button>,
          <button
            key="info"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "#9ca3af",
              color: "#fff",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
            }}
            title="Info"
          >
            i
          </button>,
        ]}
        onCtaNodeClick={(index, _e, details) => {
          if (index === 0) {
            // Buy Slot clicked
            if (details?.buySlotUrl) {
              window.open(details.buySlotUrl, "_blank", "noopener,noreferrer")
            }
            console.log("Buy slot clicked:", details?.buySlotUrl)
          } else if (index === 1) {
            // Info clicked
            console.log("Info clicked:", details)
          }
        }}
      />
    </div>
  )
}
