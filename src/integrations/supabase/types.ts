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
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      customer_developer_teams: {
        Row: {
          created_at: string
          customer_id: string
          developer_id: string
          hired_at: string
          id: string
          project_match_id: string | null
          role_in_team: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          developer_id: string
          hired_at?: string
          id?: string
          project_match_id?: string | null
          role_in_team?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          developer_id?: string
          hired_at?: string
          id?: string
          project_match_id?: string | null
          role_in_team?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_developer_teams_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_developer_teams_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_developer_teams_project_match_id_fkey"
            columns: ["project_match_id"]
            isOneToOne: false
            referencedRelation: "project_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          company_name: string
          contact_name: string
          created_at: string | null
          email: string
          id: string
          org_number: string | null
          phone: string
          role_title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name: string
          contact_name: string
          created_at?: string | null
          email: string
          id?: string
          org_number?: string | null
          phone: string
          role_title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string
          contact_name?: string
          created_at?: string | null
          email?: string
          id?: string
          org_number?: string | null
          phone?: string
          role_title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      developers: {
        Row: {
          ai_generated_title: string | null
          available_for_work: boolean | null
          certifications: string[] | null
          created_at: string | null
          cv_summary: string | null
          education: string | null
          email: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          first_name: string
          github_url: string | null
          hourly_rate: number | null
          id: string
          industry_experience: string[] | null
          is_approved: boolean | null
          languages: string[] | null
          last_name: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          preferred_employment_types:
            | Database["public"]["Enums"]["employment_type"][]
            | null
          profile_picture_url: string | null
          technical_skills: string[]
          updated_at: string | null
          user_id: string | null
          years_of_experience: number
        }
        Insert: {
          ai_generated_title?: string | null
          available_for_work?: boolean | null
          certifications?: string[] | null
          created_at?: string | null
          cv_summary?: string | null
          education?: string | null
          email: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          first_name: string
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          industry_experience?: string[] | null
          is_approved?: boolean | null
          languages?: string[] | null
          last_name: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_employment_types?:
            | Database["public"]["Enums"]["employment_type"][]
            | null
          profile_picture_url?: string | null
          technical_skills: string[]
          updated_at?: string | null
          user_id?: string | null
          years_of_experience: number
        }
        Update: {
          ai_generated_title?: string | null
          available_for_work?: boolean | null
          certifications?: string[] | null
          created_at?: string | null
          cv_summary?: string | null
          education?: string | null
          email?: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          first_name?: string
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          industry_experience?: string[] | null
          is_approved?: boolean | null
          languages?: string[] | null
          last_name?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_employment_types?:
            | Database["public"]["Enums"]["employment_type"][]
            | null
          profile_picture_url?: string | null
          technical_skills?: string[]
          updated_at?: string | null
          user_id?: string | null
          years_of_experience?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      project_matches: {
        Row: {
          created_at: string | null
          customer_interested_at: string | null
          developer_approved_at: string | null
          developer_id: string | null
          id: string
          match_score: number
          meeting_scheduled_at: string | null
          project_requirement_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_interested_at?: string | null
          developer_approved_at?: string | null
          developer_id?: string | null
          id?: string
          match_score: number
          meeting_scheduled_at?: string | null
          project_requirement_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_interested_at?: string | null
          developer_approved_at?: string | null
          developer_id?: string | null
          id?: string
          match_score?: number
          meeting_scheduled_at?: string | null
          project_requirement_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_matches_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_matches_project_requirement_id_fkey"
            columns: ["project_requirement_id"]
            isOneToOne: false
            referencedRelation: "project_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      project_requirements: {
        Row: {
          additional_comments: string | null
          budget_amount: string | null
          created_at: string | null
          customer_id: string | null
          employment_type: Database["public"]["Enums"]["employment_type"]
          employment_type_other: string | null
          experience_level: Database["public"]["Enums"]["experience_level"]
          has_budget: boolean
          id: string
          industry_experience_required: boolean
          industry_type: string | null
          is_active: boolean | null
          project_description: string
          project_duration: string | null
          project_risks: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          required_resources: string | null
          security_requirements: string | null
          start_date: string | null
          technical_skills: string
          updated_at: string | null
        }
        Insert: {
          additional_comments?: string | null
          budget_amount?: string | null
          created_at?: string | null
          customer_id?: string | null
          employment_type: Database["public"]["Enums"]["employment_type"]
          employment_type_other?: string | null
          experience_level: Database["public"]["Enums"]["experience_level"]
          has_budget: boolean
          id?: string
          industry_experience_required: boolean
          industry_type?: string | null
          is_active?: boolean | null
          project_description: string
          project_duration?: string | null
          project_risks?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          required_resources?: string | null
          security_requirements?: string | null
          start_date?: string | null
          technical_skills: string
          updated_at?: string | null
        }
        Update: {
          additional_comments?: string | null
          budget_amount?: string | null
          created_at?: string | null
          customer_id?: string | null
          employment_type?: Database["public"]["Enums"]["employment_type"]
          employment_type_other?: string | null
          experience_level?: Database["public"]["Enums"]["experience_level"]
          has_budget?: boolean
          id?: string
          industry_experience_required?: boolean
          industry_type?: string | null
          is_active?: boolean | null
          project_description?: string
          project_duration?: string | null
          project_risks?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          required_resources?: string | null
          security_requirements?: string | null
          start_date?: string | null
          technical_skills?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_requirements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
        Args: { req_id: string; dev_id: string }
        Returns: number
      }
      generate_project_matches: {
        Args: { req_id: string }
        Returns: undefined
      }
    }
    Enums: {
      employment_type: "hourly" | "part_time" | "full_time" | "other"
      experience_level: "junior" | "medior" | "senior"
      project_type: "fixed_price" | "hourly_based"
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
    Enums: {
      employment_type: ["hourly", "part_time", "full_time", "other"],
      experience_level: ["junior", "medior", "senior"],
      project_type: ["fixed_price", "hourly_based"],
    },
  },
} as const
