import { RefreshCcw } from "lucide-react";

const LoadingState = ({ message = "Loading your profile data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCcw className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
      <p className="text-slate-600">{message}</p>
    </div>
  );
};

export default LoadingState;