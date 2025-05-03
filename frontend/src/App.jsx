import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Layout/Header";
import SplashScreen from "./components/Layout/SplashScreen";
import AppRoutes from "./components/Routing/AppRoutes";
import AppProviders from "./components/Routing/AppProviders";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AppProviders>
      <div>
        <Header />
        <main>
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
        </main>
      </div>
    </AppProviders>
  );
}

export default App;
