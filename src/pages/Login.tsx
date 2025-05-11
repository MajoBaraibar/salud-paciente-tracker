
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserType } from "@/types";

// Datos de ejemplo para los usuarios
const usuarios: UserType[] = [
  {
    id: "1",
    email: "medico@example.com",
    role: "medico",
    nombre: "Dr. Martínez",
    especialidad: "Medicina General"
  },
  {
    id: "2",
    email: "enfermera@example.com",
    role: "enfermera",
    nombre: "Enf. Rodríguez"
  },
  {
    id: "3",
    email: "admin@example.com",
    role: "admin",
    nombre: "Admin López"
  },
  {
    id: "4",
    email: "familiar@example.com",
    role: "familiar",
    nombre: "Ana",
    apellido: "González",
    pacienteId: "1" // ID del paciente relacionado
  }
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // Verificar si ya hay sesión activa
  if (localStorage.getItem("user")) {
    navigate("/dashboard");
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulamos una petición a un API
    setTimeout(() => {
      const usuario = usuarios.find(u => u.email === email);
      
      if (usuario && password === "password") {
        localStorage.setItem("user", JSON.stringify({
          id: usuario.id,
          email: usuario.email,
          role: usuario.role,
          nombre: usuario.nombre,
          pacienteId: usuario.pacienteId // Solo para familiares
        }));
        
        toast.success(`Bienvenido, ${usuario.nombre}`);
        navigate("/dashboard");
      } else {
        toast.error("Credenciales incorrectas");
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulación del envío de email
    setTimeout(() => {
      const usuario = usuarios.find(u => u.email === resetEmail);
      
      if (usuario) {
        setResetEmailSent(true);
        toast.success("Se ha enviado un correo con instrucciones para restablecer la contraseña");
      } else {
        toast.error("Email no encontrado");
      }
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-health-700 flex items-center justify-center">
            <span className="bg-health-100 text-health-700 p-2 rounded mr-3">HC</span>
            HealthCenter
          </h1>
          <p className="text-muted-foreground mt-2">
            Centro de atención y cuidado para adultos mayores
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
                  required
                />
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
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <span>Para probar, use:</span>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>medico@example.com / password</li>
                  <li>enfermera@example.com / password</li>
                  <li>admin@example.com / password</li>
                  <li>familiar@example.com / password</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-health-600 hover:bg-health-700" type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
