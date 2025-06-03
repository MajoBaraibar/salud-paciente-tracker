
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  userEmail: string;
  userRole: string;
  avatarFallback: string;
}

export const DashboardHeader = ({ 
  title, 
  subtitle, 
  userEmail, 
  userRole, 
  avatarFallback 
}: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-health-700">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-health-200 text-health-700">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <p className="font-medium">{userEmail}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
