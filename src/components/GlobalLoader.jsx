import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            {/* Text Loading */}
            <span className="mt-4 text-white font-medium tracking-wider text-sm">
              Tunggu sebentar...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
