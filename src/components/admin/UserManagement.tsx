
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Edit, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin?: string;
};

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Dr. Juan Pérez", email: "jperez@healthcenter.com", role: "medico", status: "active", lastLogin: "2025-05-11T15:30:00" },
    { id: "2", name: "Lic. María Rodríguez", email: "mrodriguez@healthcenter.com", role: "enfermera", status: "active", lastLogin: "2025-05-12T08:20:00" },
    { id: "3", name: "Adm. Carlos Gómez", email: "cgomez@healthcenter.com", role: "admin", status: "active", lastLogin: "2025-05-12T09:45:00" },
    { id: "4", name: "Dra. Ana Martínez", email: "amartinez@healthcenter.com", role: "medico", status: "active", lastLogin: "2025-05-10T11:15:00" },
    { id: "5", name: "Jorge Ramírez", email: "jramirez@healthcenter.com", role: "familiar", status: "active", lastLogin: "2025-05-08T14:30:00" },
    { id: "6", name: "Lucía Fernández", email: "lfernandez@healthcenter.com", role: "familiar", status: "inactive" },
    { id: "7", name: "Pedro Santos", email: "psantos@healthcenter.com", role: "enfermera", status: "active", lastLogin: "2025-05-11T07:50:00" },
  ]);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "enfermera",
    status: "active"
  });
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle user edit
  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };
  
  // Handle user update
  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setEditingUser(null);
    toast.success("Usuario actualizado correctamente");
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("Usuario eliminado correctamente");
  };
  
  // Handle new user creation
  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    
    const newUserId = `${users.length + 1}`;
    setUsers([...users, {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status as "active" | "inactive" || "active"
    }]);
    
    // Reset new user form
    setNewUser({
      name: "",
      email: "",
      role: "enfermera",
      status: "active"
    });
    
    toast.success("Usuario creado correctamente");
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "medico":
        return "bg-blue-100 text-blue-700";
      case "enfermera":
        return "bg-green-100 text-green-700";
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "familiar":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  // Format role name for display
  const formatRole = (role: string) => {
    switch (role) {
      case "medico":
        return "Médico";
      case "enfermera":
        return "Enfermero/a";
      case "admin":
        return "Administrador";
      case "familiar":
        return "Familiar";
      default:
        return role;
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Gestión de Usuarios</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nombre y apellido"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="enfermera">Enfermero/a</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="familiar">Familiar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser({...newUser, status: value as "active" | "inactive"})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser}>
                Crear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuarios por nombre, email o rol..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {formatRole(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "outline"} className={
                        user.status === "active" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100" 
                          : "border-gray-300 text-gray-500"
                      }>
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          {editingUser && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Usuario</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Nombre completo</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-email">Correo electrónico</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-role">Rol</Label>
                                  <Select
                                    value={editingUser.role}
                                    onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                                  >
                                    <SelectTrigger id="edit-role">
                                      <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="medico">Médico</SelectItem>
                                      <SelectItem value="enfermera">Enfermero/a</SelectItem>
                                      <SelectItem value="admin">Administrador</SelectItem>
                                      <SelectItem value="familiar">Familiar</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-status">Estado</Label>
                                  <Select
                                    value={editingUser.status}
                                    onValueChange={(value) => setEditingUser({...editingUser, status: value as "active" | "inactive"})}
                                  >
                                    <SelectTrigger id="edit-status">
                                      <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Activo</SelectItem>
                                      <SelectItem value="inactive">Inactivo</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleUpdateUser}>
                                  Guardar cambios
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No se encontraron usuarios que coincidan con la búsqueda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
