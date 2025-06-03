
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
      className={`${onClick ? 'cursor-pointer transition-all hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-2 ${iconColor} rounded-full`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
