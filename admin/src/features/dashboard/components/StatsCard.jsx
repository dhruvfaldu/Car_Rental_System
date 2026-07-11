import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon: Icon, color, bg }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border bg-card/80 p-6 shadow-md backdrop-blur-md transition-all hover:border-primary/20 hover:shadow-lg"
        >
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {title}
                    </p>

                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                        {value}
                    </h2>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border ${bg}`}
                >
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;