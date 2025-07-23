import { useReadContract } from "wagmi";
import CampaignCard from "../components/campaigns/CampaignCard";
import BackerHub from "../contracts/BackerHub.json"; // Ensure this path is correct

// !!! IMPORTANT: REPLACE WITH YOUR DEPLOYED BackerHub CONTRACT ADDRESS !!!
const BACKERHUB_CONTRACT_ADDRESS = "0x1B7109Bd6525746E5b43FA0B069cB8A8afdD9797";

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

  if (isLoading) {
    return <div className="text-center">Loading campaigns...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error fetching campaigns: {error.shortMessage}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 border-b border-gray-700 pb-4">
        All Campaigns
      </h1>

      {campaignAddresses && campaignAddresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaignAddresses.map((address) => (
            <CampaignCard key={address} campaignAddress={address} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          No campaigns have been created yet. Be the first!
        </p>
      )}
    </div>
  );
}
