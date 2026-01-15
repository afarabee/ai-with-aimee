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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author: string | null
          banner_image: string | null
          body: string
          category: string | null
          created_at: string
          date_published: string
          deleted_at: string | null
          excerpt: string
          id: string
          slug: string
          status: string | null
          subtitle: string | null
          tags: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          banner_image?: string | null
          body: string
          category?: string | null
          created_at?: string
          date_published?: string
          deleted_at?: string | null
          excerpt: string
          id?: string
          slug: string
          status?: string | null
          subtitle?: string | null
          tags?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          banner_image?: string | null
          body?: string
          category?: string | null
          created_at?: string
          date_published?: string
          deleted_at?: string | null
          excerpt?: string
          id?: string
          slug?: string
          status?: string | null
          subtitle?: string | null
          tags?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      model_map_insights: {
        Row: {
          category: string
          comparison_data: Json | null
          heatmap_data: Json | null
          id: string
          last_calculated: string
          pro_tip: string | null
          runner_up_model_id: string | null
          runner_up_tagline: string | null
          strengths: string[] | null
          weaknesses: string[] | null
          winner_model_id: string | null
          winner_tagline: string | null
        }
        Insert: {
          category: string
          comparison_data?: Json | null
          heatmap_data?: Json | null
          id?: string
          last_calculated?: string
          pro_tip?: string | null
          runner_up_model_id?: string | null
          runner_up_tagline?: string | null
          strengths?: string[] | null
          weaknesses?: string[] | null
          winner_model_id?: string | null
          winner_tagline?: string | null
        }
        Update: {
          category?: string
          comparison_data?: Json | null
          heatmap_data?: Json | null
          id?: string
          last_calculated?: string
          pro_tip?: string | null
          runner_up_model_id?: string | null
          runner_up_tagline?: string | null
          strengths?: string[] | null
          weaknesses?: string[] | null
          winner_model_id?: string | null
          winner_tagline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_map_insights_runner_up_model_id_fkey"
            columns: ["runner_up_model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_map_insights_winner_model_id_fkey"
            columns: ["winner_model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          date_added: string
          description: string | null
          id: string
          last_modified: string
          name: string
          provider: string
          tags: string[] | null
          url: string | null
        }
        Insert: {
          date_added?: string
          description?: string | null
          id?: string
          last_modified?: string
          name: string
          provider: string
          tags?: string[] | null
          url?: string | null
        }
        Update: {
          date_added?: string
          description?: string | null
          id?: string
          last_modified?: string
          name?: string
          provider?: string
          tags?: string[] | null
          url?: string | null
        }
        Relationships: []
      }
      newsletter_queue: {
        Row: {
          blocks: Json
          body: string
          created_at: string
          id: string
          scheduled_date: string | null
          send_type: string
          status: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          body?: string
          created_at?: string
          id?: string
          scheduled_date?: string | null
          send_type?: string
          status?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          body?: string
          created_at?: string
          id?: string
          scheduled_date?: string | null
          send_type?: string
          status?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          body: string
          created_at: string
          date_published: string
          display_order: number
          excerpt: string | null
          github_link: string | null
          id: string
          project_page_link: string | null
          project_title: string
          slug: string | null
          status: string
          subtitle: string
          technologies: string[]
          thumbnail: string | null
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          date_published?: string
          display_order?: number
          excerpt?: string | null
          github_link?: string | null
          id?: string
          project_page_link?: string | null
          project_title: string
          slug?: string | null
          status?: string
          subtitle: string
          technologies?: string[]
          thumbnail?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          date_published?: string
          display_order?: number
          excerpt?: string | null
          github_link?: string | null
          id?: string
          project_page_link?: string | null
          project_title?: string
          slug?: string | null
          status?: string
          subtitle?: string
          technologies?: string[]
          thumbnail?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          body: string
          category: string | null
          date_created: string
          id: string
          last_modified: string
          role: string | null
          status: string
          tags: string[] | null
          title: string
        }
        Insert: {
          body: string
          category?: string | null
          date_created?: string
          id?: string
          last_modified?: string
          role?: string | null
          status?: string
          tags?: string[] | null
          title: string
        }
        Update: {
          body?: string
          category?: string | null
          date_created?: string
          id?: string
          last_modified?: string
          role?: string | null
          status?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          accuracy_score: number | null
          created_at: string
          id: string
          model_id: string
          notes: string | null
          practical_guidance_score: number | null
          scored_at: string | null
          speed_label: string | null
          speed_score: number | null
          style_score: number | null
          technical_detail_score: number | null
          test_id: string
          x_factor_score: number | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          id?: string
          model_id: string
          notes?: string | null
          practical_guidance_score?: number | null
          scored_at?: string | null
          speed_label?: string | null
          speed_score?: number | null
          style_score?: number | null
          technical_detail_score?: number | null
          test_id: string
          x_factor_score?: number | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          id?: string
          model_id?: string
          notes?: string | null
          practical_guidance_score?: number | null
          scored_at?: string | null
          speed_label?: string | null
          speed_score?: number | null
          style_score?: number | null
          technical_detail_score?: number | null
          test_id?: string
          x_factor_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
