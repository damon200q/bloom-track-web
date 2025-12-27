import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, subDays, format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Activity, Sparkles } from "lucide-react";

import { useCreateCycle } from "@/hooks/use-cycles";
import { ResultsCard } from "@/components/ResultsCard";
import { HistoryList } from "@/components/HistoryList";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Schema for the form
const formSchema = z.object({
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  cycleLength: z.coerce.number().min(20, "Cycle usually lasts at least 20 days").max(45, "Cycle usually lasts less than 45 days"),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [result, setResult] = useState<{
    nextPeriod: Date;
    ovulationDate: Date;
    fertileWindowStart: Date;
    fertileWindowEnd: Date;
  } | null>(null);

  const { toast } = useToast();
  const createCycle = useCreateCycle();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cycleLength: 28,
      startDate: new Date(),
    },
  });

  const startDate = watch("startDate");

  const onSubmit = (data: FormData) => {
    // 1. Calculate Results Locally
    const start = data.startDate;
    const length = data.cycleLength;

    const nextPeriod = addDays(start, length);
    const ovulationDate = subDays(nextPeriod, 14);
    const fertileWindowStart = subDays(ovulationDate, 5);
    const fertileWindowEnd = addDays(ovulationDate, 1);

    setResult({
      nextPeriod,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd,
    });

    // 2. Save to Backend
    createCycle.mutate(
      {
        startDate: format(data.startDate, "yyyy-MM-dd"), // API expects string YYYY-MM-DD
        cycleLength: data.cycleLength,
        note: data.note || undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: "Calculation saved!",
            description: "Your cycle history has been updated.",
          });
        },
        onError: (err) => {
          toast({
            title: "Error saving",
            description: err.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#fff0f3] px-4 py-12 sm:px-6 lg:px-8 font-sans text-foreground">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-lg shadow-primary/10 mb-6">
            <Sparkles className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-display">
              Bloom<span className="text-primary">Track</span>
            </h1>
          </div>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Understand your body's natural rhythm with our beautiful, simple fertility calculator.
          </p>
        </motion.div>

        {/* Main Calculator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-12"
          >
            <div className="glass-card p-6 md:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Date Picker */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      Last Period Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-14 justify-start text-left font-normal rounded-xl border-2 border-primary/10 hover:border-primary/30 hover:bg-white text-lg transition-all",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border-primary/10 shadow-xl rounded-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => setValue("startDate", date as Date)}
                          initialFocus
                          className="rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && (
                      <p className="text-sm text-destructive font-medium ml-1">{errors.startDate.message}</p>
                    )}
                  </div>

                  {/* Cycle Length Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Cycle Length (Days)
                    </label>
                    <input
                      {...register("cycleLength")}
                      type="number"
                      className="input-field h-14 text-lg font-medium"
                      placeholder="28"
                    />
                    {errors.cycleLength && (
                      <p className="text-sm text-destructive font-medium ml-1">{errors.cycleLength.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-1">Most cycles are between 21 and 35 days.</p>
                  </div>
                </div>

                {/* Optional Note */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Notes (Optional)
                  </label>
                  <input
                    {...register("note")}
                    className="input-field"
                    placeholder="E.g., Felt mild cramps, heavy flow..."
                  />
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={createCycle.isPending}
                    className="btn-primary w-full md:w-auto min-w-[200px] text-lg"
                  >
                    {createCycle.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Calculating...
                      </span>
                    ) : (
                      "Calculate My Cycle"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        {result && (
          <ResultsCard
            nextPeriod={result.nextPeriod}
            ovulationDate={result.ovulationDate}
            fertileWindowStart={result.fertileWindowStart}
            fertileWindowEnd={result.fertileWindowEnd}
          />
        )}

        {/* History List */}
        <div className="max-w-3xl mx-auto">
          <HistoryList />
        </div>
      </div>
    </div>
  );
}
