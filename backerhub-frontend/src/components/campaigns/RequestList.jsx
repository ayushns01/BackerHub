import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import Campaign from "../../contracts/Campaign.json";
import { shortenAddress } from "../../utils/formatters";

export default function RequestList({ campaignAddress, requestsCount }) {
  const { address: userAddress } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Generate array of request indices
  const requestIndices = Array.from({ length: requestsCount }, (_, i) => i);

  function handleApprove(requestIndex) {
    writeContract({
      address: campaignAddress,
      abi: Campaign.abi,
      functionName: "approveRequest",
      args: [requestIndex],
    });
  }

  function handleFinalize(requestIndex) {
    writeContract({
      address: campaignAddress,
      abi: Campaign.abi,
      functionName: "finalizeRequest",
      args: [requestIndex],
    });
  }

  if (requestsCount === 0) {
    return (
      <div className="card-glow p-6 text-center animate-fade-in">
        <div className="text-4xl mb-4">📋</div>
        <p className="text-muted-foreground">
          No spending requests have been created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {requestIndices.map((index) => (
        <RequestItem
          key={index}
          campaignAddress={campaignAddress}
          requestIndex={index}
          onApprove={() => handleApprove(index)}
          onFinalize={() => handleFinalize(index)}
          isLoading={isPending || isConfirming}
        />
      ))}
    </div>
  );
}

function RequestItem({ 
  campaignAddress, 
  requestIndex, 
  onApprove, 
  onFinalize, 
  isLoading 
}) {
  const { address: userAddress } = useAccount();
  
  const { data: request, isLoading: requestLoading } = useReadContract({
    address: campaignAddress,
    abi: Campaign.abi,
    functionName: "requests",
    args: [requestIndex],
  });

  const { data: summary } = useReadContract({
    address: campaignAddress,
    abi: Campaign.abi,
    functionName: "getSummary",
  });

  if (requestLoading || !request) {
    return (
      <div className="card-glow p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  const [manager, , , approversCount] = summary || [null, 0n, 0n, 0n, 0n, "", ""];
  const isManager = userAddress && userAddress === manager;
  const canFinalize = Number(request.approvalCount) > Number(approversCount) / 2;

  return (
    <div className={`card-glow p-6 ${request.complete ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">{request.description}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Amount: <span className="text-accent font-semibold">{formatEther(request.value)} ETH</span></p>
            <p>Recipient: <span className="font-mono">{shortenAddress(request.recipient)}</span></p>
            <p>
              Approvals: <span className="text-primary font-semibold">{request.approvalCount.toString()}</span> / {approversCount.toString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {request.complete ? (
            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium">
              ✅ Complete
            </span>
          ) : (
            <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
              ⏳ Pending
            </span>
          )}
        </div>
      </div>
      
      {!request.complete && (
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            disabled={isLoading}
            className="btn-ghost text-sm flex-1 disabled:opacity-60"
          >
            👍 Approve
          </button>
          {isManager && canFinalize && (
            <button
              onClick={onFinalize}
              disabled={isLoading}
              className="btn-primary text-sm flex-1 disabled:opacity-60"
            >
              🚀 Finalize
            </button>
          )}
        </div>
      )}
    </div>
  );
}