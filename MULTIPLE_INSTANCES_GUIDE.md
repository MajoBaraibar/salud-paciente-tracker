# Guía para Múltiples Instancias de Health Center

## Estrategia: Una App por Centro de Salud

Cada centro tendrá su propia instancia completamente separada:
- **Health Center 1**: `healthcenter1.com` o `hc1.tudominio.com`
- **Health Center 2**: `healthcenter2.com` o `hc2.tudominio.com` 
- **Health Center 3**: `healthcenter3.com` o `hc3.tudominio.com`

## Proceso de Implementación

### 1. Para Cada Centro Necesitas:

#### A. Proyecto Supabase Separado
- Ve a [supabase.com](https://supabase.com) 
- Crea un nuevo proyecto para cada centro:
  - `health-center-1-prod`
  - `health-center-2-prod`
  - `health-center-3-prod`

#### B. Proyecto Lovable Separado (Recomendado)
- Haz **Remix** de este proyecto para cada centro
- O copia el código a nuevos proyectos

#### C. Dominio/Subdominio Separado
- Compra dominios separados, o
- Usa subdominios: `hc1.tudominio.com`, `hc2.tudominio.com`

### 2. Configuración por Instancia

#### Modificar \`src/config/centerConfig.ts\`
Para Health Center 1:
\`\`\`typescript
export const centerConfig = centerConfigs.hc1;
\`\`\`

Para Health Center 2:
\`\`\`typescript
export const centerConfig = centerConfigs.hc2;
\`\`\`

#### Cambiar Datos de Supabase
En cada instancia, actualiza \`src/integrations/supabase/client.ts\`:
\`\`\`typescript
const SUPABASE_URL = "https://tu-proyecto-hc1.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "tu_key_hc1_aqui";
\`\`\`

### 3. Personalización por Centro

#### Colores y Branding
El sistema detecta automáticamente la configuración y aplica:
- Logo específico del centro
- Colores de marca personalizados
- Información de contacto

#### Características Específicas
Activa/desactiva funciones por centro en \`centerConfig.features\`:
\`\`\`typescript
features: {
  payments: true,      // HC1: Sí, HC2: No
  requisitions: false, // HC3: Solo para ciertos roles
  messaging: true,
  emergencyContacts: true
}
\`\`\`

## Ventajas de esta Estrategia

✅ **Separación Total**: Cada centro tiene sus propios datos y usuarios
✅ **Seguridad Máxima**: No hay riesgo de acceso cruzado entre centros  
✅ **Personalización Completa**: Cada centro puede tener su propio branding
✅ **Escalabilidad**: Agregar nuevos centros es independiente
✅ **Mantenimiento**: Actualizaciones pueden aplicarse gradualmente

## Costos Estimados (por centro)

- **Supabase**: $25/mes (Plan Pro recomendado)
- **Dominio**: $10-15/año
- **Deployment**: Gratis (Lovable) o $5-10/mes (otros)
- **Total por centro**: ~$30-40/mes

## Próximos Pasos

1. **Decide los dominios** para cada centro
2. **Crea proyectos Supabase** separados
3. **Remix/Copia** este proyecto para cada centro
4. **Personaliza** la configuración de cada uno
5. **Deploy** cada instancia a su dominio

¿Quieres que continúe con algún paso específico?