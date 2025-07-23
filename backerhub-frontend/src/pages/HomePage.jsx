import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Fund the Future, Decentralized.
      </h1>
      <p className="text-lg text-gray-400 mb-10 max-w-2xl">
        BackerHub empowers creators and backers with transparent, secure, and
        community-governed crowdfunding on the blockchain.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/campaigns"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
        >
          Explore Campaigns
        </Link>
        <Link
          to="/create-campaign"
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
        >
          Start Your Campaign
        </Link>
      </div>
    </div>
  );
}
