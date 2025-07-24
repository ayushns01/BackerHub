import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-24 min-h-[70vh] overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 opacity-80 animate-gradient-x" />
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
        Fund the Future, Decentralized.
      </h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl animate-fade-in delay-200">
        BackerHub empowers creators and backers with transparent, secure, and
        community-governed crowdfunding on the blockchain.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
        <Link
          to="/campaigns"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span>🔍</span> Explore Campaigns
        </Link>
        <Link
          to="/create-campaign"
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <span>🚀</span> Start Your Campaign
        </Link>
      </div>
    </div>
  );
}
