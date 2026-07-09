import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon: Icon, color, bg }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-zinc-850 bg-zinc-900/40 backdrop-blur-md p-6 shadow-md border-zinc-800 hover:shadow-sky-500/5 transition-all"
        >
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</p>
                    <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">{value}</h2>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;