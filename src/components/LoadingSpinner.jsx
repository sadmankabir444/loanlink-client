import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-green-400 border-dashed rounded-full animate-spin animation-delay-200"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-purple-400 border-dashed rounded-full animate-spin animation-delay-400"></div>
      </div>
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200 animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingSpinner;
