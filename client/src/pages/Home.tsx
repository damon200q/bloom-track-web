import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, subDays, format, differenceInDays, differenceInWeeks } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Activity, 
  Sparkles, 
  Baby, 
  Scale, 
  HeartPulse,
  Info
} from "lucide-react";

import { useCreateCycle, useCycles } from "@/hooks/use-cycles";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// Form Schemas
const cycleSchema = z.object({
  startDate: z.date(),
  cycleLength: z.coerce.number().min(22).max(45),
  note: z.string().optional(),
});

const pregnancySchema = z.object({
  method: z.enum(["lmp", "conception"]),
  date: z.date(),
});

const weightSchema = z.object({
  preWeight: z.coerce.number().min(30),
  height: z.coerce.number().min(100),
  currentWeek: z.coerce.number().min(1).max(40).optional(),
});

const postpartumSchema = z.object({
  deliveryDate: z.date(),
  breastfeeding: z.enum(["yes", "partial", "no"]),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("fertility");
  const { toast } = useToast();
  const createCycle = useCreateCycle();
  const { data: cycles } = useCycles();

  // Results States
  const [fertilityResult, setFertilityResult] = useState<any>(null);
  const [pregnancyResult, setPregnancyResult] = useState<any>(null);
  const [weightResult, setWeightResult] = useState<any>(null);
  const [postpartumResult, setPostpartumResult] = useState<any>(null);

  // Forms
  const cycleForm = useForm({
    resolver: zodResolver(cycleSchema),
    defaultValues: { startDate: new Date(), cycleLength: 28, note: "" }
  });

  const pregnancyForm = useForm({
    resolver: zodResolver(pregnancySchema),
    defaultValues: { method: "lmp", date: new Date() }
  });

  const weightForm = useForm({
    resolver: zodResolver(weightSchema),
    defaultValues: { preWeight: 60, height: 165, currentWeek: 20 }
  });

  const postpartumForm = useForm({
    resolver: zodResolver(postpartumSchema),
    defaultValues: { deliveryDate: new Date(), breastfeeding: "yes" }
  });

  // Handlers
  const onCycleSubmit = (data: any) => {
    const nextPeriod = addDays(data.startDate, data.cycleLength);
    const ovulationDate = subDays(nextPeriod, 14);
    setFertilityResult({
      nextPeriod,
      ovulationDay: ovulationDate,
      fertileWindowStart: subDays(ovulationDate, 5),
      fertileWindowEnd: addDays(ovulationDate, 1),
      safePeriodStart: addDays(data.startDate, 3),
      safePeriodEnd: subDays(ovulationDate, 6)
    });

    createCycle.mutate({
      startDate: format(data.startDate, "yyyy-MM-dd"),
      cycleLength: data.cycleLength,
      note: data.note || undefined
    }, {
      onSuccess: () => toast({ title: "Cycle saved!" })
    });
  };

  const onPregnancySubmit = async (data: any) => {
    let dueDate: Date;
    if (data.method === "lmp") {
      dueDate = addDays(data.date, 280);
    } else {
      dueDate = addDays(data.date, 266);
    }

    const today = new Date();
    const lmpDate = data.method === "lmp" ? data.date : subDays(data.date, 14);
    const diffDays = differenceInDays(today, lmpDate);
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    let trimester = "First";
    if (weeks >= 27) trimester = "Third";
    else if (weeks >= 13) trimester = "Second";

    setPregnancyResult({ dueDate, weeks, days, trimester });

    await apiRequest("POST", "/api/pregnancy", {
      calculationMethod: data.method,
      referenceDate: format(data.date, "yyyy-MM-dd"),
      dueDate: format(dueDate, "yyyy-MM-dd")
    });
    queryClient.invalidateQueries({ queryKey: ["/api/pregnancy"] });
  };

  const onWeightSubmit = async (data: any) => {
    const bmi = data.preWeight / Math.pow(data.height / 100, 2);
    let range = "";
    let weekly = 0;

    if (bmi < 18.5) { range = "12.5 - 18 kg"; weekly = 0.5; }
    else if (bmi < 25) { range = "11.5 - 16 kg"; weekly = 0.4; }
    else if (bmi < 30) { range = "7 - 11.5 kg"; weekly = 0.3; }
    else { range = "5 - 9 kg"; weekly = 0.2; }

    let currentExpected = null;
    if (data.currentWeek) {
      if (data.currentWeek <= 12) currentExpected = 2;
      else currentExpected = 2 + (data.currentWeek - 12) * weekly;
    }

    setWeightResult({ bmi, range, currentExpected });

    await apiRequest("POST", "/api/weight", {
      weight: data.preWeight.toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      note: `Height: ${data.height}cm, Week: ${data.currentWeek}`
    });
  };

  const onPostpartumSubmit = async (data: any) => {
    const today = new Date();
    const diffDays = differenceInDays(today, data.deliveryDate);
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    let periodReturn = "Highly variable";
    if (data.breastfeeding === "yes") periodReturn = "Usually 6-18 months";
    else if (data.breastfeeding === "partial") periodReturn = "Usually 3-9 months";
    else periodReturn = "Usually 6-12 weeks";

    setPostpartumResult({ weeks, days, periodReturn });

    await apiRequest("POST", "/api/postpartum", {
      checkDate: format(today, "yyyy-MM-dd"),
      mood: 5,
      energy: 5,
      note: `Delivery: ${format(data.deliveryDate, "yyyy-MM-dd")}, BF: ${data.breastfeeding}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <Sparkles className="w-10 h-10 text-[#ff6b9d] mr-2" />
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-gray-900">Bloom</span><span className="text-[#ff6b9d]">Track</span>
            </h1>
          </motion.div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Understand your body's natural rhythm with our beautiful, simple fertility calculator.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-2 h-auto flex flex-wrap gap-2">
            <TabsTrigger value="fertility" className="flex-1 min-w-[140px] px-5 py-4 rounded-2xl font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-rose-400 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🌸</span>
                <span className="text-sm">Fertility Tracker</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="pregnancy" className="flex-1 min-w-[140px] px-5 py-4 rounded-2xl font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🤰</span>
                <span className="text-sm">Due Date</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex-1 min-w-[140px] px-5 py-4 rounded-2xl font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">📊</span>
                <span className="text-sm">Weight Tracker</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="postpartum" className="flex-1 min-w-[140px] px-5 py-4 rounded-2xl font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-400 data-[state=active]:text-white data-[state=active]:shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">💪</span>
                <span className="text-sm">Postpartum</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="fertility" key="fertility">
              <Card className="bg-white/95 border-pink-100 rounded-3xl shadow-2xl overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-3xl text-white">🌸</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Fertility & Ovulation Tracker</h2>
                      <p className="text-gray-600 text-sm mt-1">Track your cycle and find your most fertile days</p>
                    </div>
                  </div>

                  <form onSubmit={cycleForm.handleSubmit(onCycleSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">First Day of Last Period</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-14 justify-start text-left font-medium rounded-xl border-2 border-pink-200 bg-pink-50 hover:bg-pink-100 transition-all">
                            <CalendarIcon className="mr-2 h-5 w-5 text-pink-500" />
                            {format(cycleForm.watch("startDate"), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={cycleForm.watch("startDate")} onSelect={(d) => cycleForm.setValue("startDate", d || new Date())} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Average Cycle Length (days)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          {...cycleForm.register("cycleLength")}
                          className="w-full px-4 py-4 bg-pink-50 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all text-gray-700 font-medium"
                        />
                        <span className="absolute right-4 top-4 text-gray-400 text-sm">22-45 days</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold h-16 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 text-lg">
                      ✨ Calculate My Cycle
                    </Button>
                  </form>

                  {fertilityResult && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 border-l-4 border-red-400 rounded-xl p-5 flex items-start">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0"><CalendarIcon className="w-6 h-6 text-red-500" /></div>
                        <div className="ml-4">
                          <h3 class="text-sm font-bold text-gray-700 mb-1">Next Period Expected</h3>
                          <p class="text-lg font-semibold text-gray-900">{format(fertilityResult.nextPeriod, "PPP")}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-400 rounded-xl p-5 flex items-start">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><Sparkles className="w-6 h-6 text-emerald-500" /></div>
                        <div className="ml-4">
                          <h3 class="text-sm font-bold text-gray-700 mb-1">⭐ Best Conception Day (Peak Ovulation)</h3>
                          <p class="text-lg font-semibold text-gray-900">{format(fertilityResult.ovulationDay, "PPP")}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-xl p-5 flex items-start">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"><Activity className="w-6 h-6 text-amber-500" /></div>
                        <div className="ml-4">
                          <h3 class="text-sm font-bold text-gray-700 mb-1">Fertile Window</h3>
                          <p class="text-lg font-semibold text-gray-900">{format(fertilityResult.fertileWindowStart, "MMM d")} - {format(fertilityResult.fertileWindowEnd, "MMM d, yyyy")}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pregnancy" key="pregnancy">
              <Card className="bg-white/95 border-purple-100 rounded-3xl shadow-2xl overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-3xl text-white">🤰</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Pregnancy Due Date Calculator</h2>
                      <p className="text-gray-600 text-sm mt-1">Calculate your estimated due date and track pregnancy</p>
                    </div>
                  </div>

                  <form onSubmit={pregnancyForm.handleSubmit(onPregnancySubmit)} className="space-y-6">
                    <div className="bg-pink-50 p-4 rounded-xl flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" value="lmp" {...pregnancyForm.register("method")} className="mr-2 accent-purple-500" />
                        <span className="text-sm font-semibold">Last Period Date</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" value="conception" {...pregnancyForm.register("method")} className="mr-2 accent-purple-500" />
                        <span className="text-sm font-semibold">Conception Date</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {pregnancyForm.watch("method") === "lmp" ? "First Day of Last Period (LMP)" : "Conception Date"}
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-14 justify-start text-left font-medium rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100">
                            <CalendarIcon className="mr-2 h-5 w-5 text-purple-500" />
                            {format(pregnancyForm.watch("date"), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={pregnancyForm.watch("date")} onSelect={(d) => pregnancyForm.setValue("date", d || new Date())} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold h-16 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                      ✨ Calculate Due Date
                    </Button>
                  </form>

                  {pregnancyResult && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-400 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">🎉 Estimated Due Date (EDD)</h3>
                        <p className="text-2xl font-bold text-purple-600">{format(pregnancyResult.dueDate, "PPPP")}</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">📅 Current Pregnancy Status</h3>
                        <p className="text-lg font-semibold text-gray-900">{pregnancyResult.weeks} Weeks, {pregnancyResult.days} Days</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">👶 Trimester</h3>
                        <p className="text-lg font-semibold text-gray-900">{pregnancyResult.trimester} Trimester</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weight" key="weight">
              <Card className="bg-white/95 border-blue-100 rounded-3xl shadow-2xl overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-3xl text-white">📊</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Weight Gain Tracker</h2>
                      <p className="text-gray-600 text-sm mt-1">Track healthy weight gain throughout pregnancy</p>
                    </div>
                  </div>

                  <form onSubmit={weightForm.handleSubmit(onWeightSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Pre-pregnancy Weight (kg)</label>
                        <input type="number" {...weightForm.register("preWeight")} className="w-full px-4 py-4 bg-blue-50 border-2 border-blue-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Height (cm)</label>
                        <input type="number" {...weightForm.register("height")} className="w-full px-4 py-4 bg-blue-50 border-2 border-blue-200 rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Current Week</label>
                      <input type="number" {...weightForm.register("currentWeek")} className="w-full px-4 py-4 bg-blue-50 border-2 border-blue-200 rounded-xl" />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold h-16 rounded-2xl transition-all text-lg">
                      ✨ Calculate Range
                    </Button>
                  </form>

                  {weightResult && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-l-4 border-indigo-400 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-700">Your BMI</h3>
                        <p className="text-2xl font-bold text-indigo-600">{weightResult.bmi.toFixed(1)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-700">Recommended Range</h3>
                        <p className="text-lg font-semibold text-gray-900">{weightResult.range}</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="postpartum" key="postpartum">
              <Card className="bg-white/95 border-green-100 rounded-3xl shadow-2xl overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-3xl text-white">💪</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Postpartum Recovery</h2>
                      <p className="text-gray-600 text-sm mt-1">Monitor your recovery journey after delivery</p>
                    </div>
                  </div>

                  <form onSubmit={postpartumForm.handleSubmit(onPostpartumSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Delivery Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-14 justify-start text-left font-medium rounded-xl border-2 border-green-200 bg-green-50">
                            <CalendarIcon className="mr-2 h-5 w-5 text-green-500" />
                            {format(postpartumForm.watch("deliveryDate"), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={postpartumForm.watch("deliveryDate")} onSelect={(d) => postpartumForm.setValue("deliveryDate", d || new Date())} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl flex flex-wrap gap-4">
                      <label className="flex items-center"><input type="radio" value="yes" {...postpartumForm.register("breastfeeding")} className="mr-2" /> Yes, Exclusively</label>
                      <label className="flex items-center"><input type="radio" value="partial" {...postpartumForm.register("breastfeeding")} className="mr-2" /> Partially</label>
                      <label className="flex items-center"><input type="radio" value="no" {...postpartumForm.register("breastfeeding")} className="mr-2" /> No</label>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold h-16 rounded-2xl transition-all text-lg">
                      ✨ Calculate Timeline
                    </Button>
                  </form>

                  {postpartumResult && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-l-4 border-pink-400 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-700">Time Since Delivery</h3>
                        <p className="text-lg font-semibold text-gray-900">{postpartumResult.weeks} Weeks, {postpartumResult.days} Days</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-400 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-700">Expected Period Return</h3>
                        <p className="text-lg font-semibold text-gray-900">{postpartumResult.periodReturn}</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Info Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-2 font-semibold">
            <Info className="w-4 h-4" />
            <span>Important Information</span>
          </div>
          <p>This tool provides general estimates and information. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with your healthcare provider for medical concerns.</p>
        </div>
      </div>
    </div>
  );
}
