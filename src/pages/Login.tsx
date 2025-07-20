
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authService } from "@/lib/auth";
import { userValidationSchema } from "@/lib/security";
import { z } from "zod";
import { useCenterConfig } from "@/hooks/useCenterConfig";

// Esquema de validación para login
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(1, 'Contraseña requerida')
});

const Login = () => {
  const centerConfig = useCenterConfig();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Verificar si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        // No hay sesión activa, continuar en login
      }
    };
    checkSession();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      // Validar entrada
      const validatedData = loginSchema.parse({ email, password });
      
      // Autenticar con Supabase
      const user = await authService.signIn(validatedData.email, validatedData.password);
      
      // Guardar usuario en localStorage para persistencia
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(`Bienvenido, ${user.nombre}`);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: {[key: string]: string} = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        toast.error(error.message === 'Invalid login credentials' 
          ? 'Credenciales incorrectas' 
          : 'Error al iniciar sesión');
      } else {
        toast.error("Error inesperado al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validar email
      const emailSchema = z.string().email('Email inválido');
      emailSchema.parse(resetEmail);
      
      await authService.resetPassword(resetEmail);
      setResetEmailSent(true);
      toast.success("Se ha enviado un correo con instrucciones para restablecer la contraseña");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Email inválido");
      } else {
        toast.error("Error al enviar el correo de restablecimiento");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-health-700 flex items-center justify-center">
            <span className="bg-health-100 text-health-700 p-2 rounded mr-3">HC</span>
            {centerConfig.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            {centerConfig.description}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ejemplo@correo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0 text-xs" type="button">
                        ¿Olvidó su contraseña?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Restablecer contraseña</DialogTitle>
                        <DialogDescription>
                          Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
                        </DialogDescription>
                      </DialogHeader>
                      {!resetEmailSent ? (
                        <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Correo electrónico</Label>
                            <Input 
                              id="reset-email" 
                              type="email" 
                              placeholder="ejemplo@correo.com" 
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="w-full" disabled={loading}>
                              {loading ? "Enviando..." : "Enviar instrucciones"}
                            </Button>
                          </DialogFooter>
                        </form>
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-green-600 mb-4">
                            Se ha enviado un correo con instrucciones para restablecer su contraseña.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Verifique su bandeja de entrada y siga las instrucciones.
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                  required
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="text-sm text-muted-foreground">
                <span>Nota de seguridad:</span>
                <p className="mt-1">
                  Este sistema usa autenticación segura con Supabase. 
                  Contacte al administrador para obtener sus credenciales.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-health-600 hover:bg-health-700" type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-health-600 hover:underline">
                  Registrarse
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
