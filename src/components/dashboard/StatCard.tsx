
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  onClick?: () => void;
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  onClick,
  className = ""
}: StatCardProps) => {
  return (
    <Card 
      className={`stat-card group ${className} slide-in-up`}
      onClick={onClick}
    >
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">{value}</p>
          </div>
          <div className={`p-3 ${iconColor} rounded-xl shadow-lg float-animation group-hover:pulse-glow transition-all duration-300`}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-700"></div>
      </CardContent>
    </Card>
  );
};
