import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black dark:bg-zinc-900 shadow-inner mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      
        <p className="text-sm text-white dark:text-gray-400">
          &copy; {new Date().getFullYear()} Minimart. All rights reserved.
        </p>
        <p className="text-sm text-white dark:text-gray-400">
           Building reliable solutions for everyone
        </p>
      </div>
    </footer>
  );
};
