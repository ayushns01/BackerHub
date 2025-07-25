import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in-up">
        <div className="text-8xl animate-float">🔍</div>
        <h1 className="text-6xl font-bold text-gradient-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This page seems to have wandered off into the blockchain void.
        </p>
        <a 
          href="/" 
          className="btn-primary text-lg inline-flex items-center gap-2"
        >
          <span>🏠</span> Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
