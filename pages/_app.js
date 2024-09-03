import { useEffect, useMemo, useState } from "react";
import "../styles/globals.css";
import { ConnectionProvider, WalletProvider,useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider,WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { GlobalState } from "../state/global";

// Import necessary styles
import "@solana/wallet-adapter-react-ui/styles.css";
import { RPC_ENDPOINT } from "../utils";

function MyApp({ Component, pageProps }) {
  // Use useState to track if the component is mounted
  const [mounted, setMounted] = useState(false);

  // Use useMemo to instantiate the wallet adapters only once
  const wallets = useWallet();

  // Set mounted to true after the component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
    <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
            {/* <WalletMultiButton /> */}
            <div>
            hi there
            {mounted && (
            <GlobalState>
              <Component {...pageProps} />
            </GlobalState>
          )}
        </div>
        </WalletModalProvider>
    </WalletProvider>
</ConnectionProvider>
  );
}

export default MyApp;
