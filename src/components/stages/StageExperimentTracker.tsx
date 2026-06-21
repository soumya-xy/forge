"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Clock, Play, Pause, TrendingUp } from "lucide-react";
import { ExperimentLog } from "@/types/types";

interface StageExperimentTrackerProps {
  experimentName: string;
  experimentId: string;
  existingLogs?: ExperimentLog[];
  onLogSubmit: (log: Omit<ExperimentLog, 'id' | 'started_at'>) => void;
  isLoading?: boolean;
}

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-stone-500', icon: Clock },
  running: { label: 'Running', color: 'bg-blue-500', icon: Play },
  completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle2 },
  abandoned: { label: 'Abandoned', color: 'bg-red-500', icon: AlertCircle },
};

export default function StageExperimentTracker({
  experimentName,
  experimentId,
  existingLogs = [],
  onLogSubmit,
  isLoading = false,
}: StageExperimentTrackerProps) {
  const [outreachCount, setOutreachCount] = useState('');
  const [responseCount, setResponseCount] = useState('');
  const [conversionCount, setConversionCount] = useState('');
  const [hoursSpent, setHoursSpent] = useState('');
  const [notes, setNotes] = useState('');
  const [hypothesisValidated, setHypothesisValidated] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!hoursSpent || hypothesisValidated === null) return;

    const confidenceShift = hypothesisValidated ? 10 : -10;

    onLogSubmit({
      experiment_id: experimentId,
      completed_at: new Date().toISOString(),
      status: hypothesisValidated ? 'completed' : 'abandoned',
      metrics: {
        outreach_count: outreachCount ? parseInt(outreachCount) : undefined,
        response_count: responseCount ? parseInt(responseCount) : undefined,
        conversion_count: conversionCount ? parseInt(conversionCount) : undefined,
        hours_spent: parseFloat(hoursSpent),
        notes: notes || undefined,
      },
      outcome_summary: notes,
      hypothesis_validated: hypothesisValidated,
      confidence_shift: confidenceShift,
    });

    // Reset form
    setOutreachCount('');
    setResponseCount('');
    setConversionCount('');
    setHoursSpent('');
    setNotes('');
    setHypothesisValidated(null);
  };

  // Calculate stats from existing logs
  const completedLogs = existingLogs.filter((l) => l.status === 'completed');
  const totalHours = existingLogs.reduce((sum, log) => sum + (log.metrics?.hours_spent || 0), 0);
  const totalOutreach = existingLogs.reduce((sum, log) => sum + (log.metrics?.outreach_count || 0), 0);
  const totalConversions = existingLogs.reduce((sum, log) => sum + (log.metrics?.conversion_count || 0), 0);

  return (
    <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl max-w-4xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-headline tracking-tight text-[#1A1A1A]">
          Experiment Tracker
        </CardTitle>
        <CardDescription className="text-sm text-[#1A1A1A]/70 font-body max-w-md mx-auto mt-2">
          Track your progress on "{experimentName}". Log real results to update risk analysis.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Summary */}
        {existingLogs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-stone-200 text-center">
              <div className="text-2xl font-bold text-primary font-headline">{existingLogs.length}</div>
              <div className="text-xs text-[#1A1A1A]/60 font-body mt-1">Experiments</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-stone-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-headline">{totalHours}h</div>
              <div className="text-xs text-[#1A1A1A]/60 font-body mt-1">Time Invested</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-stone-200 text-center">
              <div className="text-2xl font-bold text-green-600 font-headline">{totalOutreach}</div>
              <div className="text-xs text-[#1A1A1A]/60 font-body mt-1">Outreach</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-stone-200 text-center">
              <div className="text-2xl font-bold text-amber-600 font-headline">{totalConversions}</div>
              <div className="text-xs text-[#1A1A1A]/60 font-body mt-1">Conversions</div>
            </div>
          </div>
        )}

        {/* Log Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1A1A1A] font-headline">Log Experiment Results</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/70 font-body">Outreach Count</label>
              <Input
                type="number"
                placeholder="Emails sent, interviews..."
                value={outreachCount}
                onChange={(e) => setOutreachCount(e.target.value)}
                disabled={isLoading}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/70 font-body">Response Count</label>
              <Input
                type="number"
                placeholder="Replies, completions..."
                value={responseCount}
                onChange={(e) => setResponseCount(e.target.value)}
                disabled={isLoading}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/70 font-body">Conversion Count</label>
              <Input
                type="number"
                placeholder="Signups, purchases..."
                value={conversionCount}
                onChange={(e) => setConversionCount(e.target.value)}
                disabled={isLoading}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/70 font-body">Hours Spent *</label>
              <Input
                type="number"
                step="0.5"
                placeholder="Time invested"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
                disabled={isLoading}
                className="bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]/70 font-body">Notes</label>
              <Textarea
                placeholder="What did you learn? Any surprises?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                className="min-h-[60px] bg-white resize-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[#1A1A1A]/70 font-body">Was your hypothesis validated? *</label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={hypothesisValidated === true ? 'default' : 'outline'}
                onClick={() => setHypothesisValidated(true)}
                disabled={isLoading}
                className={`flex-1 ${hypothesisValidated === true ? 'bg-green-600 hover:bg-green-700' : 'bg-white hover:bg-green-50'}`}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Yes - Hypothesis Validated
              </Button>
              <Button
                type="button"
                variant={hypothesisValidated === false ? 'default' : 'outline'}
                onClick={() => setHypothesisValidated(false)}
                disabled={isLoading}
                className={`flex-1 ${hypothesisValidated === false ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-red-50'}`}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                No - Hypothesis Rejected
              </Button>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !hoursSpent || hypothesisValidated === null}
            className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Log Experiment Results
          </Button>
        </div>

        {/* Recent Logs */}
        {existingLogs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1A1A1A] font-headline">Recent Logs</h3>
            <div className="space-y-2">
              {existingLogs.slice(-3).reverse().map((log) => {
                const statusConfig = STATUS_CONFIG[log.status];
                const StatusIcon = statusConfig.icon;
                return (
                  <div key={log.id} className="p-3 bg-white rounded-lg border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${statusConfig.color}/10`}>
                          <StatusIcon className={`w-3 h-3 ${statusConfig.color.replace('bg-', 'text-')}`} />
                        </div>
                        <span className="text-sm font-medium text-[#1A1A1A] font-headline">
                          {statusConfig.label}
                        </span>
                      </div>
                      <Badge
                        variant={log.confidence_shift > 0 ? 'default' : 'secondary'}
                        className={`text-xs ${
                          log.confidence_shift > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {log.confidence_shift > 0 ? '+' : ''}
                        {log.confidence_shift}% confidence
                      </Badge>
                    </div>
                    {log.metrics?.notes && (
                      <p className="text-xs text-[#1A1A1A]/70 font-body">{log.metrics.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
