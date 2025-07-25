import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Campaign from "../../contracts/Campaign.json";
import { parseEther } from "viem";

interface ContributeFormProps {
  campaignAddress: string;
}

export default function ContributeForm({ campaignAddress }: ContributeFormProps) {
  const [amount, setAmount] = useState("0.001");
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    (writeContract as any)({
      address: campaignAddress as `0x${string}`,
      abi: Campaign.abi,
      functionName: "contribute",
      value: parseEther(amount),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 card-glow p-6 animate-slide-up"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl text-accent animate-glow">⟠</div>
        <input
          type="number"
          min="0.0001"
          step="any"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 input-dark text-lg"
        />
      </div>
      
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="w-full btn-primary text-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
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
          <div className="text-destructive flex items-center gap-2 text-sm animate-fade-in">
            <span>❌</span>
            {(error as any)?.shortMessage || error.message}
          </div>
        )}
        {isConfirmed && (
          <div className="text-success flex items-center gap-2 text-sm animate-fade-in">
            <span>✅</span>
            Contribution successful!
          </div>
        )}
        {!error && !isConfirmed && (
          <div className="text-muted-foreground text-sm">
            Your contribution helps this campaign reach its goal.
          </div>
        )}
      </div>
    </form>
  );
}