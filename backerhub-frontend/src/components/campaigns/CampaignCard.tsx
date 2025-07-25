import { Link } from "react-router-dom";
import { shortenAddress } from "../../utils/formatters";
import { useState } from "react";

interface CampaignCardProps {
  campaignAddress: string;
}

export default function CampaignCard({ campaignAddress }: CampaignCardProps) {
  const [copied, setCopied] = useState(false);
  
  function handleCopy() {
    navigator.clipboard.writeText(campaignAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="card-glow p-6 flex flex-col justify-between group animate-fade-in-up">
      <div>
        <h2 className="text-xl font-bold mb-2 text-gradient-primary group-hover:text-primary transition-colors duration-300">
          Campaign
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-muted-foreground text-sm">Address:</span>
          <span className="font-mono text-foreground bg-muted px-2 py-1 rounded text-xs">
            {shortenAddress(campaignAddress)}
          </span>
          <button
            onClick={handleCopy}
            className="ml-1 text-xs px-2 py-1 rounded bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            title="Copy address"
            type="button"
          >
            {copied ? "✓" : "📋"}
          </button>
        </div>
      </div>
      
      <Link
        to={`/campaigns/${campaignAddress}`}
        className="mt-4 btn-primary text-center transform hover:scale-105 transition-all duration-300"
      >
        View Details
      </Link>
    </div>
  );
}