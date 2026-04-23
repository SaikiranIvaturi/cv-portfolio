import { useState, useEffect } from "react";
import { RoleProvider } from "./contexts/RoleContext";
import { AdminSettingsProvider } from "./contexts/AdminSettingsContext";
import AppContent from "./AppContent";
import LoadingScreen from "./components/core/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading (minimum 5.5 seconds for smooth animation)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AdminSettingsProvider>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </AdminSettingsProvider>
  );
}

export default App;
