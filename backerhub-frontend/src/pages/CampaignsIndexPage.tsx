import { useReadContract } from "wagmi";
import CampaignCard from "../components/campaigns/CampaignCard";
import BackerHub from "../contracts/BackerHub.json";

// Contract address - replace with your deployed address
const BACKERHUB_CONTRACT_ADDRESS = "0x207684aa4A46eabDB4BC0E41a8A57C25768Da136";

export default function CampaignsIndexPage() {
  const {
    data: campaignAddresses,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: BACKERHUB_CONTRACT_ADDRESS as `0x${string}`,
    abi: BackerHub.abi,
    functionName: "getDeployedCampaigns",
  });

  // Debug output for troubleshooting
  console.log({ campaignAddresses, isLoading, isError, error });

  if (isLoading) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-6xl">🔄</div>
          <p className="text-xl text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold text-destructive">Error Loading Campaigns</h2>
          <p className="text-muted-foreground max-w-md">
            {(error as any)?.message || 
             (error as any)?.shortMessage || 
             "Unable to fetch campaigns from the blockchain."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] pb-12">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 animate-gradient-x" 
             style={{ backgroundSize: '400% 400%' }} />
      </div>

      <div className="container mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gradient-primary">
            All Campaigns
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover innovative projects seeking funding from the community
          </p>
        </div>

        {Array.isArray(campaignAddresses) && campaignAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {campaignAddresses.map((address, index) => (
              <div key={address} style={{ animationDelay: `${0.1 * index}s` }}>
                <CampaignCard campaignAddress={address} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-glow p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-2xl font-bold mb-4 text-gradient-primary">Be the First!</h2>
              <p className="text-muted-foreground mb-6">
                No campaigns have been created yet. Start the revolution by launching the first campaign on BackerHub.
              </p>
              <a 
                href="/create-campaign" 
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>✨</span> Create First Campaign
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}