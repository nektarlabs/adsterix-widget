# @nektarlabs/adsterix-widget

A React component that lets you embed Adsterix ads anywhere in your app.

Adsterix is a platform that lets creators monetize their visibility on Farcaster, built on Base (the chain for
creators). Creating an ad is as simple as posting a cast via the Adsterix miniapp: this generates an **ad-cast**, a
Farcaster cast with an embed whose image and link automatically update based on auction results. Ads are split into
time-based slots, and the winning bidder controls that slot’s call-to-action.

Brands and users simply browse an ad, bid for a slot, upload their creative (image + link), and they’re live.

If you’re a creator, a miniapp builder, or you want to monetize your product’s surface area (feeds, widgets, overlays,
dashboards, etc.), you can drop this component into your app and start earning from Adsterix ads on day one.

## Installation

```bash
npm install @nektarlabs/adsterix-widget
```

or

```bash
yarn add @nektarlabs/adsterix-widget
```

or

```bash
pnpm add @nektarlabs/adsterix-widget
```

## Usage

```tsx
import { AdsterixWidget } from "@nektarlabs/adsterix-widget"

function App() {
  return <AdsterixWidget castHash="0xbf59074b94c5fd1c6b3ee1a7201708da3f60998f" />
}
```

## Getting a Cast Hash

To display an ad, you need a cast hash of the corresponding Farcaster cast. Follow these steps:

1. Create an ad using the Adsterix miniapp:
   [https://farcaster.xyz/miniapps/nOlHtdHWXJ6H/adsterix](https://farcaster.xyz/miniapps/nOlHtdHWXJ6H/adsterix)
2. Navigate to your ad's cast on Farcaster
3. Click the three dots (⋮) in the top right corner of the cast
4. Select "Copy cast hash"
5. Use the copied hash as the `castHash` prop

## Props

| Prop                 | Type                                                                                                                                 | Default          | Description                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | -------------------------------------------------------------------------------- |
| `castHash`           | `string`                                                                                                                             | —                | The Farcaster cast hash of the ad to display                                     |
| `onClose`            | `() => void`                                                                                                                         | —                | Callback fired when the user closes the ad                                       |
| `width`              | `string \| number`                                                                                                                   | `"100%"`         | Width of the widget (px or string)                                               |
| `height`             | `string \| number`                                                                                                                   | —                | Height of the widget (px or string). If not provided, maintains 3:2 aspect ratio |
| `showAdSparkleLabel` | `boolean`                                                                                                                            | —                | Whether to show the "Ad ✨" label overlay                                        |
| `showCloseButton`    | `boolean`                                                                                                                            | —                | Whether to show the close button                                                 |
| `showBuySlotButton`  | `boolean`                                                                                                                            | —                | Whether to show the "Buy Slot" button                                            |
| `showCtaButton`      | `boolean`                                                                                                                            | —                | Whether to show the CTA (call-to-action) button                                  |
| `showCtaButtonIcon`  | `boolean`                                                                                                                            | —                | Whether to show the external link icon on the CTA button                         |
| `ctaButtonText`      | `string`                                                                                                                             | —                | Custom text for the CTA button                                                   |
| `onBuySlotClick`     | `(buySlotUrl: string) => void`                                                                                                       | —                | Callback fired when the "Buy Slot" button is clicked, receives the buy slot URL  |
| `onAdClick`          | `(url: string) => void`                                                                                                              | —                | Callback fired when the CTA button is clicked, receives the ad's target URL      |
| `position`           | `"bottom-left" \| "bottom-right" \| "top-left" \| "top-right" \| "bottom-center" \| "top-center" \| "center-left" \| "center-right"` | `"bottom-right"` | Position of the CTA buttons container                                            |
| `containerStyle`     | `React.CSSProperties`                                                                                                                | —                | Custom styles for the CTA buttons container                                      |
| `buySlotButtonStyle` | `React.CSSProperties`                                                                                                                | —                | Custom styles for the "Buy Slot" button                                          |
| `ctaButtonStyle`     | `React.CSSProperties`                                                                                                                | —                | Custom styles for the CTA button                                                 |

## Example

<p align="center">
  <img src="./resources/miniapp.png" alt="Miniapp" width="300"/>
</p>

## License

MIT © [Nektar Labs](https://nektarlabs.com)
