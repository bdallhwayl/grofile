import React from 'react';

export const Skeleton = ({ variant = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm p-4">
            <div className="skeleton h-48 rounded-xl mb-4 w-full"></div>
            <div className="skeleton h-6 rounded-md mb-2 w-3/4"></div>
            <div className="skeleton h-4 rounded-md mb-4 w-1/2"></div>
            <div className="flex justify-between items-center">
              <div className="skeleton h-8 rounded-lg w-1/3"></div>
              <div className="skeleton h-8 rounded-lg w-1/4"></div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="flex items-center gap-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <div className="skeleton w-12 h-12 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 rounded w-1/4"></div>
              <div className="skeleton h-3 rounded w-1/2"></div>
            </div>
            <div className="skeleton w-16 h-8 rounded"></div>
          </div>
        );
      case 'detail':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="skeleton h-96 rounded-2xl w-full"></div>
            <div className="space-y-4">
              <div className="skeleton h-10 rounded-md w-3/4"></div>
              <div className="skeleton h-6 rounded-md w-1/4"></div>
              <div className="skeleton h-32 rounded-md w-full"></div>
              <div className="skeleton h-12 rounded-lg w-1/2"></div>
            </div>
          </div>
        );
      default:
        return <div className="skeleton h-4 rounded w-full"></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};

export default Skeleton;
