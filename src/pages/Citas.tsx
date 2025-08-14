import { Layout } from "@/components/Layout";
import { CitasMedicas } from "@/components/citas/CitasMedicas";

export default function Citas() {
  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-health-700 mb-2">Gestión de Citas Médicas</h1>
          <p className="text-muted-foreground">
            Programa, gestiona y da seguimiento a las citas médicas
          </p>
        </div>
        
        <CitasMedicas />
      </div>
    </Layout>
  );
}