"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { MY_TOKEN, myToken } from "@/context/ContractData";
import { parseEther } from "viem";
// import { Button } from '@/components/ui/button'

const USD_PRICE = 0.25;

export default function page() {
  const { address, isConnected } = useAccount();

  const { data: ethUsdRaw } = useReadContract({
    address: MY_TOKEN,
    abi: myToken,
    functionName: "getLatestPrice",
  });

  const { writeContract, isPending, data: txHash, error } = useWriteContract();

  const [requiredEth, setRequiredEth] = useState<string>("0");

  // Convert price once we get price feed data
  useEffect(() => {
    if (!ethUsdRaw) return;

    console.log("Raw price from Chainlink:", ethUsdRaw);

    const ethUsd = Number(ethUsdRaw) / 1e8;
    console.log("ETH price in USD:", ethUsd);

    const weiAmount = (USD_PRICE / ethUsd) * 1e18;
    console.log("Required ETH in wei:", weiAmount);

    setRequiredEth(weiAmount.toString());
  }, [ethUsdRaw]);

  //   function handleMint() {
  //     writeContract({
  //       address: MY_TOKEN,
  //       abi: myToken,
  //       functionName: 'mint',
  //       value: BigInt(requiredEth),
  //     })
  //   }

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Mint Your NFT</h1>

      {ethUsdRaw ? (
        <p className="mb-2 text-sm">
          Current ETH/USD: ${(Number(ethUsdRaw) / 1e8).toFixed(2)}
        </p>
      ) : (
        <p>Loading price...</p>
      )}

      <p className="mb-4">
        Mint Price:{" "}
        {requiredEth ? `${(Number(requiredEth) / 1e18).toFixed(6)} ETH` : "..."}
      </p>

      {/* <Button
        onClick={handleMint}
        disabled={!isConnected || !requiredEth || isPending}
      >
        {isPending ? 'Minting...' : 'Mint NFT'}
      </Button> */}

      {txHash && (
        <p className="mt-4 text-green-600 text-sm">
          Transaction submitted: {txHash}
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600 text-sm">
          Error: {(error as any).shortMessage}
        </p>
      )}
    </div>
  );
}
