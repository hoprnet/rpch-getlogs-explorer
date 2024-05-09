import { http, createConfig } from 'wagmi'
import { mainnet, gnosis } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, gnosis],
  transports: {
    [gnosis.id]: http('https://rpc.ankr.com/gnosis'),
  },
})