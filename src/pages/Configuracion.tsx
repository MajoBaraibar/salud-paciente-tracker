
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Type, UserCog } from "lucide-react";
import { toast } from "sonner";

const Configuracion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<number[]>([16]);
  const [fontFamily, setFontFamily] = useState("system-ui");
  const [highContrast, setHighContrast] = useState(false);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }
    
    // Load user preferences from localStorage
    const preferences = localStorage.getItem("userPreferences");
    if (preferences) {
      const parsed = JSON.parse(preferences);
      setIsDarkMode(parsed.darkMode || false);
      setFontSize([parsed.fontSize || 16]);
      setFontFamily(parsed.fontFamily || "system-ui");
      setHighContrast(parsed.highContrast || false);
      setAnimations(parsed.animations !== false);
      
      // Apply theme
      if (parsed.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      // Apply font size
      document.documentElement.style.fontSize = `${parsed.fontSize || 16}px`;
      
      // Apply font family
      document.body.style.fontFamily = parsed.fontFamily || "system-ui, sans-serif";
    }
    
    setLoading(false);
  }, [navigate]);

  // Save preferences
  const savePreferences = () => {
    const preferences = {
      darkMode: isDarkMode,
      fontSize: fontSize[0],
      fontFamily,
      highContrast,
      animations
    };
    
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    
    // Apply changes
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    document.documentElement.style.fontSize = `${fontSize[0]}px`;
    document.body.style.fontFamily = `${fontFamily}, sans-serif`;
    
    toast.success("Preferencias guardadas correctamente");
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-health-700 mb-6">Configuración</h1>
            
            <Tabs defaultValue="apariencia">
              <TabsList className="mb-6">
                <TabsTrigger value="apariencia" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Apariencia</span>
                </TabsTrigger>
                <TabsTrigger value="cuenta" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span>Cuenta</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="apariencia">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalización de la interfaz</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Modo oscuro</Label>
                        <div className="text-sm text-muted-foreground">
                          Cambia el tema de la aplicación
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch
                          id="dark-mode"
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="font-size">Tamaño de letra</Label>
                        <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                      </div>
                      <Slider
                        id="font-size"
                        min={12}
                        max={24}
                        step={1}
                        value={fontSize}
                        onValueChange={setFontSize}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Pequeño</span>
                        <span>Mediano</span>
                        <span>Grande</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Tipo de letra</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger id="font-family">
                          <SelectValue placeholder="Seleccionar tipo de letra" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system-ui">Predeterminado del sistema</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="high-contrast">Alto contraste</Label>
                        <div className="text-sm text-muted-foreground">
                          Mejora la visibilidad para personas con discapacidad visual
                        </div>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={highContrast}
                        onCheckedChange={setHighContrast}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="animations">Animaciones</Label>
                        <div className="text-sm text-muted-foreground">
                          Activa o desactiva las animaciones de la interfaz
                        </div>
                      </div>
                      <Switch
                        id="animations"
                        checked={animations}
                        onCheckedChange={setAnimations}
                      />
                    </div>
                    
                    <Button onClick={savePreferences} className="w-full">
                      Guardar preferencias
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cuenta">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de la cuenta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Las opciones de cuenta se implementarán próximamente.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Configuracion;
