import { useParams } from "react-router-dom";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import Campaign from "../contracts/Campaign.json";
import { shortenAddress, formatPercentage } from "../utils/formatters";
import ContributeForm from "../components/campaigns/ContributeForm";
import RequestList from "../components/campaigns/RequestList";
import CreateRequestForm from "../components/campaigns/CreateRequestForm";

export default function CampaignDetailPage() {
  const { campaignAddress } = useParams();
  const { address: userAddress } = useAccount();

  const {
    data: details,
    isLoading,
    isError,
    error
  } = useReadContract({
    address: campaignAddress,
    abi: Campaign.abi,
    functionName: "getSummary",
  });

  if (isLoading) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-6xl">🔄</div>
          <p className="text-xl text-muted-foreground">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (isError || !details) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold text-destructive">Campaign Not Found</h2>
          <p className="text-muted-foreground">
            {error?.message || "Unable to load campaign details"}
          </p>
        </div>
      </div>
    );
  }

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
  const progress = goalAmount > 0n ? (Number(amountRaised) / Number(goalAmount)) * 100 : 0;
  const isGoalReached = amountRaised >= goalAmount;

  return (
    <div className="relative min-h-[80vh] pb-12">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 animate-gradient-x" 
             style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="card-hero p-8 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gradient-primary animate-glow">
            {name}
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <span className="text-muted-foreground">Managed by:</span>
            <span className="font-mono bg-muted px-3 py-1 rounded-lg text-xs">
              {shortenAddress(manager)}
            </span>
            {isManager && (
              <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                You're the manager
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
              {formatEther(amountRaised)}
            </div>
            <div className="text-muted-foreground text-sm">ETH Raised</div>
          </div>
          
          <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-gradient-secondary mb-2">
              {formatEther(goalAmount)}
            </div>
            <div className="text-muted-foreground text-sm">ETH Goal</div>
          </div>
          
          <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
              {approversCount.toString()}
            </div>
            <div className="text-muted-foreground text-sm">Backers</div>
          </div>
          
          <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-success mb-2">
              {requestsCount.toString()}
            </div>
            <div className="text-muted-foreground text-sm">Requests</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card-glow p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">Campaign Progress</span>
            <span className={`text-sm font-bold ${isGoalReached ? 'text-success' : 'text-primary'}`}>
              {formatPercentage(progress)} funded
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isGoalReached ? 'bg-gradient-to-r from-success to-accent' : ''}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          {isGoalReached && (
            <div className="text-center mt-3">
              <span className="px-4 py-2 bg-success/20 text-success rounded-full text-sm font-medium animate-glow">
                🎉 Goal Reached!
              </span>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contribute & Create Request */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center gap-3">
                <span>💰</span> Support This Campaign
              </h2>
              <ContributeForm campaignAddress={campaignAddress} />
            </div>

            {isManager && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gradient-secondary flex items-center gap-3">
                  <span>📝</span> Create Spending Request
                </h2>
                <CreateRequestForm campaignAddress={campaignAddress} />
              </div>
            )}
          </div>

          {/* Right Column - Spending Requests */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center gap-3">
              <span>📋</span> Spending Requests
            </h2>
            <RequestList
              campaignAddress={campaignAddress}
              requestsCount={Number(requestsCount)}
            />
          </div>
        </div>

        {/* Campaign Info Card */}
        <div className="card-glow p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-xl font-semibold mb-4 text-gradient-primary">📊 Campaign Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Contract Address:</span>
              <div className="font-mono bg-muted px-2 py-1 rounded mt-1 text-xs">
                {shortenAddress(campaignAddress)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Manager:</span>
              <div className="font-mono bg-muted px-2 py-1 rounded mt-1 text-xs">
                {shortenAddress(manager)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}