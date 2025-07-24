import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-lg rounded-b-xl">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1"
        >
          <span className="inline-block">Backer</span>
          <span className="text-blue-400 inline-block">Hub</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/campaigns"
            className="text-gray-300 hover:text-blue-400 transition-colors font-medium px-2 py-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Explore
          </Link>
          <Link
            to="/create-campaign"
            className="text-gray-300 hover:text-blue-400 transition-colors font-medium px-2 py-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Start Campaign
          </Link>
          <div className="ml-2">
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
        </div>
      </div>
    </nav>
  );
}
