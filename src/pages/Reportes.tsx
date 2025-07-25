import { Layout } from "@/components/Layout";
import { ReportsGenerator } from "@/components/ReportsGenerator";

export default function Reportes() {
  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-health-700 mb-2">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">
            Genera reportes detallados sobre la actividad del centro médico
          </p>
        </div>
        
        <ReportsGenerator />
      </div>
    </Layout>
  );
}