import { motion } from "framer-motion";

const StatsCard = ({ title, value, growth, icon: Icon, color, bg }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>

                    <h2 className="mt-2 text-3xl font-bold">{value}</h2>

                    <p className="mt-2 text-sm font-medium text-green-600">
                        {growth} from last month
                    </p>
                </div>

                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg}`}
                >
                    <Icon className={`h-7 w-7 ${color}`} />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;