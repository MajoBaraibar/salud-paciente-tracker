import { Layout } from "@/components/Layout";
import { FileUploadManager } from "@/components/FileUploadManager";

export default function Archivos() {
  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-health-700 mb-2">Gestión de Archivos</h1>
          <p className="text-muted-foreground">
            Sube, organiza y gestiona todos los documentos médicos y administrativos
          </p>
        </div>
        
        <FileUploadManager />
      </div>
    </Layout>
  );
}