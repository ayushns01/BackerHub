import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import BackerHub from "../contracts/BackerHub.json";

const BACKERHUB_CONTRACT_ADDRESS = "0x0c4304aaEf06a05F591f485bd6E5476591CA38a4";

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
    
    try {
      const goalInWei = parseEther(goal);
      writeContract({
        address: BACKERHUB_CONTRACT_ADDRESS,
        abi: BackerHub.abi,
        functionName: "createCampaign",
        args: [name, description, goalInWei],
      });
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      // Navigate back to campaigns page after successful creation
      setTimeout(() => {
        navigate("/campaigns");
      }, 2000);
    }
  }, [isConfirmed, navigate]);

  return (
    <div className="relative min-h-[80vh] pb-12">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 animate-gradient-x" 
             style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-float" />
      </div>

      <div className="container mx-auto px-4 max-w-2xl space-y-8">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gradient-secondary">
            Start a New Campaign
          </h1>
          <p className="text-xl text-muted-foreground">
            Bring your vision to life with community support
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-glow p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block mb-3 font-semibold text-foreground text-lg">
                Campaign Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full input-dark text-lg"
                placeholder="Enter your campaign name..."
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block mb-3 font-semibold text-foreground text-lg">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full input-dark min-h-[150px] resize-y text-lg"
                placeholder="Describe your project, goals, and how the funds will be used..."
                required
              />
            </div>

            <div>
              <label htmlFor="goal" className="block mb-3 font-semibold text-foreground text-lg">
                Funding Goal (ETH)
              </label>
              <div className="relative">
                <input
                  id="goal"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full input-dark text-lg pl-12"
                  placeholder="1.0"
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent text-xl font-bold">⟠</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="w-full btn-primary text-xl py-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="animate-spin">⏳</span> Check Wallet...
                </>
              ) : isConfirming ? (
                <>
                  <span className="animate-spin">🔄</span> Creating Campaign...
                </>
              ) : (
                <>
                  <span>🚀</span> Launch Campaign
                </>
              )}
            </button>

            <div className="min-h-[40px]">
              {error && (
                <div className="text-destructive text-center flex items-center justify-center gap-2 animate-fade-in">
                  <span>❌</span>
                  <span>{error?.shortMessage || error.message}</span>
                </div>
              )}
              {isConfirmed && (
                <div className="text-success text-center flex items-center justify-center gap-2 animate-fade-in">
                  <span>✅</span>
                  <span>Campaign created successfully! Redirecting...</span>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Tips section */}
        <div className="card-glow p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-semibold mb-4 text-gradient-primary">💡 Tips for Success</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Write a clear, compelling description of your project</p>
            <p>• Set a realistic funding goal based on your actual needs</p>
            <p>• Be transparent about how funds will be used</p>
            <p>• Engage with your community and provide regular updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}