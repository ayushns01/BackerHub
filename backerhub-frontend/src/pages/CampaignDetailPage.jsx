import { useParams } from "react-router-dom";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import Campaign from "../contracts/Campaign.json";
import { shortenAddress } from "../utils/formatters";
import ContributeForm from "../components/campaigns/ContributeForm";
import RequestList from "../components/campaigns/RequestList";
import CreateRequestForm from "../components/campaigns/CreateRequestForm"; // We will create this

export default function CampaignDetailPage() {
  const { campaignAddress } = useParams();
  const { address: userAddress } = useAccount();

  const {
    data: details,
    isLoading,
    isError,
  } = useReadContract({
    address: campaignAddress,
    abi: Campaign.abi,
    functionName: "getSummary", // You need a getSummary function in your Campaign contract
  });

  if (isLoading) return <p>Loading campaign details...</p>;
  if (isError) return <p className="text-red-500">Error loading campaign.</p>;

  // Match the order of your getSummary return values
  const [
    manager,
    goalAmount,
    amountRaised,
    approversCount,
    requestsCount,
    name,
    description,
  ] = details;

  const isManager = userAddress && userAddress === manager;

  const progress =
    goalAmount > 0 ? (Number(amountRaised) / Number(goalAmount)) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-gray-400 mb-4">{description}</p>
        <p className="text-sm text-gray-500">
          Managed by: {shortenAddress(manager)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">
            {formatEther(amountRaised)} ETH
          </div>
          <div className="text-gray-400">Raised</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">
            {formatEther(goalAmount)} ETH
          </div>
          <div className="text-gray-400">Goal</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">{approversCount.toString()}</div>
          <div className="text-gray-400">Backers</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Contribute</h2>
          <ContributeForm campaignAddress={campaignAddress} />

          {isManager && (
            <>
              <h2 className="text-2xl font-bold mt-8">
                Create Spending Request
              </h2>
              <CreateRequestForm campaignAddress={campaignAddress} />
            </>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Spending Requests</h2>
          <RequestList
            campaignAddress={campaignAddress}
            requestsCount={Number(requestsCount)}
          />
        </div>
      </div>
    </div>
  );
}
