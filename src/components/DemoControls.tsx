import { useDemoStore } from '@/stores/demoStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Settings, Info } from 'lucide-react';
import { toast } from 'sonner';

export const DemoControls = () => {
  const { isDemoMode, setDemoMode, resetDemoData } = useDemoStore();

  const handleResetDemo = () => {
    resetDemoData();
    toast.success('Datos demo reiniciados');
  };

  const toggleDemoMode = () => {
    setDemoMode(!isDemoMode);
    toast.info(isDemoMode ? 'Modo demo desactivado' : 'Modo demo activado');
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Badge variant={isDemoMode ? "default" : "secondary"} className="flex items-center gap-1">
        <Info className="h-3 w-3" />
        {isDemoMode ? 'MODO DEMO' : 'MODO REAL'}
      </Badge>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleResetDemo}
        className="flex items-center gap-1"
      >
        <RotateCcw className="h-3 w-3" />
        Reset Demo
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDemoMode}
        className="flex items-center gap-1"
      >
        <Settings className="h-3 w-3" />
        {isDemoMode ? 'Modo Real' : 'Modo Demo'}
      </Button>
    </div>
  );
};