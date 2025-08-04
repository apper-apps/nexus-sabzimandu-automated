import React from "react";

const Loading = ({ type = "page" }) => {
  if (type === "skeleton") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-card p-4 shadow-card">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded shimmer w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded shimmer w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="h-32 bg-gray-200 shimmer"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-3 bg-gray-200 rounded shimmer w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded shimmer w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 gradient-primary rounded-full animate-ping opacity-20"></div>
        <div className="relative w-full h-full gradient-primary rounded-full animate-spin">
          <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      <p className="text-gray-600 font-body text-center">Loading fresh produce...</p>
    </div>
  );
};

export default Loading;