
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreVertical, Edit, Trash2, AtSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Anuncio = {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: Date;
  tags: string[];
}

const mockAnuncios: Anuncio[] = [
  {
    id: "1",
    author: "Carlos Méndez",
    authorRole: "Enfermero Jefe",
    content: "Ojo con Claudia que hoy se levantó de mal humor y quiere estar sola. Tratar con cuidado.",
    timestamp: new Date(2025, 4, 10, 8, 15),
    tags: ["Turno Mañana", "Personal"]
  },
  {
    id: "2",
    author: "María López",
    authorRole: "Médica",
    content: "Se realizará mantenimiento en el ala este mañana de 10:00 a 12:00. Por favor programen las visitas fuera de ese horario.",
    timestamp: new Date(2025, 4, 10, 15, 30),
    tags: ["Importante", "Instalaciones"]
  },
  {
    id: "3",
    author: "Roberto Gómez",
    authorRole: "Administración",
    content: "@enfermeros Recordatorio: La reunión del personal se realizará el viernes a las 14:00 en la sala de conferencias. Es obligatoria la asistencia.",
    timestamp: new Date(2025, 4, 9, 10, 45),
    tags: ["Reunión", "Obligatorio"]
  }
];

const userGroups = [
  "administración", 
  "enfermeros", 
  "médicos", 
  "limpieza", 
  "seguridad", 
  "recepción",
  "técnicos",
  "laboratorio"
];

