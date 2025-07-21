export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categorias_requisiciones: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      centros_salud: {
        Row: {
          activo: boolean | null
          codigo_identificacion: string
          configuracion: Json | null
          created_at: string
          direccion: string
          email: string | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean | null
          codigo_identificacion: string
          configuracion?: Json | null
          created_at?: string
          direccion: string
          email?: string | null
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean | null
          codigo_identificacion?: string
          configuracion?: Json | null
          created_at?: string
          direccion?: string
          email?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contactos_emergencia: {
        Row: {
          centro_id: string | null
          created_at: string | null
          email: string | null
          id: string
          nombre: string
          paciente_id: string
          relacion: string
          telefono: string
          updated_at: string | null
        }
        Insert: {
          centro_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre: string
          paciente_id: string
          relacion: string
          telefono: string
          updated_at?: string | null
        }
        Update: {
          centro_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre?: string
          paciente_id?: string
          relacion?: string
          telefono?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contactos_emergencia_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_salud"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contactos_emergencia_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      entradas_historial: {
        Row: {
          centro_id: string | null
          created_at: string | null
          created_by: string | null
          diagnostico: string
          doctor_nombre: string
          fecha: string
          id: string
          motivo_consulta: string
          notas: string | null
          paciente_id: string
          tipo: string
          tratamiento: string
          updated_at: string | null
        }
        Insert: {
          centro_id?: string | null
          created_at?: string | null
          created_by?: string | null
          diagnostico: string
          doctor_nombre: string
          fecha?: string
          id?: string
          motivo_consulta: string
          notas?: string | null
          paciente_id: string
          tipo: string
          tratamiento: string
          updated_at?: string | null
        }
        Update: {
          centro_id?: string | null
          created_at?: string | null
          created_by?: string | null
          diagnostico?: string
          doctor_nombre?: string
          fecha?: string
          id?: string
          motivo_consulta?: string
          notas?: string | null
          paciente_id?: string
          tipo?: string
          tratamiento?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entradas_historial_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_salud"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entradas_historial_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      familiares: {
        Row: {
          apellido: string
          created_at: string | null
          email: string
          id: string
          nombre: string
          paciente_id: string
          relacion: string
          telefono: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          apellido: string
          created_at?: string | null
          email: string
          id?: string
          nombre: string
          paciente_id: string
          relacion: string
          telefono: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          apellido?: string
          created_at?: string | null
          email?: string
          id?: string
          nombre?: string
          paciente_id?: string
          relacion?: string
          telefono?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "familiares_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_enfermeria: {
        Row: {
          centro_id: string | null
          created_at: string
          enfermera_id: string
          fecha: string
          id: string
          nota: string
          paciente_id: string
          updated_at: string
        }
        Insert: {
          centro_id?: string | null
          created_at?: string
          enfermera_id: string
          fecha?: string
          id?: string
          nota: string
          paciente_id: string
          updated_at?: string
        }
        Update: {
          centro_id?: string | null
          created_at?: string
          enfermera_id?: string
          fecha?: string
          id?: string
          nota?: string
          paciente_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_enfermeria_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_salud"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          apellido: string
          centro_id: string | null
          created_at: string | null
          direccion: string
          fecha_nacimiento: string
          genero: string
          id: string
          imagen_url: string | null
          nombre: string
          numero_identificacion: string
          telefono: string
          updated_at: string | null
        }
        Insert: {
          apellido: string
          centro_id?: string | null
          created_at?: string | null
          direccion: string
          fecha_nacimiento: string
          genero: string
          id?: string
          imagen_url?: string | null
          nombre: string
          numero_identificacion: string
          telefono: string
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          centro_id?: string | null
          created_at?: string | null
          direccion?: string
          fecha_nacimiento?: string
          genero?: string
          id?: string
          imagen_url?: string | null
          nombre?: string
          numero_identificacion?: string
          telefono?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_salud"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          centro_id: string | null
          created_at: string | null
          estado: string
          fecha_pago: string | null
          fecha_vencimiento: string
          id: string
          metodo_pago: string | null
          monto: number
          notas: string | null
          paciente_id: string
          updated_at: string | null
        }
        Insert: {
          centro_id?: string | null
          created_at?: string | null
          estado?: string
          fecha_pago?: string | null
          fecha_vencimiento: string
          id?: string
          metodo_pago?: string | null
          monto: number
          notas?: string | null
          paciente_id: string
          updated_at?: string | null
        }
        Update: {
          centro_id?: string | null
          created_at?: string | null
          estado?: string
          fecha_pago?: string | null
          fecha_vencimiento?: string
          id?: string
          metodo_pago?: string | null
          monto?: number
          notas?: string | null
          paciente_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_salud"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apellido: string | null
          centro_id: string | null
          created_at: string | null
          email: string
          especialidad: string | null
          id: string
          imagen_url: string | null
          nombre: string | null
          paciente_id: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          apellido?: string | null
          centro_id?: string | null
          created_at?: string | null
          email: string
          especialidad?: string | null
          id: string
          imagen_url?: string | null
          nombre?: string | null
          paciente_id?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          apellido?: string | null
          centro_id?: string | null
          created_at?: string | null
          email?: string
          especialidad?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string | null
          paciente_id?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_paciente"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_salud"
            referencedColumns: ["id"]
          },
        ]
      }
      requisiciones: {
        Row: {
          cantidad: number
          categoria_id: string
          centro_id: string | null
          created_at: string | null
          estado: string
          id: string
          nombre: string
          notas: string | null
          prioridad: string
          solicitado_por: string
          updated_at: string | null
        }
        Insert: {
          cantidad: number
          categoria_id: string
          centro_id?: string | null
          created_at?: string | null
          estado?: string
          id?: string
          nombre: string
          notas?: string | null
          prioridad: string
          solicitado_por: string
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          categoria_id?: string
          centro_id?: string | null
          created_at?: string | null
          estado?: string
          id?: string
          nombre?: string
          notas?: string | null
          prioridad?: string
          solicitado_por?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requisiciones_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_requisiciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisiciones_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_salud"
            referencedColumns: ["id"]
          },
        ]
      }
      resultados_examenes: {
        Row: {
          archivo_nombre: string | null
          archivo_url: string | null
          centro_id: string | null
          created_at: string
          descripcion: string | null
          estado: string
          fecha_examen: string
          fecha_subida: string
          id: string
          medico_id: string
          nombre_examen: string
          observaciones: string | null
          paciente_id: string
          tipo_examen: string
          updated_at: string
        }
        Insert: {
          archivo_nombre?: string | null
          archivo_url?: string | null
          centro_id?: string | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_examen: string
          fecha_subida?: string
          id?: string
          medico_id: string
          nombre_examen: string
          observaciones?: string | null
          paciente_id: string
          tipo_examen?: string
          updated_at?: string
        }
        Update: {
          archivo_nombre?: string | null
          archivo_url?: string | null
          centro_id?: string | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_examen?: string
          fecha_subida?: string
          id?: string
          medico_id?: string
          nombre_examen?: string
          observaciones?: string | null
          paciente_id?: string
          tipo_examen?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_patient: {
        Args: { patient_id: string }
        Returns: boolean
      }
      get_current_user_centro_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
