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
      agent_actions: {
        Row: {
          action: string
          agent_name: string
          confidence: number | null
          created_at: string | null
          error: string | null
          id: string
          knowledge_source_id: string | null
          metadata: Json | null
          success: boolean | null
        }
        Insert: {
          action: string
          agent_name: string
          confidence?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          knowledge_source_id?: string | null
          metadata?: Json | null
          success?: boolean | null
        }
        Update: {
          action?: string
          agent_name?: string
          confidence?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          knowledge_source_id?: string | null
          metadata?: Json | null
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_actions_knowledge_source_id_fkey"
            columns: ["knowledge_source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tasks: {
        Row: {
          agent_name: string
          created_at: string
          error_message: string | null
          id: string
          knowledge_source_id: string | null
          last_attempt_at: string | null
          max_retries: number
          next_attempt_at: string | null
          payload: Json | null
          priority: string | null
          retry_count: number
          status: string
          updated_at: string
        }
        Insert: {
          agent_name: string
          created_at?: string
          error_message?: string | null
          id?: string
          knowledge_source_id?: string | null
          last_attempt_at?: string | null
          max_retries?: number
          next_attempt_at?: string | null
          payload?: Json | null
          priority?: string | null
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Update: {
          agent_name?: string
          created_at?: string
          error_message?: string | null
          id?: string
          knowledge_source_id?: string | null
          last_attempt_at?: string | null
          max_retries?: number
          next_attempt_at?: string | null
          payload?: Json | null
          priority?: string | null
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_knowledge_source_id_fkey"
            columns: ["knowledge_source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      external_link_audits: {
        Row: {
          checked_at: string
          content_hash: string | null
          id: string
          knowledge_source_id: string
          notes: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          checked_at?: string
          content_hash?: string | null
          id?: string
          knowledge_source_id: string
          notes?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          checked_at?: string
          content_hash?: string | null
          id?: string
          knowledge_source_id?: string
          notes?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_link_audits_knowledge_source_id_fkey"
            columns: ["knowledge_source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_ontology_terms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          knowledge_source_id: string
          ontology_term_id: string
          review_required: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          knowledge_source_id: string
          ontology_term_id: string
          review_required?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          knowledge_source_id?: string
          ontology_term_id?: string
          review_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_source_ontology_terms_knowledge_source_id_fkey"
            columns: ["knowledge_source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_source_ontology_terms_ontology_term_id_fkey"
            columns: ["ontology_term_id"]
            isOneToOne: false
            referencedRelation: "ontology_terms"
            referencedColumns: ["id"]
          },
        ]
      }
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
          external_content_hash: string | null
          external_source_checked_at: string | null
          external_source_url: string | null
          id: string
          metadata: Json | null
          needs_external_review: boolean | null
          published: boolean | null
          published_at: string | null
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          external_content_hash?: string | null
          external_source_checked_at?: string | null
          external_source_url?: string | null
          id?: string
          metadata?: Json | null
          needs_external_review?: boolean | null
          published?: boolean | null
          published_at?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          external_content_hash?: string | null
          external_source_checked_at?: string | null
          external_source_url?: string | null
          id?: string
          metadata?: Json | null
          needs_external_review?: boolean | null
          published?: boolean | null
          published_at?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_sources_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "knowledge_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_sources_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "private_templates_without_user"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_global: boolean | null
          metadata: Json | null
          name: string
          structure: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          metadata?: Json | null
          name: string
          structure?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          metadata?: Json | null
          name?: string
          structure?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      note_links: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          link_type: string
          source_id: string
          target_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          link_type: string
          source_id: string
          target_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          link_type?: string
          source_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_links_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_links_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
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
          content_id: string
          display_order: number
          id: string
          name: string
          type_id: string | null
        }
        Insert: {
          content_id: string
          display_order?: number
          id?: string
          name: string
          type_id?: string | null
        }
        Update: {
          content_id?: string
          display_order?: number
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
      private_templates_without_user: {
        Row: {
          id: string | null
          is_global: boolean | null
          name: string | null
        }
        Insert: {
          id?: string | null
          is_global?: boolean | null
          name?: string | null
        }
        Update: {
          id?: string | null
          is_global?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      tag_summary: {
        Row: {
          name: string | null
          usage_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_related_ontology_terms: {
        Args: { knowledge_source_id: string }
        Returns: {
          term_id: string
          term: string
          description: string
          domain: string
          relation_type: string
        }[]
      }
      get_related_tags: {
        Args: { knowledge_source_id: string }
        Returns: {
          related_tag: string
        }[]
      }
      refresh_tag_summary_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
