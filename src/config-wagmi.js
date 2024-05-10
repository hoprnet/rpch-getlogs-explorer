import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { mock } from 'wagmi/connectors'

// import SDK from "@rpch/sdk";
// import { Chain, PublicClient, Transport, createClient, custom, publicActions } from "viem";

// const CLIENT_SECRET = '9979a6246bf718649e9c22e72bf0412f1656c74d0d1ae953';
// const sdk = new SDK(CLIENT_SECRET);

// function publicRPChClient() {
//   return createClient({
//     chain: mainnet,
//     transport: custom({
//         async request({ method, params }) {
//             try {
//                 const response = await sdk.send({ method, params, jsonrpc: "2.0" });
//                 const responseJson = await response.json();

//                 return "error" in responseJson
//                     ? responseJson.error
//                     : responseJson.result;
//             } catch (e) {
//                 console.log(e);
//             }
//         },
//     }, {
//         retryCount: 3,
//         retryDelay: 3_000,
//     }),
//   }).extend(publicActions);
// }

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      ],
    }),
  ],
  transports: {
    [mainnet.id]: http('https://rpc.ankr.com/eth')
  },
 // publicClient: publicRPChClient(),
})