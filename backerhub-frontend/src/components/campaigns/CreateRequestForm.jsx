import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import Campaign from "../../contracts/Campaign.json";

export default function CreateRequestForm({ campaignAddress }) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description || !value || !recipient) return;
    const valueInWei = parseEther(value);
    try {
      writeContract({
        address: campaignAddress,
        abi: Campaign.abi,
        functionName: "createRequest",
        args: [description, valueInWei, recipient],
      });
    } catch (error) {
      console.error("Create Request Error:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-4 rounded-lg space-y-3"
    >
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Request description"
        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Amount in ETH (e.g., 0.5)"
        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
      />
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address (0x...)"
        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
      />
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500"
      >
        {isPending
          ? "Check Wallet..."
          : isConfirming
          ? "Creating..."
          : "Create Request"}
      </button>
      {error && (
        <p className="text-red-500 text-center">Error: {error.shortMessage}</p>
      )}
    </form>
  );
}
