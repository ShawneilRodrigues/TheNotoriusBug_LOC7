export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      branch: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: never
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: never
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
        }
        Relationships: []
      }
      chat: {
        Row: {
          company_id: number | null
          created_at: string | null
          id: number
          name: string | null
          user_id: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          id?: never
          name?: string | null
          user_id?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          id?: never
          name?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company: {
        Row: {
          created_at: string | null
          established_date: string | null
          id: number
          industry: string | null
          location: string | null
          name: string | null
          total_employees: number | null
          total_queries: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          established_date?: string | null
          id?: never
          industry?: string | null
          location?: string | null
          name?: string | null
          total_employees?: number | null
          total_queries?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          established_date?: string | null
          id?: never
          industry?: string | null
          location?: string | null
          name?: string | null
          total_employees?: number | null
          total_queries?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      document: {
        Row: {
          company_id: number | null
          created_at: string | null
          document_type: string | null
          document_url: string | null
          id: number
          table_summary: Json | null
          text_summary: string | null
          user_id: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: never
          table_summary?: Json | null
          text_summary?: string | null
          user_id?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: never
          table_summary?: Json | null
          text_summary?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment: boolean | null
          attachment_link: string | null
          attachment_type: string | null
          chat_id: number | null
          content: string | null
          created_at: string | null
          id: number
          is_bot: boolean | null
          sender_id: number | null
        }
        Insert: {
          attachment?: boolean | null
          attachment_link?: string | null
          attachment_type?: string | null
          chat_id?: number | null
          content?: string | null
          created_at?: string | null
          id?: never
          is_bot?: boolean | null
          sender_id?: number | null
        }
        Update: {
          attachment?: boolean | null
          attachment_link?: string | null
          attachment_type?: string | null
          chat_id?: number | null
          content?: string | null
          created_at?: string | null
          id?: never
          is_bot?: boolean | null
          sender_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          branch_id: number | null
          company_id: number | null
          dob: string | null
          email: string | null
          id: number
          is_admin: boolean
          name: string | null
          phone_number: string | null
          role: string | null
          salary: number | null
        }
        Insert: {
          branch_id?: number | null
          company_id?: number | null
          dob?: string | null
          email?: string | null
          id?: never
          is_admin?: boolean
          name?: string | null
          phone_number?: string | null
          role?: string | null
          salary?: number | null
        }
        Update: {
          branch_id?: number | null
          company_id?: number | null
          dob?: string | null
          email?: string | null
          id?: never
          is_admin?: boolean
          name?: string | null
          phone_number?: string | null
          role?: string | null
          salary?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_chats_by_user_id: {
        Args: {
          req_user_id: number
        }
        Returns: {
          id: number
          company_id: number
          created_at: string
          name: string
        }[]
      }
      get_messages_by_chat_id: {
        Args: {
          req_chat_id: number
        }
        Returns: {
          id: number
          sender_id: number
          content: string
          attachment: boolean
          attachment_type: string
          attachment_link: string
          is_bot: boolean
          created_at: string
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
