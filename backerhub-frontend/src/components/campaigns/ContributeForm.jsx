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
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="number"
        min="0.0001"
        step="any"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 rounded bg-gray-800 border border-gray-700"
      />
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending
          ? "Check Wallet..."
          : isConfirming
          ? "Confirming..."
          : "Contribute"}
      </button>
      {error && <div className="text-red-500">{error.shortMessage}</div>}
      {isConfirmed && (
        <div className="text-green-500">Contribution successful!</div>
      )}
    </form>
  );
}
