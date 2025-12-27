import { motion } from "framer-motion";
import { Calendar, Heart, Baby } from "lucide-react";
import { format } from "date-fns";

interface ResultsCardProps {
  nextPeriod: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export function ResultsCard({
  nextPeriod,
  ovulationDate,
  fertileWindowStart,
  fertileWindowEnd,
}: ResultsCardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-card p-6 md:p-8 mt-8 space-y-6"
    >
      <motion.h2 variants={item} className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Your Cycle Insights
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Period */}
        <motion.div variants={item} className="highlight-period p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Next Period</h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">Expected start date</p>
          <p className="text-xl font-bold text-primary">
            {format(nextPeriod, "MMMM d, yyyy")}
          </p>
        </motion.div>

        {/* Ovulation */}
        <motion.div variants={item} className="highlight-ovulation p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <Baby className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Ovulation</h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">Peak fertility day</p>
          <p className="text-xl font-bold text-green-700">
            {format(ovulationDate, "MMMM d, yyyy")}
          </p>
        </motion.div>

        {/* Fertile Window */}
        <motion.div variants={item} className="highlight-fertile p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Fertile Window</h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">Highest chance to conceive</p>
          <p className="text-lg font-bold text-yellow-700">
            {format(fertileWindowStart, "MMM d")} - {format(fertileWindowEnd, "MMM d")}
          </p>
        </motion.div>
      </div>

      <motion.p variants={item} className="text-center text-sm text-muted-foreground mt-4 italic">
        *Calculations are estimates based on a regular cycle. Every body is unique!
      </motion.p>
    </motion.div>
  );
}
