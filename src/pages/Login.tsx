
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole, Mail } from "lucide-react";

// Schema de validación para el formulario de login
const loginSchema = z.object({
  email: z.string().email("Ingrese un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

// Mockup de usuarios para demostración
const MOCK_USERS = [
  { email: "medico@ejemplo.com", password: "123456", role: "medico" },
  { email: "enfermera@ejemplo.com", password: "123456", role: "enfermera" },
  { email: "admin@ejemplo.com", password: "123456", role: "admin" }
];

// Función para simular autenticación
const mockAuth = (email: string, password: string) => {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  return user ? { success: true, user } : { success: false, message: "Credenciales incorrectas" };
};

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Verificar si el usuario ya está autenticado
  const isAuthenticated = localStorage.getItem("user");
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setIsLoggingIn(true);
    
    // Simulamos una llamada a API con delay
    setTimeout(() => {
      const result = mockAuth(values.email, values.password);
      
      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${result.user.role}`,
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Error de autenticación",
          description: result.message,
        });
      }
      
      setIsLoggingIn(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-health-700">Sistema de Historiales Médicos</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ingrese sus credenciales para continuar</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="nombre@ejemplo.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input type="password" placeholder="******" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-health-600 hover:bg-health-700"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            
            <div className="text-sm text-center text-muted-foreground">
              <p className="mt-2">Cuentas de demostración:</p>
              <p className="mt-1">medico@ejemplo.com / 123456</p>
              <p className="mt-1">enfermera@ejemplo.com / 123456</p>
              <p className="mt-1">admin@ejemplo.com / 123456</p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
