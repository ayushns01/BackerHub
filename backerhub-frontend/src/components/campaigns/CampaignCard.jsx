import { Link } from "react-router-dom";
import { shortenAddress } from "../../utils/formatters";
import { useState } from "react";

export default function CampaignCard({ campaignAddress }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(campaignAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-between border border-gray-700 hover:border-blue-500 hover:shadow-2xl transition-all duration-200 group">
      <div>
        <h2 className="text-xl font-bold mb-2 text-blue-400 group-hover:text-blue-300 transition">
          Campaign
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">Address:</span>
          <span className="font-mono text-gray-200 bg-gray-900 px-2 py-1 rounded text-xs">
            {shortenAddress ? shortenAddress(campaignAddress) : campaignAddress}
          </span>
          <button
            onClick={handleCopy}
            className="ml-1 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Copy address"
            type="button"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <Link
        to={`/campaigns/${campaignAddress}`}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
      >
        View Details
      </Link>
    </div>
  );
}
