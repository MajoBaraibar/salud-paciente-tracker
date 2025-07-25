import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { FileText, Download, TrendingUp, Users, Calendar, Activity } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

const reportTypes = [
  { id: "pacientes", label: "Reporte de Pacientes", icon: Users },
  { id: "actividad", label: "Actividad Médica", icon: Activity },
  { id: "citas", label: "Calendario de Citas", icon: Calendar },
  { id: "financiero", label: "Reporte Financiero", icon: TrendingUp },
];

const mockPatientData = [
  { mes: "Ene", nuevos: 12, total: 45 },
  { mes: "Feb", nuevos: 19, total: 64 },
  { mes: "Mar", nuevos: 15, total: 79 },
  { mes: "Abr", nuevos: 22, total: 101 },
  { mes: "May", nuevos: 18, total: 119 },
  { mes: "Jun", nuevos: 25, total: 144 },
];

const mockActivityData = [
  { name: "Consultas", value: 45, color: "#8884d8" },
  { name: "Procedimientos", value: 23, color: "#82ca9d" },
  { name: "Emergencias", value: 12, color: "#ffc658" },
  { name: "Seguimientos", value: 31, color: "#ff7300" },
];

const mockFinancialData = [
  { mes: "Ene", ingresos: 85000, gastos: 62000 },
  { mes: "Feb", ingresos: 92000, gastos: 68000 },
  { mes: "Mar", ingresos: 78000, gastos: 58000 },
  { mes: "Abr", ingresos: 105000, gastos: 75000 },
  { mes: "May", ingresos: 98000, gastos: 71000 },
  { mes: "Jun", ingresos: 112000, gastos: 82000 },
];

export const ReportsGenerator = () => {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [generating, setGenerating] = useState(false);

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const generateReport = async () => {
    if (!selectedReport) {
      toast.error("Selecciona un tipo de reporte");
      return;
    }

    setGenerating(true);
    
    // Simular generación de reporte
    setTimeout(() => {
      setGenerating(false);
      toast.success(`Reporte ${selectedReport} generado correctamente`);
    }, 2000);
  };

  const renderPreview = () => {
    if (!selectedReport) return null;

    switch (selectedReport) {
      case "pacientes":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vista previa - Reporte de Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Pacientes por Mes</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mockPatientData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="nuevos" fill="#8884d8" name="Nuevos" />
                      <Bar dataKey="total" fill="#82ca9d" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Pacientes:</span>
                    <Badge variant="secondary">144</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Nuevos este mes:</span>
                    <Badge variant="secondary">25</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio mensual:</span>
                    <Badge variant="secondary">18.5</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "actividad":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vista previa - Actividad Médica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Distribución de Actividades</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={mockActivityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mockActivityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {mockActivityData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "financiero":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Vista previa - Reporte Financiero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-medium mb-3">Ingresos vs Gastos</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockFinancialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="ingresos" stroke="#8884d8" strokeWidth={2} name="Ingresos" />
                    <Line type="monotone" dataKey="gastos" stroke="#82ca9d" strokeWidth={2} name="Gastos" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generador de Reportes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-colors ${
                  selectedReport === type.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedReport(type.id)}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{type.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedReport && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rango de fechas</label>
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={setDateRange}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Formato de salida</label>
                  <Select value={format} onValueChange={(value: "pdf" | "excel" | "csv") => setFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Métricas a incluir</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Totales", "Promedios", "Comparativas", "Gráficos", "Detalles", "Tendencias"].map((metric) => (
                    <div key={metric} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric}
                        checked={selectedMetrics.includes(metric)}
                        onCheckedChange={() => handleMetricToggle(metric)}
                      />
                      <label htmlFor={metric} className="text-sm cursor-pointer">
                        {metric}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={generateReport} 
                  disabled={generating}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {generating ? "Generando..." : "Generar Reporte"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {renderPreview()}
    </div>
  );
};