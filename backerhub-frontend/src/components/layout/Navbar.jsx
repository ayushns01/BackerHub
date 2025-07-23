import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-white">
          Backer<span className="text-blue-500">Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/campaigns"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Explore
          </Link>
          <Link
            to="/create-campaign"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Start Campaign
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
