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
    <div className="relative space-y-8 min-h-[80vh] pb-12">
      {/* Soft background pattern/gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-800 opacity-80" />
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
          {name}
        </h1>
        <p className="text-gray-300 mb-4 animate-fade-in delay-100">
          {description}
        </p>
        <p className="text-sm text-gray-400 animate-fade-in delay-200">
          Managed by:{" "}
          <span className="font-mono bg-gray-900 px-2 py-1 rounded text-xs">
            {shortenAddress(manager)}
          </span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-200">
        <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700 shadow">
          <div className="text-3xl font-bold text-blue-400">
            {formatEther(amountRaised)} ETH
          </div>
          <div className="text-gray-400">Raised</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700 shadow">
          <div className="text-3xl font-bold text-purple-400">
            {formatEther(goalAmount)} ETH
          </div>
          <div className="text-gray-400">Goal</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700 shadow">
          <div className="text-3xl font-bold text-green-400">
            {approversCount.toString()}
          </div>
          <div className="text-gray-400">Backers</div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="animate-fade-in delay-300">
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-green-400 h-4 rounded-full transition duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-gray-400 mt-1">
          {progress.toFixed(1)}% funded
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in delay-400">
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Contribute
          </h2>
          <ContributeForm campaignAddress={campaignAddress} />
          {isManager && (
            <>
              <h2 className="text-2xl font-extrabold mt-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                Create Spending Request
              </h2>
              <CreateRequestForm campaignAddress={campaignAddress} />
            </>
          )}
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Spending Requests
          </h2>
          <RequestList
            campaignAddress={campaignAddress}
            requestsCount={Number(requestsCount)}
          />
        </div>
      </div>
    </div>
  );
}
