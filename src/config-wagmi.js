import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { mock } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet],
  // connectors: [
  //   mock({
  //     accounts: [
  //       '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  //     ],
  //   }),
  // ],
  transports: {
    [mainnet.id]: http('https://rpc.ankr.com/eth')
  },
})