import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  iconClassName?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp, className, iconClassName }: StatCardProps) => {
  return (
    <div className={cn("stat-card flex items-start justify-between", className)}>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="mt-2 text-3xl font-bold font-display text-foreground">{value}</p>
        {trend && (
          <p className={cn(
            "mt-1 text-xs font-medium",
            trendUp ? "text-success" : "text-destructive"
          )}>
            {trend}
          </p>
        )}
      </div>
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl",
        iconClassName || "bg-primary/10 text-primary"
      )}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatCard;
