export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      knowledge_source_versions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          source_id: string | null
          version_number: number
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          version_number: number
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_source_versions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_sources: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          metadata: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_templates: {
        Row: {
          content: string
          id: string
          metadata: Json | null
          name: string
        }
        Insert: {
          content: string
          id?: string
          metadata?: Json | null
          name: string
        }
        Update: {
          content?: string
          id?: string
          metadata?: Json | null
          name?: string
        }
        Relationships: []
      }
      ontology_relationships: {
        Row: {
          id: string
          related_term_id: string | null
          relation_type: string
          term_id: string | null
        }
        Insert: {
          id?: string
          related_term_id?: string | null
          relation_type: string
          term_id?: string | null
        }
        Update: {
          id?: string
          related_term_id?: string | null
          relation_type?: string
          term_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ontology_relationships_related_term_id_fkey"
            columns: ["related_term_id"]
            isOneToOne: false
            referencedRelation: "ontology_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ontology_relationships_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "ontology_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      ontology_terms: {
        Row: {
          description: string | null
          domain: string | null
          id: string
          term: string
        }
        Insert: {
          description?: string | null
          domain?: string | null
          id?: string
          term: string
        }
        Update: {
          description?: string | null
          domain?: string | null
          id?: string
          term?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          permission_type: string
          resource_id: string | null
          resource_type: string
          role_id: string | null
        }
        Insert: {
          id?: string
          permission_type: string
          resource_id?: string | null
          resource_type: string
          role_id?: string | null
        }
        Update: {
          id?: string
          permission_type?: string
          resource_id?: string | null
          resource_type?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      tag_relations: {
        Row: {
          id: string
          related_tag_id: string | null
          relation_type: string
          tag_id: string | null
        }
        Insert: {
          id?: string
          related_tag_id?: string | null
          relation_type: string
          tag_id?: string | null
        }
        Update: {
          id?: string
          related_tag_id?: string | null
          relation_type?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tag_relations_related_tag_id_fkey"
            columns: ["related_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          type_id: string | null
        }
        Insert: {
          id?: string
          name: string
          type_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "tag_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      tag_summary: {
        Row: {
          name: string | null
          usage_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
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
