import { ShieldAlert, ArrowLeft } from "lucide-react";

interface AccessDeniedProps {
  requiredRole: string;
  onNavigate?: (page: string) => void;
}

export default function AccessDenied({
  requiredRole,
  onNavigate,
}: AccessDeniedProps) {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-2xl">
        <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-yellow-800 font-semibold mb-2">
            Required Role:
          </p>
          <p className="text-lg text-yellow-900 font-bold">{requiredRole}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-left mb-6">
          <p className="text-sm text-gray-700 mb-3 font-semibold">
            To request access:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Contact your platform administrator</li>
            <li>Provide your user ID and required role</li>
            <li>Explain your business need for access</li>
          </ul>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3673] text-white rounded-lg hover:bg-[#2861BB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </button>
        )}
      </div>
    </div>
  );
}
