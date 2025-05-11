
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

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
    content: "Recordatorio: La reunión del personal se realizará el viernes a las 14:00 en la sala de conferencias. Es obligatoria la asistencia.",
    timestamp: new Date(2025, 4, 9, 10, 45),
    tags: ["Reunión", "Obligatorio"]
  }
];

export default function Anuncios() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(mockAnuncios);
  const [nuevoAnuncio, setNuevoAnuncio] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

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

    const newAnuncio: Anuncio = {
      id: Date.now().toString(),
      author: "Usuario Actual", // En una implementación real esto vendría del usuario logueado
      authorRole: "Médico", // En una implementación real esto vendría del usuario logueado
      content: nuevoAnuncio,
      timestamp: new Date(),
      tags: selectedTags
    };

    setAnuncios([newAnuncio, ...anuncios]);
    setNuevoAnuncio("");
    setSelectedTags([]);
    
    toast({
      title: "Anuncio publicado",
      description: "Tu anuncio ha sido publicado correctamente"
    });
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Tablón de Anuncios</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nuevo Anuncio</CardTitle>
            <CardDescription>
              Comparte información importante con el resto del personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Escribe tu anuncio aquí..." 
              value={nuevoAnuncio}
              onChange={(e) => setNuevoAnuncio(e.target.value)}
              className="mb-4"
            />
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
            <Button onClick={handleSubmit}>Publicar Anuncio</Button>
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
                  <div className="text-sm text-muted-foreground">
                    {format(anuncio.timestamp, "d 'de' MMMM, HH:mm", { locale: es })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{anuncio.content}</p>
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
    </Layout>
  );
}
