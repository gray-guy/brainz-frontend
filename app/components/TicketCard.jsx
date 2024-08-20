import React from "react";
import { Button } from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  BtcIcon,
  DiamondIcon,
  EthIcon,
  ModalCrossIcon,
  TickIcon,
  TicketIcon,
  UsdtIcon,
} from "./Svgs";
import { useWallet } from "../contexts/WalletContext";
import { ethers } from "ethers";
import TokenSelectDropdown from "./TokenSelectDropdown";
import {
  apiCall,
  getOtherTokenAmountForExactUSDT,
  getTokenDecimals,
  getWalletBalance,
  getNativeWalletBalance,
  uniswapAbi,
} from "@/lib/utils";
import { erc20Abi } from "viem";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUser } from "../contexts/UserContext";

const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS;

export const TicketCard = ({ ticketAmount, diamondAmount, price, id }) => {
  const {
    walletBalances,
    walletAddress,
    provider,
    signer,
    tokens,
    sendTransaction,
    isPrivyWallet,
    platformAddress,
    setWalletBalances,
  } = useWallet();
  const { setUser } = useUser();
  let [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("USDT");
  const [priceInOtherToken, setPriceInOtherToken] = useState(0);
  const [txPending, setTxPending] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [txHash, setTxHash] = useState("");

  const closeModal = () => {
    setIsOpen(false);
    setPurchased(false);
  };

  const updateWalletBalances = async () => {
    tokens.forEach(async (token) => {
      let balance;
      if (token.isNative) {
        balance = await getNativeWalletBalance({
          provider,
          walletAddress,
        });
      } else {
        balance = await getWalletBalance({
          provider,
          walletAddress,
          tokenAddress: token.contractAddress,
        });
      }
      const balanceDetails = {
        balance,
        symbol: token.symbol,
        imageUrl: token.imageUrl,
      };
      setWalletBalances((prev) => ({
        ...prev,
        [token.symbol.toUpperCase()]: balanceDetails,
      }));
    });
  };

  const updateUserDetails = async () => {
    const userData = await apiCall("get", "/profile");
    if (userData) {
      setUser(userData.profile);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const handlePurchase = async () => {
    await sendTransactionInternal();
  };

  const handleTokenChange = async (value) => {
    setSelectedOption(value.symbol);
    if (value.symbol === "USDT") {
      setPriceInOtherToken(0);
      return;
    }
    const tokenAddress = tokens.find(
      (token) => token.symbol === value.symbol
    )?.contractAddress;
    console.log("tokenAddress===>", tokenAddress);
    let priceInOtherToken = await getOtherTokenAmountForExactUSDT(
      price,
      5, //5% slippage
      tokenAddress,
      signer
    );
    console.log("priceInOtherToken===>",priceInOtherToken)
    // limit 5 decimal places if there are more
    if (priceInOtherToken.includes(".")) {
      const parts = priceInOtherToken.split(".");
      if (parts[1].length > 5) {
        priceInOtherToken = `${parts[0]}.${parts[1].slice(0, 5)}`;
      }
    }
    setPriceInOtherToken(priceInOtherToken);
  };

  const sendTransactionInternal = async () => {
    if (!signer) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (selectedOption === "USDT") {
      await depositToken(price);
    } else {
      await convertOtherTokenToUSDTAndTransferToPlatformAddress(price, 5); //Slippage at 5%
    }
  };

  async function depositToken(amount) {
    try {
      if (!USDT_ADDRESS) {
        throw new Error(
          "USDT_ADDRESS is not defined in the environment variables"
        );
      }
      setTxPending(true);
      const usdtTokenContract = new ethers.Contract(
        USDT_ADDRESS,
        erc20Abi,
        signer
      );
      const decimals = await usdtTokenContract.decimals();
      // TODO: check allowance
      const depositData = usdtTokenContract.interface.encodeFunctionData(
        "transfer",
        [platformAddress, ethers.utils.parseUnits(amount.toString(), decimals)]
      );

      const depositTx = await sendTransaction({
        to: USDT_ADDRESS,
        data: depositData,
      });

      const depositResultData = {
        packID: id,
        senderWalletAddress: walletAddress, // user's wallet address
        targetWalletAddress: platformAddress,
        txnHash: depositTx.hash ?? depositTx.transactionHash,
        swapToken: USDT_ADDRESS,
        amountIn: amount.toString(),
        amountOut: amount.toString(),
      };

      console.log("depositResultData===>",depositResultData)
      // // POST API CREATE TRANSACTION (/transaction) WITH ABOVE DATA
      const data = await apiCall("post", "/transaction", depositResultData);

      if (depositTx.wait) {
        const depositReceipt = await depositTx.wait();
        // Check if the transaction was successful
        if (depositReceipt.status !== 1) {
          toast.error("Transaction failed. Please try again.");
          return;
        }
      }

      toast.success("Deposit successful!");
      setPurchased(true);
      setTxHash(depositTx.hash ?? depositTx.transactionHash);
      setTimeout(() => {
        updateWalletBalances();
        updateUserDetails();
      }, 5000);
    } catch (err) {
      console.error(err);
      let message = "Please try again.";
      if (err.message.includes("cannot estimate gas")) {
        message = "Cannot estimate gas, make sure you have bnb and selected token";
      } else if (err.reason) {
        message = err.reason;
      }
      toast.error(`Transaction failed. ${message}`);
    } finally {
      setTxPending(false);
    }
  }

  async function convertOtherTokenToUSDTAndTransferToPlatformAddress(
    USDTRequired,
    slippageTolerance
  ) {
    const otherToken = tokens.find((token) => token.symbol === selectedOption);
    let tokenAddress = otherToken?.contractAddress;
    const isBNBToken = otherToken?.symbol === "BNB";

    if (!tokenAddress) {
      toast.error("No token address found");
      return;
    }
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

    // Get decimals for USDT and OtherToken
    const usdtDecimals = await getTokenDecimals(USDT_ADDRESS, signer);
    const otherTokenDecimals = await getTokenDecimals(tokenAddress, signer);

    // Calculate the exact amount of USDT required
    const amountOutExactUSDT = ethers.utils.parseUnits(
      USDTRequired.toString(),
      usdtDecimals
    );

    console.log("amountOutExactUSDT===>", ethers.utils.formatUnits(amountOutExactUSDT, usdtDecimals));

    const routerContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ROUTER_V2_ADDRESS,
      uniswapAbi,
      signer
    );

    // Get the amount of OtherToken needed for the exact amount of USDT required
    const amountsIn = await routerContract.getAmountsIn(amountOutExactUSDT, [
      tokenAddress,
      USDT_ADDRESS,
    ]);

    const amountInOtherToken = amountsIn[0];

    console.log("amountInOtherToken===>", ethers.utils.formatUnits(amountInOtherToken, otherTokenDecimals));

    const slippage = 1 + slippageTolerance / 100;
    const amountInMaxWithSlippage = amountInOtherToken
      .mul(ethers.BigNumber.from(Math.floor(slippage * 100)))
      .div(ethers.BigNumber.from(100));

    console.log("amountInMaxWithSlippage===>", ethers.utils.formatUnits(amountInMaxWithSlippage, otherTokenDecimals));

    const otherTokenAllowance = await checkAllowance(tokenAddress);

    if (!isBNBToken && otherTokenAllowance.lt(amountInMaxWithSlippage)) {
      try {
        setTxPending(true);
        const approveData = tokenContract.interface.encodeFunctionData(
          "approve",
          [process.env.NEXT_PUBLIC_ROUTER_V2_ADDRESS, amountInOtherToken]
        );
        const approveTx = await sendTransaction({
          to: tokenAddress,
          data: approveData,
        });

        if (approveTx.wait) {
          const approveReceipt = await approveTx.wait();

          // Check if the transaction was successful
          if (approveReceipt.status !== 1) {
            toast.error("Approve transaction failed!");
            return;
          }
        }
      } catch (err) {
        toast.error("Approve failed!");
        return;
      } finally {
        setTxPending(false);
      }
    } else {
      console.log("ALLOWANCE MATCHED, CONTINUE");
    }

    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      setTxPending(true);
      
      let swapTx;
      // const platformAddress = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS;
      if (isBNBToken) {
        console.log("SWAP TRANSACTION WITH BNB");
        const swapData = routerContract.interface.encodeFunctionData(
          "swapETHForExactTokens",
          [
            amountOutExactUSDT,
            [tokenAddress, USDT_ADDRESS],
            platformAddress,
            deadline,
          ]
        );
        swapTx = await sendTransaction({
          to: process.env.NEXT_PUBLIC_ROUTER_V2_ADDRESS,
          data: swapData,
          value: isPrivyWallet
            ? amountInMaxWithSlippage.toBigInt()
            : amountInMaxWithSlippage,
          gasLimit: 1000000,
        });
      } else {
        console.log("SWAP TRANSACTION WITH OTHER TOKEN");
        const swapData = routerContract.interface.encodeFunctionData(
          "swapTokensForExactTokens",
          [
            amountOutExactUSDT,
            amountInMaxWithSlippage,
            [tokenAddress, USDT_ADDRESS],
            platformAddress,
            deadline,
          ]
        );
        swapTx = await sendTransaction({
          to: process.env.NEXT_PUBLIC_ROUTER_V2_ADDRESS,
          data: swapData,
          gasLimit: 1000000,
        });
      }

      const swapResultData = {
        packID: id,
        senderWalletAddress: walletAddress, // user's wallet address
        targetWalletAddress: platformAddress,
        txnHash: swapTx.hash ?? swapTx.transactionHash,
        swapToken: tokenAddress,
        amountIn: ethers.utils.formatUnits(
          amountInOtherToken,
          otherTokenDecimals
        ),
        amountOut: ethers.utils.formatUnits(amountOutExactUSDT, usdtDecimals),
      };

      console.log("swapResultData===>",swapResultData)

      const data = await apiCall("post", "/transaction", swapResultData);

      if (swapTx.wait) {
        const swapReceipt = await swapTx.wait();
        // Check if the transaction was successful
        if (swapReceipt.status !== 1) {
          toast.error("Transaction failed. Please try again.");
          return;
        }
      }

      toast.success("Swap successful!");
      setPurchased(true);
      setTxHash(swapTx.hash ?? swapTx.transactionHash);
      setTimeout(() => {
        updateWalletBalances();
        updateUserDetails();
      }, 5000);
    } catch (err) {
      console.error(err);
      let message = "Please try again.";
      if (err.message.includes("cannot estimate gas")) {
        message = "Can't estimate gas for some reason";
      } else if (err.reason) {
        message = err.reason;
      }
      toast.error(`Transaction failed. ${message}`);
    } finally {
      setTxPending(false);
    }
  }

  async function checkAllowance(token) {
    const tokenContract = new ethers.Contract(token, erc20Abi, signer);

    const allowance = await tokenContract.allowance(
      walletAddress, // user's wallet address
      process.env.NEXT_PUBLIC_ROUTER_V2_ADDRESS
    );

    return allowance;
  }

  return (
    <div className="bg-primary-350 rounded-[20px] border border-primary-275 py-5 px-[18px] text-center w-full">
      <div className="flex items-center justify-center gap-5">
        {ticketAmount > 0 && (
          <div className="flex items-center justify-center gap-[10px]">
            <h1 className="text-xl lg:text-3xl font-basement font-bold">
              {ticketAmount}
            </h1>
            <TicketIcon className={"text-danger-100"} />
          </div>
        )}
        {diamondAmount > 0 && (
          <div className="flex items-center justify-center gap-[10px]">
            <h1 className="text-xl lg:text-3xl font-basement font-bold">
              {diamondAmount}
            </h1>
            <DiamondIcon className={"text-success"} />
          </div>
        )}
      </div>
      <p className="my-2 font-basement font-normal text-grey-400 text-sm">
        For
      </p>
      <h2 className="mt-2.5 font-basement text-base font-bold lg:text-lg">
        {price} USDT
      </h2>
      <div className="mt-[8px] flex gap-2">
        <Button
          variant={"outlined"}
          size="text-sm lg:text-base"
          className={"py-1 sm:px-5 md:px-6 lg:px-10"}
          onClick={openModal}
        >
          Buy now
        </Button>
        <form
          action={`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`}
          method="POST"
        >
          <input type="hidden" name="packId" value={id} />
          <input type="hidden" name="userId" value={user?.id} />
          <button type="submit">S</button>
        </form>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[724px] text-center text-white transform overflow-hidden rounded-[20px] bg-primary-275 py-6 px-6 md:px-12  align-middle shadow-xl transition-all">
                  <div>
                    <h1 className="text-[26px] md:text-4xl font-basement font-bold">
                      Buy
                    </h1>
                    <div className="flex justify-center">
                      <h2 className="text-lg md:text-2xl font-basement font-bold mt-10 max-w-[458px]">
                        You are purchasing{" "}
                        {ticketAmount > 0 && (
                          <span>{ticketAmount} tickets </span>
                        )}
                        {diamondAmount > 0 && (
                          <span> {diamondAmount} diamonds </span>
                        )}
                        for {priceInOtherToken > 0 ? priceInOtherToken : price}{" "}
                        {selectedOption}.
                      </h2>
                    </div>
                    <div className="flex justify-center mt-8">
                      <p className="text-sm e md:text-lg font-basement font-normal max-w-[458px] ">
                        Select USDT or Equivalent Token to purchase the bundles
                      </p>
                    </div>
                    <div className="flex flex-col gap-4  max-w-xs mx-auto text-left mt-5">
                      <div className="flex flex-col gap-3 w-full">
                        <TokenSelectDropdown
                          options={tokens}
                          onChange={handleTokenChange}
                          selected={"USDT"}
                          className={"max-h-44 "}
                        />

                        <p className="text-right text-sm">
                          Balance:{" "}
                          {
                            Object.values(walletBalances).find(
                              (balance) => balance.symbol === selectedOption
                            )?.balance
                          }{" "}{selectedOption}
                        </p>
                      </div>
                      <div className="flex justify-between gap-3">
                        <h1 className="font-bold font-basement text-xl">
                          You pay
                        </h1>
                        <h1 className="font-bold font-basement text-xl">
                          {priceInOtherToken > 0 ? priceInOtherToken : price}{" "}{selectedOption}
                        </h1>
                      </div>
                    </div>
                    <div className="mt-[48px] flex justify-center gap-[34px] ">
                      {purchased ? (
                        <Link
                          href={`https://bscscan.com/tx/${txHash}`}
                          className=" gap-4 outline-none	text-nowrap font-basement  bg-transparent  border-secondary border-2 text-white font-bold py-2 rounded-full inline-flex items-center duration-200 hover:bg-secondary hover:text-dark px-10 "
                        >
                          <TickIcon className={"text-success "} />
                          <p className="text-lg font-basement font-bold">
                            Purchase successful
                          </p>
                        </Link>
                      ) : txPending ? (
                        <Button
                          variant={"outlined"}
                          disabled
                          className={
                            "flex items-center gap-4 hover:bg-opacity-0 hover:text-white"
                          }
                        >
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              class="w-6 h-6 text-[#ddd] animate-spin  fill-primary-100"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span class="sr-only">Loading...</span>
                          </div>
                          Transaction processing...
                        </Button>
                      ) : (
                        <>
                          <Button variant={"outlined"} onClick={handlePurchase}>
                            Purchase
                          </Button>
                          <button
                            className="text-nowrap font-basement font-bold bg-transparent border border-white border-2 text-white font-bold py-2 rounded-full inline-flex items-center duration-200 hover:bg-white hover:text-dark px-[41px] py-[4px]"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="absolute top-[38px] right-[50px] "
                  >
                    <ModalCrossIcon
                      className={
                        "text-white hover:text-secondary cursor-pointer"
                      }
                    />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
