import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../ui/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground">{title}</p>
            <h3 className="mt-2 flex items-baseline gap-1">
              <span>{value}</span>
              {trend && (
                <span className={cn(
                  "text-sm",
                  trend.isPositive ? "text-brand-orange" : "text-rose-500"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="rounded-md bg-brand-blue/10 p-2 text-brand-blue">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}