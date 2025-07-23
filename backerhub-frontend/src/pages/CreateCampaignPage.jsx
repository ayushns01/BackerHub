import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import BackerHub from "../contracts/BackerHub.json";

const BACKERHUB_CONTRACT_ADDRESS = "0x1B7109Bd6525746E5b43FA0B069cB8A8afdD9797"; // IMPORTANT

export default function CreateCampaignPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const navigate = useNavigate();

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !description || !goal) return;
    const goalInWei = parseEther(goal);
    writeContract({
      address: BACKERHUB_CONTRACT_ADDRESS,
      abi: BackerHub.abi,
      functionName: "createCampaign",
      args: [name, description, goalInWei],
    });
  }

  if (isConfirmed) {
    // Ideally, you'd get the new campaign address from events to redirect.
    // For now, we'll just navigate back to the main campaigns page.
    navigate("/campaigns");
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Start a New Campaign</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Campaign Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="goal" className="block mb-1 font-medium">
            Funding Goal (in ETH)
          </label>
          <input
            id="goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-500"
        >
          {isPending
            ? "Check Wallet..."
            : isConfirming
            ? "Creating Campaign..."
            : "Create Campaign"}
        </button>
        {error && (
          <p className="text-red-500 mt-2">Error: {error.shortMessage}</p>
        )}
      </form>
    </div>
  );
}
