import { Layout } from "@/components/Layout";
import { MedicamentosManager } from "@/components/medicamentos/MedicamentosManager";

export default function Medicamentos() {
  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-health-700 mb-2">Gestión de Medicamentos</h1>
          <p className="text-muted-foreground">
            Administra el inventario de medicamentos y controla el stock
          </p>
        </div>
        
        <MedicamentosManager />
      </div>
    </Layout>
  );
}