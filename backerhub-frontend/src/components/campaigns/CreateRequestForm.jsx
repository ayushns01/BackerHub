import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Campaign from "../../contracts/Campaign.json";
import { parseEther } from "viem";

export default function CreateRequestForm({ campaignAddress }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description || !amount || !recipient) return;
    
    try {
      const valueInWei = parseEther(amount);
      writeContract({
        address: campaignAddress,
        abi: Campaign.abi,
        functionName: "createRequest",
        args: [description, valueInWei, recipient],
      });
      
      // Reset form on success
      if (isConfirmed) {
        setDescription("");
        setAmount("");
        setRecipient("");
      }
    } catch (err) {
      console.error("Error creating request:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 card-glow p-6 animate-slide-up">
      <div>
        <label htmlFor="description" className="block mb-2 font-medium text-foreground">
          Request Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full input-dark min-h-[100px] resize-y"
          placeholder="Describe what the funds will be used for..."
          required
        />
      </div>
      
      <div>
        <label htmlFor="amount" className="block mb-2 font-medium text-foreground">
          Amount (ETH)
        </label>
        <input
          id="amount"
          type="number"
          min="0.0001"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full input-dark"
          placeholder="0.1"
          required
        />
      </div>
      
      <div>
        <label htmlFor="recipient" className="block mb-2 font-medium text-foreground">
          Recipient Address
        </label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full input-dark font-mono"
          placeholder="0x..."
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="animate-spin">⏳</span> Check Wallet...
          </>
        ) : isConfirming ? (
          <>
            <span className="animate-spin">🔄</span> Creating Request...
          </>
        ) : (
          <>
            <span>📝</span> Create Request
          </>
        )}
      </button>
      
      {error && (
        <div className="text-destructive text-sm flex items-center gap-2 animate-fade-in">
          <span>❌</span>
          {error?.shortMessage || error.message}
        </div>
      )}
      {isConfirmed && (
        <div className="text-success text-sm flex items-center gap-2 animate-fade-in">
          <span>✅</span>
          Request created successfully!
        </div>
      )}
    </form>
  );
}