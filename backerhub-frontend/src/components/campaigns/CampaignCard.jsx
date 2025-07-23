import { Link } from "react-router-dom";
import { shortenAddress } from "../../utils/formatters";

export default function CampaignCard({ campaignAddress }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-2">Campaign</h2>
        <p className="text-gray-400 mb-4">
          Address:{" "}
          {shortenAddress ? shortenAddress(campaignAddress) : campaignAddress}
        </p>
      </div>
      <Link
        to={`/campaigns/${campaignAddress}`}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        View Details
      </Link>
    </div>
  );
}
