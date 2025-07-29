import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  FolderOpen,
  Search
} from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  category: 'medical' | 'administrative' | 'patient' | 'reports';
  url?: string;
  thumbnail?: string;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
}

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Radiografia_Roberto_Perez.jpg",
    type: "image/jpeg",
    size: 2400000,
    uploadDate: new Date("2025-01-15"),
    category: "medical",
    thumbnail: "/placeholder.svg",
    uploadedBy: {
      id: "medico1",
      name: "Dr. Carlos Mendoza",
      role: "médico"
    }
  },
  {
    id: "2",
    name: "Informe_Laboratorio_Mayo.pdf",
    type: "application/pdf",
    size: 890000,
    uploadDate: new Date("2025-01-10"),
    category: "medical",
    uploadedBy: {
      id: "enfermera1",
      name: "Enfermera Patricia Silva",
      role: "enfermera"
    }
  },
  {
    id: "3",
    name: "Reporte_Mensual_Enero.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 1200000,
    uploadDate: new Date("2025-01-05"),
    category: "reports",
    uploadedBy: {
      id: "admin1",
      name: "Admin Sistema",
      role: "administrador"
    }
  },
  {
    id: "4",
    name: "Consentimiento_Informado.pdf",
    type: "application/pdf",
    size: 450000,
    uploadDate: new Date("2025-01-12"),
    category: "patient",
    uploadedBy: {
      id: "medico1",
      name: "Dr. Carlos Mendoza",
      role: "médico"
    }
  },
  {
    id: "5",
    name: "Politicas_Internas_2025.pdf",
    type: "application/pdf",
    size: 850000,
    uploadDate: new Date("2025-01-20"),
    category: "administrative",
    uploadedBy: {
      id: "admin2",
      name: "Gerente Administrativo",
      role: "gerente"
    }
  },
  {
    id: "6",
    name: "Manual_Procedimientos.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1200000,
    uploadDate: new Date("2025-01-18"),
    category: "administrative",
    uploadedBy: {
      id: "admin1",
      name: "Admin Sistema",
      role: "administrador"
    }
  },
  {
    id: "7",
    name: "Presupuesto_2025.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 950000,
    uploadDate: new Date("2025-01-22"),
    category: "administrative",
    uploadedBy: {
      id: "admin2",
      name: "Gerente Administrativo",
      role: "gerente"
    }
  }
];

export const FileUploadManager = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrar categorías según el rol del usuario
  const getAvailableCategories = () => {
    const allCategories = [
      { value: "all", label: "Todos los archivos", color: "bg-gray-100" },
      { value: "medical", label: "Médicos", color: "bg-blue-100" },
      { value: "patient", label: "Pacientes", color: "bg-green-100" },
      { value: "reports", label: "Reportes", color: "bg-purple-100" },
      { value: "administrative", label: "Administrativos", color: "bg-yellow-100" }
    ];

    // Si es admin, solo mostrar archivos administrativos y reportes
    if (user?.role === 'admin') {
      return [
        { value: "all", label: "Todos los archivos", color: "bg-gray-100" },
        { value: "reports", label: "Reportes", color: "bg-purple-100" },
        { value: "administrative", label: "Administrativos", color: "bg-yellow-100" }
      ];
    }

    return allCategories;
  };

  const categories = getAvailableCategories();

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (type === 'application/pdf') return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Simular progreso de carga
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const newFile: FileItem = {
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        category: user?.role === 'admin' ? 'administrative' : 'medical', // Admin sube archivos administrativos por defecto
        url: URL.createObjectURL(file),
        uploadedBy: {
          id: user?.id || 'unknown',
          name: user?.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : user?.email || 'Usuario desconocido',
          role: user?.role === 'admin' ? 'administrador' : user?.role === 'medico' ? 'médico' : user?.role === 'enfermera' ? 'enfermera' : 'usuario'
        }
      };

      setFiles(prev => [...prev, newFile]);
    }

    setUploading(false);
    setUploadProgress(0);
    toast.success(`${selectedFiles.length} archivo(s) subido(s) correctamente`);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Solo permitir eliminar si el usuario actual subió el archivo
    if (file.uploadedBy.id !== user?.id) {
      toast.error("No puedes eliminar un archivo que no subiste");
      return;
    }

    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success("Archivo eliminado");
  };

  const handleDownloadFile = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    }
    toast.success("Descarga iniciada");
  };
  
  // Verificar si el usuario puede eliminar un archivo
  const canDeleteFile = (file: FileItem) => {
    return file.uploadedBy.id === user?.id;
  };

  // Filtrar archivos según el rol del usuario
  const getFilteredFiles = () => {
    let availableFiles = files;
    
    // Si es admin, solo mostrar archivos administrativos y reportes
    if (user?.role === 'admin') {
      availableFiles = files.filter(file => 
        file.category === 'administrative' || file.category === 'reports'
      );
    }
    
    // Aplicar filtros de categoría y búsqueda
    return availableFiles.filter(file => {
      const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filteredFiles = getFilteredFiles();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Gestión de Archivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {user?.role === 'admin' 
                ? 'Arrastra archivos administrativos aquí o haz clic para seleccionar'
                : 'Arrastra archivos aquí o haz clic para seleccionar'
              }
            </p>
            <p className="text-sm text-gray-500">
              {user?.role === 'admin' 
                ? 'PDF, documentos de Office - Archivos administrativos y reportes (máximo 10MB)'
                : 'PDF, imágenes, documentos de Office (máximo 10MB por archivo)'
              }
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subiendo archivos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar archivos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="text-xs"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{file.name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-xs text-blue-600">
                      Subido por: {file.uploadedBy.name} ({file.uploadedBy.role})
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={categories.find(c => c.value === file.category)?.color}
                >
                  {categories.find(c => c.value === file.category)?.label}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPreviewFile(file)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{file.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={file.url || file.thumbnail} 
                          alt={file.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          {getFileIcon(file.type)}
                          <p className="mt-2 text-sm text-gray-500">
                            Vista previa no disponible para este tipo de archivo
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadFile(file)}
                >
                  <Download className="h-3 w-3" />
                </Button>

                {canDeleteFile(file) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="text-gray-400 cursor-not-allowed"
                    title="No puedes eliminar archivos que no subiste"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <File className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No se encontraron archivos</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};