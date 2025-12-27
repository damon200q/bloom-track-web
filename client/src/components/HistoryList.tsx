import { useCycles, useDeleteCycle } from "@/hooks/use-cycles";
import { format, parseISO } from "date-fns";
import { Trash2, CalendarHeart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function HistoryList() {
  const { data: cycles, isLoading } = useCycles();
  const deleteCycle = useDeleteCycle();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-bold text-gray-800">History</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!cycles || cycles.length === 0) {
    return null;
  }

  // Sort by date descending (newest first)
  const sortedCycles = [...cycles].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCycle.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center space-x-2">
        <CalendarHeart className="text-primary w-6 h-6" />
        <h3 className="text-2xl font-bold text-gray-800">Previous Cycles</h3>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {sortedCycles.map((cycle) => (
            <motion.div
              key={cycle.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4 flex items-center justify-between group hover:border-primary/30 transition-colors"
            >
              <div>
                <p className="font-bold text-gray-800">
                  Started {format(new Date(cycle.startDate), "MMMM d, yyyy")}
                </p>
                <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                  <span>Length: {cycle.cycleLength} days</span>
                  {cycle.note && (
                    <span className="hidden sm:inline-block truncate max-w-[200px] border-l pl-4 border-gray-200">
                      {cycle.note}
                    </span>
                  )}
                </div>
              </div>

              <AlertDialog open={deleteId === cycle.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(cycle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the cycle record starting on {format(new Date(cycle.startDate), "MMM d, yyyy")}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
