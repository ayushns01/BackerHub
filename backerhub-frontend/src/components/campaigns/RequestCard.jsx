import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther } from "viem";
import Campaign from "../../contracts/Campaign.json";
import { shortenAddress } from "../../utils/formatters";

export default function RequestCard({ campaignAddress, requestId }) {
  const { address: userAddress } = useAccount();

  const { data: request, isLoading: isLoadingRequest } = useReadContract({
    address: campaignAddress,
    abi: Campaign.abi,
    functionName: "requests",
    args: [requestId],
  });

  const { data: isApprover } = useReadContract({
    address: campaignAddress,
    abi: Campaign.abi,
    functionName: "approvers",
    args: [userAddress],
    enabled: !!userAddress, // Only run this query if the user is connected
  });

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  if (isLoadingRequest || !request)
    return (
      <div className="bg-gray-800 p-4 rounded-lg animate-pulse h-24"></div>
    );

  const [description, value, recipient, complete, approvalCount] = request;

  const canApprove = isApprover && !complete;

  function handleApprove() {
    writeContract({
      address: campaignAddress,
      abi: Campaign.abi,
      functionName: "approveRequest",
      args: [requestId],
    });
  }

  return (
    <div
      className={`p-4 rounded-lg ${
        complete ? "bg-green-900/50" : "bg-gray-800"
      }`}
    >
      <p className="font-bold">{description}</p>
      <p className="text-sm text-gray-400">
        Requesting:{" "}
        <span className="font-mono text-blue-400">
          {formatEther(value)} ETH
        </span>
      </p>
      <p className="text-xs text-gray-500">To: {shortenAddress(recipient)}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-bold">
          Approvals: {approvalCount.toString()}
        </span>
        {canApprove && (
          <button
            onClick={handleApprove}
            disabled={isPending || isConfirming}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded-md transition duration-300 disabled:bg-gray-500"
          >
            {isPending
              ? "Check Wallet..."
              : isConfirming
              ? "Approving..."
              : "Approve"}
          </button>
        )}
        {complete && (
          <span className="text-xs font-bold text-green-400">Completed</span>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">Error: {error.shortMessage}</p>
      )}
    </div>
  );
}
