# @nektarlabs/adsterix-widget

A React component that allows you to embed Adsterix ads anywhere in your application. Adsterix is a decentralized advertising marketplace built for Farcaster on Base.

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
  return (
    <AdsterixWidget castHash="0xbf59074b94c5fd1c6b3ee1a7201708da3f60998f" />
  )
}
```

## Getting a Cast Hash

To display an ad, you need a cast hash from an Adsterix ad. Follow these steps:

1. Create an ad using the Adsterix miniapp: [https://farcaster.xyz/miniapps/nOlHtdHWXJ6H/adsterix](https://farcaster.xyz/miniapps/nOlHtdHWXJ6H/adsterix)
2. Navigate to your ad's cast on Farcaster
3. Click the three dots (⋮) in the top right corner of the cast
4. Select "Copy cast hash"
5. Use the copied hash as the `castHash` prop

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `castHash` | `string` | — | The Farcaster cast hash of the ad to display |
| `buySlotUrl` | `string` | `"https://adsterix.xyz/buy"` | URL to redirect users who want to buy an ad slot |
| `onClose` | `() => void` | — | Callback fired when the user closes the ad |

## Examples

### Basic Usage
```tsx
<AdsterixWidget castHash="0xbf59074b94c5fd1c6b3ee1a7201708da3f60998f" />
```

## License

MIT © [Nektar Labs](https://nektarlabs.com)