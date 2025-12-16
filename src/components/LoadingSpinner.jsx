import React from "react";

const LoadingSpinner = ({ text = "Loading, please wait..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-xl border border-white/40 dark:border-gray-700">
        
        {/* Spinner */}
        <div className="relative w-20 h-20">
          <span className="absolute inset-0 rounded-full border-4 border-blue-500/30"></span>
          <span className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></span>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {text}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Please don’t refresh the page
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
