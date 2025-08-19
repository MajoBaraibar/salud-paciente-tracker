
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
    <div className="flex items-center justify-between p-6 mb-8 glass-effect rounded-xl fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold gradient-text tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-white/30">
          <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <p className="font-semibold text-foreground">{userEmail}</p>
            <p className="text-sm text-muted-foreground capitalize bg-primary/10 px-2 py-1 rounded-md">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
