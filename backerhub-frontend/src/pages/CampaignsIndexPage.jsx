import { useReadContract } from "wagmi";
import CampaignCard from "../components/campaigns/CampaignCard";
import BackerHub from "../contracts/BackerHub.json";

// Make sure this is your deployed BackerHub factory address on Sepolia
const BACKERHUB_CONTRACT_ADDRESS = "0x0c4304aaEf06a05F591f485bd6E5476591CA38a4";

export default function CampaignsIndexPage() {
  const {
    data: campaignAddresses,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: BACKERHUB_CONTRACT_ADDRESS,
    abi: BackerHub.abi,
    functionName: "getDeployedCampaigns",
  });

  // Debug output for troubleshooting
  console.log({ campaignAddresses, isLoading, isError, error });
  if (error) {
    console.error("Wagmi Read Error:", error);
  }

  if (isLoading) {
    return <div className="text-center">Loading campaigns...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error fetching campaigns:{" "}
        {error?.message || error?.shortMessage || String(error)}
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] pb-12">
      {/* Soft background pattern/gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 opacity-80" />
      <h1 className="text-4xl font-extrabold mb-8 border-b border-gray-700 pb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
        All Campaigns
      </h1>
      {Array.isArray(campaignAddresses) && campaignAddresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in delay-200">
          {campaignAddresses.map((address) => (
            <CampaignCard key={address} campaignAddress={address} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10 animate-fade-in delay-300">
          No campaigns have been created yet. Be the first!
        </p>
      )}
    </div>
  );
}
