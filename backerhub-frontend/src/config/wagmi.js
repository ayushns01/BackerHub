import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "BackerHub",
  projectId: "e97fe091402695bfd867eb49f36337ef", // Replace with your WalletConnect project ID
  chains: [sepolia, mainnet],
  ssr: false,
});