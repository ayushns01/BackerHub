import { Link } from "react-router-dom";
import heroBackground from "../assets/hero-background.jpg";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-24 min-h-[70vh] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 animate-gradient-x" 
             style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-up">
          <span className="text-gradient-primary">Fund the Future,</span>
          <br />
          <span className="text-gradient-secondary">Decentralized.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          BackerHub empowers creators and backers with transparent, secure, and
          community-governed crowdfunding on the blockchain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            to="/campaigns"
            className="btn-primary text-xl px-10 py-4 flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span> 
            Explore Campaigns
          </Link>
          
          <Link
            to="/create-campaign"
            className="btn-ghost text-xl px-10 py-4 flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span> 
            Start Your Campaign
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-gradient-primary">Secure</h3>
            <p className="text-muted-foreground text-sm">Smart contracts ensure your funds are protected and transparently managed.</p>
          </div>
          
          <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
            <h3 className="text-xl font-semibold mb-2 text-gradient-primary">Global</h3>
            <p className="text-muted-foreground text-sm">Access funding from anywhere in the world with cryptocurrency.</p>
          </div>
          
          <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-xl font-semibold mb-2 text-gradient-primary">Community</h3>
            <p className="text-muted-foreground text-sm">Backers vote on how funds are used, ensuring accountability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}