export default function Anuncios() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(mockAnuncios);
  const [nuevoAnuncio, setNuevoAnuncio] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const [mentionDropdownVisible, setMentionDropdownVisible] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editingAnuncio, setEditingAnuncio] = useState<Anuncio | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [anuncioToDelete, setAnuncioToDelete] = useState<string | null>(null);

  const availableTags = [
    "Importante", 
    "Turno Mañana", 
    "Turno Tarde",
    "Turno Noche", 
    "Personal", 
    "Pacientes", 
    "Instalaciones",
    "Reunión",
    "Obligatorio"
  ];

  useEffect(() => {
    const checkForMentions = () => {
      if (!textareaRef.current) return;

      const text = nuevoAnuncio;
      const cursorPosition = textareaRef.current.selectionStart;
      
      // Buscar la última @ antes del cursor
      const beforeCursor = text.slice(0, cursorPosition);
      const atIndex = beforeCursor.lastIndexOf('@');
      
      if (atIndex !== -1 && (atIndex === 0 || beforeCursor[atIndex - 1] === ' ')) {
        const query = beforeCursor.slice(atIndex + 1);
        setMentionQuery(query);
        
        // Obtener posición para el dropdown
        const textBeforeAt = beforeCursor.slice(0, atIndex);
        const lines = textBeforeAt.split('\n');
        const lineIndex = lines.length - 1;
        const linePosition = lines[lineIndex].length;
        
        // Calcular posición aproximada
        const rect = textareaRef.current.getBoundingClientRect();
        const lineHeight = 24; // Altura aproximada de línea
        
        setMentionPosition({
          top: rect.top + lineHeight * lineIndex + 30,
          left: rect.left + linePosition * 8
        });
        
        setMentionDropdownVisible(true);
      } else {
        setMentionDropdownVisible(false);
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('input', checkForMentions);
      textarea.addEventListener('click', checkForMentions);
      textarea.addEventListener('keyup', checkForMentions);
    }
    
    return () => {
      if (textarea) {
        textarea.removeEventListener('input', checkForMentions);
        textarea.removeEventListener('click', checkForMentions);
        textarea.removeEventListener('keyup', checkForMentions);
      }
    };
  }, [nuevoAnuncio]);

  const insertMention = (group: string) => {
    if (!textareaRef.current) return;
    
    const text = nuevoAnuncio;
    const cursorPosition = textareaRef.current.selectionStart;
    const beforeCursor = text.slice(0, cursorPosition);
    const afterCursor = text.slice(cursorPosition);
    
    const atIndex = beforeCursor.lastIndexOf('@');
    const newText = beforeCursor.slice(0, atIndex) + 
                    `@${group} ` + 
                    afterCursor;
    
    setNuevoAnuncio(newText);
    setMentionDropdownVisible(false);
    
    // Focus y posicionar cursor después de la mención
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = atIndex + group.length + 2; // @ + grupo + espacio
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (!nuevoAnuncio.trim()) {
      toast({
        title: "Error",
        description: "El anuncio no puede estar vacío",
        variant: "destructive"
      });
      return;
    }

    if (editingAnuncio) {
      // Actualizar anuncio existente
      const updatedAnuncios = anuncios.map(anuncio => 
        anuncio.id === editingAnuncio.id 
          ? {...anuncio, content: nuevoAnuncio, tags: selectedTags, timestamp: new Date()} 
          : anuncio
      );
      setAnuncios(updatedAnuncios);
      toast({
        title: "Anuncio actualizado",
        description: "Tu anuncio ha sido actualizado correctamente"
      });
      setEditingAnuncio(null);
    } else {
      // Crear nuevo anuncio
      const newAnuncio: Anuncio = {
        id: Date.now().toString(),
        author: "Usuario Actual", // En una implementación real esto vendría del usuario logueado
        authorRole: "Médico", // En una implementación real esto vendría del usuario logueado
        content: nuevoAnuncio,
        timestamp: new Date(),
        tags: selectedTags
      };

      setAnuncios([newAnuncio, ...anuncios]);
      toast({
        title: "Anuncio publicado",
        description: "Tu anuncio ha sido publicado correctamente"
      });
    }
    
    setNuevoAnuncio("");
    setSelectedTags([]);
  };

  const handleEditAnuncio = (anuncio: Anuncio) => {
    setEditingAnuncio(anuncio);
    setNuevoAnuncio(anuncio.content);
    setSelectedTags(anuncio.tags);
  };

  const handleDeleteAnuncio = (anuncioId: string) => {
    setAnuncioToDelete(anuncioId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (anuncioToDelete) {
      const updatedAnuncios = anuncios.filter(anuncio => anuncio.id !== anuncioToDelete);
      setAnuncios(updatedAnuncios);
      toast({
        title: "Anuncio eliminado",
        description: "El anuncio ha sido eliminado correctamente"
      });
      setDeleteConfirmOpen(false);
      setAnuncioToDelete(null);
    }
  };

  // Esta función resalta las menciones en el contenido del anuncio
  const renderContent = (content: string) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /@(\w+)/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // Texto antes de la mención
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      // La mención
      const mention = match[0];
      parts.push(
        <Badge 
          key={`${match.index}-${match[1]}`} 
          variant="secondary" 
          className="bg-blue-100 text-blue-800 rounded-sm font-normal"
        >
          {mention}
        </Badge>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Texto restante después de la última mención
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return <>{parts}</>;
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Tablón de Anuncios</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingAnuncio ? "Editar Anuncio" : "Nuevo Anuncio"}</CardTitle>
            <CardDescription>
              Comparte información importante con el resto del personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex mb-2 items-center">
                <AtSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Mencionar a un grupo (ej: @enfermeros)</span>
              </div>
              <Textarea 
                placeholder="Escribe tu anuncio aquí..." 
                value={nuevoAnuncio}
                onChange={(e) => setNuevoAnuncio(e.target.value)}
                className="mb-4"
                ref={textareaRef}
              />
              
              {mentionDropdownVisible && (
                <Card className="absolute z-10 w-48" 
                      style={{top: `${mentionPosition.top}px`, left: `${mentionPosition.left}px`}}>
                  <CardContent className="p-1">
                    {userGroups
                      .filter(group => group.includes(mentionQuery.toLowerCase()))
                      .map(group => (
                        <Button 
                          key={group} 
                          variant="ghost" 
                          className="w-full justify-start text-left text-sm py-1 h-auto"
                          onClick={() => insertMention(group)}
                        >
                          @{group}
                        </Button>
                      ))
                    }
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-muted-foreground mr-2">Etiquetas:</span>
              {availableTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            {editingAnuncio && (
              <Button variant="outline" className="mr-2" onClick={() => {
                setEditingAnuncio(null);
                setNuevoAnuncio("");
                setSelectedTags([]);
              }}>
                Cancelar
              </Button>
            )}
            <Button onClick={handleSubmit}>
              {editingAnuncio ? "Actualizar Anuncio" : "Publicar Anuncio"}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          {anuncios.map((anuncio) => (
            <Card key={anuncio.id} className="border-l-4 border-l-health-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{anuncio.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{anuncio.author}</h3>
                      <p className="text-sm text-muted-foreground">{anuncio.authorRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {format(anuncio.timestamp, "d 'de' MMMM, HH:mm", { locale: es })}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditAnuncio(anuncio)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteAnuncio(anuncio.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{renderContent(anuncio.content)}</p>
              </CardContent>
              <CardFooter className="pt-0 flex flex-wrap gap-2">
                {anuncio.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este anuncio? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
