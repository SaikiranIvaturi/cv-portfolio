import UnifiedDashboard from "./UnifiedDashboard";

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  return <UnifiedDashboard onNavigate={onNavigate} variant="grid" />;
}
