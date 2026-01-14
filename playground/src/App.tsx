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
    </div>
  )
}
