export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor: string
          at: string
          detail: string | null
          id: string
          severity: Database["public"]["Enums"]["audit_severity"]
          target: string
        }
        Insert: {
          action: string
          actor: string
          at?: string
          detail?: string | null
          id?: string
          severity?: Database["public"]["Enums"]["audit_severity"]
          target: string
        }
        Update: {
          action?: string
          actor?: string
          at?: string
          detail?: string | null
          id?: string
          severity?: Database["public"]["Enums"]["audit_severity"]
          target?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          document: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tags: string[]
        }
        Insert: {
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[]
        }
        Update: {
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[]
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          conversions: number
          created_at: string
          description: string | null
          discount_pct: number
          from_date: string
          id: string
          name: string
          revenue: number
          room_ids: string[]
          to_date: string
        }
        Insert: {
          active?: boolean
          conversions?: number
          created_at?: string
          description?: string | null
          discount_pct: number
          from_date: string
          id?: string
          name: string
          revenue?: number
          room_ids?: string[]
          to_date: string
        }
        Update: {
          active?: boolean
          conversions?: number
          created_at?: string
          description?: string | null
          discount_pct?: number
          from_date?: string
          id?: string
          name?: string
          revenue?: number
          room_ids?: string[]
          to_date?: string
        }
        Relationships: []
      }
      reservation_events: {
        Row: {
          action: string
          at: string
          by_user: string | null
          detail: string | null
          id: string
          reservation_id: string
        }
        Insert: {
          action: string
          at?: string
          by_user?: string | null
          detail?: string | null
          id?: string
          reservation_id: string
        }
        Update: {
          action?: string
          at?: string
          by_user?: string | null
          detail?: string | null
          id?: string
          reservation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_events_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          channel: Database["public"]["Enums"]["reservation_channel"]
          check_in: string
          check_out: string
          code: string
          created_at: string
          created_by: string | null
          external_ref: string | null
          guest_id: string
          guests: number
          id: string
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          room_id: string
          status: Database["public"]["Enums"]["reservation_status"]
          total_value: number
        }
        Insert: {
          channel: Database["public"]["Enums"]["reservation_channel"]
          check_in: string
          check_out: string
          code: string
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          guest_id: string
          guests: number
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          room_id: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_value?: number
        }
        Update: {
          channel?: Database["public"]["Enums"]["reservation_channel"]
          check_in?: string
          check_out?: string
          code?: string
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          guest_id?: string
          guests?: number
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          room_id?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_blocks: {
        Row: {
          created_at: string
          from_date: string
          id: string
          note: string | null
          reason: Database["public"]["Enums"]["block_reason"]
          room_id: string
          to_date: string
        }
        Insert: {
          created_at?: string
          from_date: string
          id?: string
          note?: string | null
          reason: Database["public"]["Enums"]["block_reason"]
          room_id: string
          to_date: string
        }
        Update: {
          created_at?: string
          from_date?: string
          id?: string
          note?: string | null
          reason?: Database["public"]["Enums"]["block_reason"]
          room_id?: string
          to_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_blocks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[]
          base_price: number
          capacity: number
          code: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          status: Database["public"]["Enums"]["room_status"]
          type: Database["public"]["Enums"]["room_type"]
        }
        Insert: {
          amenities?: string[]
          base_price: number
          capacity: number
          code: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          status?: Database["public"]["Enums"]["room_status"]
          type: Database["public"]["Enums"]["room_type"]
        }
        Update: {
          amenities?: string[]
          base_price?: number
          capacity?: number
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          status?: Database["public"]["Enums"]["room_status"]
          type?: Database["public"]["Enums"]["room_type"]
        }
        Relationships: []
      }
      sync_state: {
        Row: {
          channel: string
          errors: number
          imported_count: number
          last_sync: string | null
          status: string
        }
        Insert: {
          channel: string
          errors?: number
          imported_count?: number
          last_sync?: string | null
          status: string
        }
        Update: {
          channel?: string
          errors?: number
          imported_count?: number
          last_sync?: string | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operacao"
      audit_severity: "info" | "warning" | "critical"
      block_reason: "maintenance" | "owner" | "blocked"
      payment_status: "pending" | "partial" | "paid" | "refunded"
      reservation_channel:
        | "direto"
        | "booking"
        | "whatsapp"
        | "telefone"
        | "site"
      reservation_status:
        | "pending"
        | "confirmed"
        | "checked_in"
        | "checked_out"
        | "cancelled"
        | "no_show"
      room_status: "active" | "inactive" | "maintenance" | "blocked"
      room_type: "suite" | "bangalo" | "standard" | "master"
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
    Enums: {
      app_role: ["admin", "operacao"],
      audit_severity: ["info", "warning", "critical"],
      block_reason: ["maintenance", "owner", "blocked"],
      payment_status: ["pending", "partial", "paid", "refunded"],
      reservation_channel: [
        "direto",
        "booking",
        "whatsapp",
        "telefone",
        "site",
      ],
      reservation_status: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "no_show",
      ],
      room_status: ["active", "inactive", "maintenance", "blocked"],
      room_type: ["suite", "bangalo", "standard", "master"],
    },
  },
} as const
