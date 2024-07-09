import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { bsc, bscTestnet } from "viem/chains";
import { getWalletBalance, getNativeWalletBalance } from "@/lib/utils";

const WalletContext = createContext(null);

const WalletProvider = ({ children }) => {
  const { wallets } = useWallets();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokens, setTokens] = useState([
    {
      symbol: "USDT",
      contractAddress: process.env.NEXT_PUBLIC_USDT_ADDRESS,
    },
  ]);
  const [walletAddress, setWalletAddress] = useState([]);
  const [walletBalances, setWalletBalances] = useState([]);
  const [platformAddress, setPlatformAddress] = useState(null);

  useEffect(() => {
    const getProvider = async () => {
      const wallet = wallets[0];
      if (!wallet) return;
      setWalletAddress(wallet.address);
      await wallet.switchChain(
        process.env.NEXT_PUBLIC_CHAIN === "bsc" ? bsc.id : bscTestnet.id
      );
      const provider = await wallet.getEthersProvider();
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
    };

    getProvider();
  }, [wallets]);

  useEffect(() => {
    async function fetchBSCUSDBalance(walletAddress, provider) {
      const tokenAddress = process.env.NEXT_PUBLIC_USDT_ADDRESS;
      const balance = await getWalletBalance({
        provider,
        walletAddress,
        tokenAddress,
      });
      return balance;
    }
    async function fetchNativeBalance(walletAddress, provider) {
      const balance = await getNativeWalletBalance({
        provider,
        walletAddress,
      });
      return balance;
    }
    if (provider) {
      fetchNativeBalance(walletAddress, provider).then((balance) => {
        const balanceDetails = {
          balance,
          symbol: "BNB",
          imageUrl:
            "https://playbrainz-data.s3.amazonaws.com/token-logos/bnb.png",
        };
        setWalletBalances((prev) => {
          const newBalances = [...prev];
          const bnbIndex = prev.findIndex((item) => item.symbol === "BNB");
          if (bnbIndex !== -1) {
            newBalances[bnbIndex] = balanceDetails;
          } else {
            newBalances.push(balanceDetails);
          }
          return newBalances;
        });
      });
      fetchBSCUSDBalance(walletAddress, provider).then((balance) => {
        const balanceDetails = {
          balance,
          symbol: "USDT",
          imageUrl:
            "https://playbrainz-data.s3.amazonaws.com/token-logos/usdt.png",
        };
        setWalletBalances((prev) => {
          const newBalances = [...prev];
          const usdtIndex = prev.findIndex((item) => item.symbol === "USDT");
          if (usdtIndex !== -1) {
            newBalances[usdtIndex] = balanceDetails;
          } else {
            newBalances.push(balanceDetails);
          }
          return newBalances;
        });
      });
    }
  }, [provider, walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        walletAddress,
        tokens,
        setTokens,
        walletBalances,
        setWalletBalances,
        platformAddress,
        setPlatformAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

export const useWallet = () => {
  return useContext(WalletContext);
};
