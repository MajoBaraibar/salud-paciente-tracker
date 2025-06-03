
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, FileText, User, Clock, Send, Reply } from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";

// Mock data para usuarios y categorías
const mockUsers = [
  { id: "1", name: "Dr. García", category: "medico" },
  { id: "2", name: "Ana López", category: "enfermera" },
  { id: "3", name: "Carlos Ruiz", category: "enfermero" },
  { id: "4", name: "María Torres", category: "enfermera" },
  { id: "5", name: "Admin Sistema", category: "admin" }
];

const mockCategories = ["medicos", "enfermeros", "enfermeras", "admin", "todos"];

const anunciosMock = [
  {
    id: "1",
    titulo: "Nuevo protocolo de administración de medicamentos",
    contenido: "Se ha actualizado el protocolo para la administración de medicamentos. Todos los profesionales deben revisar los nuevos procedimientos.",
    fecha: new Date(),
    autor: "Administración",
    tipo: "protocolo" as const,
    prioridad: "alta" as const,
    comentarios: [
      {
        id: "c1",
        autor: "Dr. García",
        contenido: "Excelente actualización. @enfermeros por favor revisen la sección 3.",
        fecha: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
        menciones: ["enfermeros"]
      }
    ]
  },
  {
    id: "2", 
    titulo: "Capacitación en primeros auxilios",
    contenido: "Se realizará una capacitación obligatoria en primeros auxilios el próximo viernes a las 14:00 horas.",
    fecha: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    autor: "Recursos Humanos",
    tipo: "capacitacion" as const,
    prioridad: "media" as const,
    comentarios: []
  },
  {
    id: "3",
    titulo: "Actualización del sistema",
    contenido: "El sistema estará en mantenimiento el domingo de 02:00 a 06:00 horas. Durante este tiempo no estará disponible.",
    fecha: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    autor: "Sistemas",
    tipo: "mantenimiento" as const,
    prioridad: "baja" as const,
    comentarios: []
  }
];

export default function Anuncios() {
  const { markAllAsRead } = useNotificationStore();
  const [anuncios, setAnuncios] = useState(anunciosMock);
  const [comentarios, setComentarios] = useState<{[key: string]: string}>({});
  const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<{[key: string]: number}>({});

  // Marcar notificaciones de anuncios como leídas al entrar a la página
  useEffect(() => {
    markAllAsRead('announcement');
  }, [markAllAsRead]);

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-100 text-red-700 border-red-300";
      case "media":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "baja":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "protocolo":
        return <FileText className="h-4 w-4" />;
      case "capacitacion":
        return <User className="h-4 w-4" />;
      case "mantenimiento":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleTextareaChange = (anuncioId: string, value: string) => {
    setComentarios(prev => ({ ...prev, [anuncioId]: value }));
    
    // Detectar @ para mostrar sugerencias
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = value.substring(lastAtIndex + 1);
      const spaceIndex = textAfterAt.indexOf(' ');
      const currentMention = spaceIndex === -1 ? textAfterAt : textAfterAt.substring(0, spaceIndex);
      
      if (currentMention.length >= 0) {
        const userSuggestions = mockUsers
          .filter(user => user.name.toLowerCase().includes(currentMention.toLowerCase()))
          .map(user => user.name);
        
        const categorySuggestions = mockCategories
          .filter(cat => cat.toLowerCase().includes(currentMention.toLowerCase()));
        
        setSuggestions([...userSuggestions, ...categorySuggestions]);
        setShowSuggestions(prev => ({ ...prev, [anuncioId]: true }));
        setCursorPosition(prev => ({ ...prev, [anuncioId]: lastAtIndex }));
      }
    } else {
      setShowSuggestions(prev => ({ ...prev, [anuncioId]: false }));
    }
  };

  const insertSuggestion = (anuncioId: string, suggestion: string) => {
    const currentText = comentarios[anuncioId] || '';
    const lastAtIndex = currentText.lastIndexOf('@');
    const beforeAt = currentText.substring(0, lastAtIndex + 1);
    const afterMention = currentText.substring(lastAtIndex + 1);
    const spaceIndex = afterMention.indexOf(' ');
    const afterSpace = spaceIndex === -1 ? '' : afterMention.substring(spaceIndex);
    
    const newText = beforeAt + suggestion + afterSpace;
    setComentarios(prev => ({ ...prev, [anuncioId]: newText }));
    setShowSuggestions(prev => ({ ...prev, [anuncioId]: false }));
  };

  const enviarComentario = (anuncioId: string) => {
    const comentario = comentarios[anuncioId]?.trim();
    if (!comentario) return;

    // Extraer menciones del comentario
    const menciones = comentario.match(/@(\w+)/g)?.map(m => m.substring(1)) || [];

    const nuevoComentario = {
      id: `c${Date.now()}`,
      autor: "Usuario Actual", // En una app real, esto vendría del usuario logueado
      contenido: comentario,
      fecha: new Date(),
      menciones
    };

    setAnuncios(prev => prev.map(anuncio => 
      anuncio.id === anuncioId 
        ? { ...anuncio, comentarios: [...anuncio.comentarios, nuevoComentario] }
        : anuncio
    ));

    setComentarios(prev => ({ ...prev, [anuncioId]: '' }));
  };

  const renderComentarioConMenciones = (contenido: string) => {
    return contenido.split(/(@\w+)/g).map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-health-700">Tablón de anuncios</h1>
            <p className="text-muted-foreground">
              Comunicaciones importantes del centro médico
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {anuncios.map((anuncio) => (
            <Card key={anuncio.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(anuncio.tipo)}
                    <CardTitle className="text-lg">{anuncio.titulo}</CardTitle>
                  </div>
                  <Badge className={getPriorityColor(anuncio.prioridad)}>
                    {anuncio.prioridad.charAt(0).toUpperCase() + anuncio.prioridad.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {anuncio.autor}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {anuncio.fecha.toLocaleDateString('es-ES')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{anuncio.contenido}</p>
                
                {/* Comentarios existentes */}
                {anuncio.comentarios.length > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-medium text-sm flex items-center">
                      <Reply className="h-4 w-4 mr-1" />
                      Comentarios ({anuncio.comentarios.length})
                    </h4>
                    {anuncio.comentarios.map((comentario) => (
                      <div key={comentario.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{comentario.autor}</span>
                          <span className="text-xs text-gray-500">
                            {comentario.fecha.toLocaleString('es-ES')}
                          </span>
                        </div>
                        <p className="text-sm">
                          {renderComentarioConMenciones(comentario.contenido)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario para nuevo comentario */}
                <div className="border-t pt-4 space-y-3">
                  <div className="relative">
                    <Textarea
                      placeholder="Escribe un comentario... (usa @ para mencionar usuarios o categorías)"
                      value={comentarios[anuncio.id] || ''}
                      onChange={(e) => handleTextareaChange(anuncio.id, e.target.value)}
                      className="min-h-[80px]"
                    />
                    
                    {/* Sugerencias de autocompletado */}
                    {showSuggestions[anuncio.id] && suggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => insertSuggestion(anuncio.id, suggestion)}
                          >
                            @{suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Tip: Usa @ seguido del nombre de usuario o categoría (enfermeros, medicos, admin)
                    </p>
                    <Button 
                      onClick={() => enviarComentario(anuncio.id)}
                      disabled={!comentarios[anuncio.id]?.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
