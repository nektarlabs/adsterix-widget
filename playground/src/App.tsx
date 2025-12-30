import { AdsterixWidget } from "@nektarlabs/adsterix-widget"

export function App() {
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
    </div>
  )
}
