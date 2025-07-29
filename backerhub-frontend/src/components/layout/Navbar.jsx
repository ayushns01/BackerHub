import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/30 shadow-card">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        <Link
          to="/"
          className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-1 hover:text-primary transition-colors duration-300"
        >
          <span className="text-gradient-primary">Backer</span>
          <span className="text-accent">Hub</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/campaigns"
            className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
              isActive('/campaigns')
                ? 'text-primary bg-primary/10 border border-primary/20'
                : 'text-muted-foreground hover:text-primary hover:bg-card/50'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/create-campaign"
            className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
              isActive('/create-campaign')
                ? 'text-primary bg-primary/10 border border-primary/20'
                : 'text-muted-foreground hover:text-primary hover:bg-card/50'
            }`}
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