import { Tab } from "@headlessui/react";
import React, { useState } from "react";
import {
  BtcIcon,
  DiamondIcon,
  EthIcon,
  PayementIcon,
  TicketIcon,
} from "./Svgs";
import TransactionsTable from "./TransactionsTable";
import Image from "next/image";
import qrCode from "@/public/images/qrcode.png";
import TokenSelectDropdown from "./TokenSelectDropdown";
import { Button } from "./Button";
import { PriceAdjuster } from "./PriceAdjuster";
import DepositSelectDropdown from "./DepositSelectDropdown";
import { usePrivy } from "@privy-io/react-auth";
import QRCode from "qrcode.react";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";

const WalletTabs = () => {
  const [network, setNetwork] = useState("eth");
  const tokenOptions = [
    { icon: <EthIcon width="20" height="20" />, price: 12.0503, label: "ETH" },
    { icon: <BtcIcon width="21" height="22" />, price: 44.0503, label: "BTC" },
  ];

  const { user } = usePrivy();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(110);
  const [txHash, setTxHash] = useState("");

  const { signer } = useWallet();

  const sendTransaction = async () => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!recipient) {
      alert("Please enter a valid recipient address.");
      return;
    }

    const isValid = ethers.utils.isAddress(recipient);
    if (!isValid) {
      alert("Please enter a valid recipient address.");
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount.toString()),
      });

      const receipt = await tx.wait();
      setTxHash(receipt.transactionHash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <Tab.Group>
      <Tab.List
        className={
          "justify-center md:justify-start px-3 md:px-0 flex flex-row gap-4 md:gap-6 lg:gap-8"
        }
      >
        <Tab className="w-full outline-none max-w-40 md:max-w-fit">
          {({ selected }) => (
            <div
              className={`transition  ease-in-out border border-[#132836] text-nowrap text-base lg:text-xl font-basement  bg-gradient-to-r from-[#2e414e] to-[#132836] font-bold rounded-[10px] inline-flex items-center duration-200 px-6 md:px-10 py-3  ${
                selected
                  ? "text-secondary border-[#132836]"
                  : "text-white hover:border-white"
              }`}
            >
              Transactions
            </div>
          )}
        </Tab>

        <Tab className={"outline-none md:ml-0 w-full max-w-40 md:max-w-fit"}>
          {({ selected }) => (
            <div
              className={`w-full justify-center transition ease-in-out border border-[#132836] text-nowrap text-base lg:text-xl font-basement bg-gradient-to-r from-[#2e414e] to-[#132836] font-bold rounded-[10px] inline-flex items-center duration-200 px-6 md:px-10 py-3   ${
                selected
                  ? "text-secondary border-[#132836]"
                  : "text-white hover:border-white"
              }`}
            >
              Wallet
            </div>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className={"bg-primary-350  rounded-[10px] pb-6"}>
          <div className="pt-6 pl-0 pr-0 mt-6 md:pl-8 md:pr-16">
            <Tab.Group>
              <Tab.List
                className={
                  "flex flex-wrap justify-center md:justify-start gap-2 md:gap-7"
                }
              >
                <Tab className={"outline-none w-full max-w-28 md:max-w-fit"}>
                  {({ selected }) => (
                    <div
                      className={`w-full px-0 justify-center md:px-8 transition  ease-in-out border border-primary-350 px4 py-2.5 text-nowrap text-base lg:text-xl font-basement bg-gradient-to-r from-[#2e414e] to-[#132836] font-bold rounded-[10px] inline-flex items-center duration-200 ${
                        selected
                          ? "text-secondary border-[#132836]"
                          : "text-white hover:border-white"
                      } `}
                    >
                      <div className="hidden md:flex items-center justify-center bg-[#265670] w-10 h-10 rounded-[80px] mr-2.5">
                        <PayementIcon />
                      </div>
                      Payments
                    </div>
                  )}
                </Tab>
                <Tab className={"outline-none w-full max-w-28 md:max-w-fit"}>
                  {({ selected }) => (
                    <div
                      className={`w-full justify-center transition px-0 md:px-8 ease-in-out border border-primary-350 px4 py-2.5 text-nowrap text-base lg:text-xl font-basement bg-gradient-to-r from-[#2e414e] to-[#132836] font-bold rounded-[10px] inline-flex items-center duration-200  ${
                        selected
                          ? "text-secondary border-[#132836]"
                          : "text-white hover:border-white"
                      }`}
                    >
                      <div className="hidden md:flex items-center justify-center bg-success/20 w-10 h-10 rounded-[80px] mr-2.5">
                        <DiamondIcon
                          width="26"
                          height="26"
                          className={"text-success"}
                        />
                      </div>
                      Diamond
                    </div>
                  )}
                </Tab>
                <Tab className={"outline-none w-full max-w-28 md:max-w-fit"}>
                  {({ selected }) => (
                    <div
                      className={`w-full justify-center transition px-0 md:px-8 ease-in-out border border-primary-350 px4 py-2.5 text-nowrap text-base lg:text-xl font-basement bg-gradient-to-r from-[#2e414e] to-[#132836] font-bold rounded-[10px] inline-flex items-center duration-200  ${
                        selected
                          ? "text-secondary border-[#132836]"
                          : "text-white hover:border-white"
                      }`}
                    >
                      <div className="hidden md:flex  items-center justify-center bg-danger/20 w-10 h-10 rounded-[80px] mr-2.5">
                        <TicketIcon
                          width="26"
                          height="26"
                          className={"text-danger-100"}
                        />
                      </div>
                      Tickets
                    </div>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel className={"px-4 md:px-0"}>
                  <div className="mt-8 mb-8 md:mt-14">
                    <h1 className="text-xl font-bold text-white font-basement">
                      Transactions
                    </h1>
                    <p className="pt-3 text-lg font-medium font-inter text-grey-550">
                      Updated every several minutes
                    </p>
                  </div>
                  <TransactionsTable />
                </Tab.Panel>
                <Tab.Panel className={"text-white px-4 md:px-0 mt-8 md:mt-14"}>
                  Content 2
                </Tab.Panel>
                <Tab.Panel className={"text-white px-4 md:px-0 mt-8 md:mt-14"}>
                  Content 3
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </Tab.Panel>
        {/* Wallet */}
        <Tab.Panel className={"bg-primary-350  rounded-[10px] pb-6"}>
          <div className="pt-6 pl-6 pr-6 mt-6 md:pl-8 md:pr-16">
            <Tab.Group>
              <Tab.List
                className={
                  "flex justify-center md:justify-start gap-2 md:gap-7 flex-row"
                }
              >
                <Tab
                  className={"outline-none peer w-full max-w-28 md:max-w-fit"}
                >
                  {({ selected }) => (
                    <div
                      className={`w-full justify-center md:justify-start transition  ease-in-out border border-primary-350 px-0 md:px-14 py-2.5 md:py-3 text-nowrap text-base lg:text-xl font-basement   font-bold rounded-[10px] inline-flex items-center duration-200  peer-checked:bg-blue-600
                       ${
                         selected
                           ? "bg-secondary/10 text-secondary "
                           : "bg-gradient-to-r from-[#2e414e] to-[#132836] text-white hover:border-white"
                       }`}
                    >
                      Deposit
                    </div>
                  )}
                </Tab>
                <Tab
                  className={"outline-none peer w-full max-w-28 md:max-w-fit"}
                >
                  {({ selected }) => (
                    <div
                      className={`w-full justify-center md:justify-start transition  ease-in-out border border-primary-350 px-0 md:px-11 py-2.5 md:py-3 text-nowrap text-base lg:text-xl font-basement font-bold rounded-[10px] inline-flex items-center duration-200  peer-checked:bg-blue-600
                       ${
                         selected
                           ? "bg-secondary/10 text-secondary "
                           : "bg-gradient-to-r from-[#2e414e] to-[#132836] text-white hover:border-white"
                       }`}
                    >
                      Withdraw
                    </div>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="mt-8 mb-8 md:mt-14">
                    <h1 className="text-lg font-bold text-white lg:text-xl font-basement">
                      Deposit USDT
                    </h1>
                  </div>
                  <div className="grid grid-cols-1 gap-12 mt-8 lg:mt-0 lg:grid-cols-2 lg:gap-20 ">
                    <div>
                      <div className="relative w-full h-[270px] lg:h-[420px] ">
                        <QRCode
                          className={"w-full h-full"}
                          value={user?.wallet?.address}
                          bgColor={"#ffffff"} // The QR Background Color
                          fgColor={"#000000"} // The Qr Color
                          level={"Q"} // Levels Can be L,M,Q,H Default is L
                          includeMargin={false}
                          renderAs={"svg"}
                          // Uncomment the Line to add Image to the QR CODE
                          // imageSettings={{
                          //   src: networks.BTC,
                          //   x: null,
                          //   y: null,
                          //   height: 40,
                          //   width: 40,
                          //   excavate: true
                          // }}
                        />
                      </div>
                      <h1 className="mt-5 text-base font-bold text-white font-basement lg:text-xl">
                        Scan QR to Deposit
                      </h1>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-white lg:text-xl font-basement ">
                        Deposit USDT
                      </h1>
                      <p className=" text-grey-600 font-inter font-normal lg:text-lg mt-4 max-w-[500px] ">
                        Send the amount of USDT of your choice to the following
                        Address to receive the equivalent in the account.
                      </p>
                      <div className="flex items-center gap-8 mt-8">
                        <p className="font-normal font-inter text-grey-600">
                          Select the Token:
                        </p>
                        <div className="w-full max-w-[206px]">
                          <TokenSelectDropdown
                            options={tokenOptions}
                            // onChange={handleTokenChange}
                            defaultOption={tokenOptions[1].label}
                          />
                        </div>
                      </div>
                      <div className="mt-8 max-w-[420px]">
                        <label className="text-sm font-medium lg:text-lg font-inter text-grey-550 ">
                          Your Personal USDT Deposit Address
                        </label>
                        <input
                          type="text"
                          readOnly={true}
                          placeholder={"0xjhsduh7ehpaefklafo8y678t78ghjkbn"}
                          value={user?.wallet?.address}
                          className={`mt-2.5 text-gray-500 z-0	bg-primary w-full px-4  py-4 rounded-[20px] border border-primary-275 focus:outline-none text-white`}
                        />
                        <Button variant={"outlined"} className={"mt-8"}>
                          Copy Address
                        </Button>
                      </div>
                      <p className="mt-8 text-base font-normal lg:text-lg text-grey-600 font-inter">
                        Send the amount of USDT of your choice to the following
                        Address to receive the equivalent in the account.
                      </p>
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="mt-8 md:mt-14">
                    <h1 className="text-lg font-bold text-white font-basement lg:text-xl">
                      Withdraw Balance
                    </h1>
                    <p className="text-grey-600 font-inter font-normal text-base lg:text-lg mt-4 max-w-[712px] ">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry Lorem Ipsum is simply dummy text of
                      the printing and typesetting industry.
                    </p>
                    <div className="flex items-center gap-8 mt-8">
                      <p className="font-normal font-inter text-grey-600">
                        Select the Token:
                      </p>
                      <div className="w-full max-w-[206px]">
                        <DepositSelectDropdown
                          options={tokenOptions}
                          // onChange={handleSelectChange}
                          defaultOption={tokenOptions[1].label}
                        />
                      </div>
                    </div>
                    <div className="mt-8 max-w-[712px]">
                      <label className="text-base font-bold text-white lg:text-xl font-basement ">
                        Receiving USDT Address
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder={"Paste your USDT Wallet Address here"}
                        className={`mt-2.5 text-gray-500 z-0	bg-primary text-white w-full pl-4 pr-[88px] py-4 rounded-[20px] border border-primary-275 focus:outline-none `}
                      />
                    </div>
                    <div className="mt-7">
                      <h1 className="text-base font-bold text-white lg:text-xl font-basement ">
                        Withdrawal Amount
                      </h1>
                      <div className=" mt-2.5">
                        <PriceAdjuster
                          value={amount}
                          currency={network}
                          onChange={(value) => setAmount(value)}
                        />
                      </div>
                    </div>
                    <Button
                      variant={"outlined"}
                      className={"mt-10 py-2 px-7"}
                      size="text-base lg:text-lg"
                      onClick={sendTransaction}
                    >
                      Request Withdrawal
                    </Button>

                    <p className="mt-9 text-grey-600 font-inter font-normal text-base lg:text-lg w-full max-w-[700px]">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry Lorem Ipsum is simply dummy text of
                      the printing and typesetting industry.
                    </p>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default WalletTabs;
