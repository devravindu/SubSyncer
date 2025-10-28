"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center my-12"
    >
      <h1 className="text-5xl font-bold">
        Sync Your Subtitles in Seconds 🚀
      </h1>
      <p className="text-xl mt-4 text-gray-600">
        Upload reference & target subtitles — get a perfectly synced version
        instantly.
      </p>
    </motion.div>
  );
}
