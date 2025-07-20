import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    role: "",
    especialidad: "",
    centroId: ""
  });
  const [loading, setLoading] = useState(false);
  const [centros, setCentros] = useState<any[]>([]);

  // Cargar centros disponibles
  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const { data, error } = await supabase
          .from('centros_salud')
          .select('*')
          .eq('activo', true);
        
        if (error) throw error;
        setCentros(data || []);
      } catch (error) {
        console.error('Error al cargar centros:', error);
        // Centros de fallback
        setCentros([
          { id: '1', nombre: 'Health Center 1', codigo_identificacion: 'HC001' },
          { id: '2', nombre: 'Health Center 2', codigo_identificacion: 'HC002' },
          { id: '3', nombre: 'Health Center 3', codigo_identificacion: 'HC003' }
        ]);
      }
    };
    fetchCentros();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Registrar en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            role: formData.role,
            especialidad: formData.especialidad,
            centro_id: formData.centroId
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Usuario registrado exitosamente. Revisa tu email para confirmar la cuenta.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-health-700">Registro</h1>
          <p className="text-muted-foreground mt-2">
            Crear una cuenta nueva
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Complete todos los campos para crear su cuenta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input 
                    id="nombre" 
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input 
                    id="apellido" 
                    value={formData.apellido}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="centro">Centro de Salud</Label>
                <Select value={formData.centroId} onValueChange={(value) => setFormData(prev => ({ ...prev, centroId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar centro de salud" />
                  </SelectTrigger>
                  <SelectContent>
                    {centros.map((centro) => (
                      <SelectItem key={centro.id} value={centro.id}>
                        {centro.nombre} ({centro.codigo_identificacion})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="enfermera">Enfermera</SelectItem>
                    <SelectItem value="familiar">Familiar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "medico" && (
                <div className="space-y-2">
                  <Label htmlFor="especialidad">Especialidad</Label>
                  <Input 
                    id="especialidad" 
                    value={formData.especialidad}
                    onChange={(e) => setFormData(prev => ({ ...prev, especialidad: e.target.value }))}
                    placeholder="Ej: Geriatría, Medicina General"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-health-600 hover:bg-health-700" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-health-600 hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;