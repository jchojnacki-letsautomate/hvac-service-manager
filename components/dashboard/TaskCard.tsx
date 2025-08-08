import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

type TaskPriority = "normal" | "urgent" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: string;
  type: string;
}

interface TaskCardProps {
  title: string;
  tasks: Task[];
  className?: string;
  onViewAll?: () => void;
}

export function TaskCard({ title, tasks, className, onViewAll }: TaskCardProps) {
  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="size-4 text-destructive" />;
      case "completed":
        return <CheckCircle className="size-4 text-emerald-500" />;
      case "normal":
      default:
        return <Clock className="size-4 text-brand-orange" />;
    }
  };
  
  const getPriorityBadge = (type: string) => {
    switch (type) {
      case "Przegląd":
        return <Badge variant="outline" className="shrink-0 border-brand-blue text-brand-blue">{type}</Badge>;
      case "Awaria":
        return <Badge variant="outline" className="shrink-0 border-destructive text-destructive">{type}</Badge>;
      case "Zlecenie":
        return <Badge variant="outline" className="shrink-0 border-brand-blue text-brand-blue">{type}</Badge>;
      case "Płatność":
        return <Badge variant="outline" className="shrink-0 border-emerald-500 text-emerald-500">{type}</Badge>;
      default:
        return <Badge variant="outline" className="shrink-0 border-brand-orange text-brand-orange">{type}</Badge>;
    }
  };
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onViewAll && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewAll}
              className="text-brand-blue hover:text-brand-blue/80"
            >
              Zobacz wszystkie
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">Brak zadań do wyświetlenia</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border hover:border-brand-blue transition-colors">
                <div className="mt-0.5">{getPriorityIcon(task.priority)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate">{task.title}</h4>
                    {getPriorityBadge(task.type)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-sm mt-2">
                      <span className="text-muted-foreground">Termin:</span> {task.dueDate}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}