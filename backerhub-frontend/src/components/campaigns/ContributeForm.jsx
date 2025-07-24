// src/components/campaign/ContributeForm.jsx
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Campaign from "../../contracts/Campaign.json";
import { parseEther } from "viem";

export default function ContributeForm({ campaignAddress }) {
  // Default to a very small value (0.001 ETH)
  const [amount, setAmount] = useState("0.001");
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    writeContract({
      address: campaignAddress,
      abi: Campaign.abi,
      functionName: "contribute",
      value: parseEther(amount),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl text-yellow-400">Ξ</span>
        <input
          type="number"
          min="0.0001"
          step="any"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-lg text-gray-100 outline-none transition"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg text-lg transition shadow focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="animate-spin">⏳</span> Check Wallet...
          </>
        ) : isConfirming ? (
          <>
            <span className="animate-spin">🔄</span> Confirming...
          </>
        ) : (
          <>
            <span>💸</span> Contribute
          </>
        )}
      </button>
      <div className="min-h-[24px]">
        {error && (
          <div className="text-red-500 flex items-center gap-1 text-sm">
            <span>❌</span>
            {error.shortMessage}
          </div>
        )}
        {isConfirmed && (
          <div className="text-green-500 flex items-center gap-1 text-sm">
            <span>✅</span>Contribution successful!
          </div>
        )}
        {!error && !isConfirmed && (
          <div className="text-gray-400 text-xs">
            Your contribution helps this campaign reach its goal.
          </div>
        )}
      </div>
    </form>
  );
}
