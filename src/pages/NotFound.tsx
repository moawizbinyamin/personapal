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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! This page doesn't exist</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-primary text-primary-foreground hover:opacity-90 h-10 px-4 py-2 shadow-soft hover:shadow-medium"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
