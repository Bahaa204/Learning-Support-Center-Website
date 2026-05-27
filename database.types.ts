export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      Asked_About: {
        Row: {
          course_code: string;
          id: number;
          student_Id: string;
        };
        Insert: {
          course_code: string;
          id?: number;
          student_Id: string;
        };
        Update: {
          course_code?: string;
          id?: number;
          student_Id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Asked_About_course_code_fkey";
            columns: ["course_code"];
            isOneToOne: false;
            referencedRelation: "Courses";
            referencedColumns: ["Course Code"];
          },
          {
            foreignKeyName: "Asked_About_student_Id_fkey";
            columns: ["student_Id"];
            isOneToOne: false;
            referencedRelation: "Students";
            referencedColumns: ["id"];
          },
        ];
      };
      Courses: {
        Row: {
          "Course Code": string;
          "Course Title": string;
        };
        Insert: {
          "Course Code": string;
          "Course Title": string;
        };
        Update: {
          "Course Code"?: string;
          "Course Title"?: string;
        };
        Relationships: [];
      };
      Department: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      Students: {
        Row: {
          added_at: string;
          added_by: string;
          department_id: number;
          email: string | null;
          id: string;
          nb_visits: number;
          studentId: number;
          studentName: string;
        };
        Insert: {
          added_at: string;
          added_by: string;
          department_id: number;
          email?: string | null;
          id?: string;
          nb_visits?: number;
          studentId: number;
          studentName: string;
        };
        Update: {
          added_at?: string;
          added_by?: string;
          department_id?: number;
          email?: string | null;
          id?: string;
          nb_visits?: number;
          studentId?: number;
          studentName?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Students_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "Department";
            referencedColumns: ["id"];
          },
        ];
      };
      Time_Slots: {
        Row: {
          created_at: string | null;
          end_time: string;
          id: number;
          start_time: string;
          userId: string;
          Weekday: Database["public"]["Enums"]["weekday"];
        };
        Insert: {
          created_at?: string | null;
          end_time: string;
          id?: number;
          start_time: string;
          userId: string;
          Weekday: Database["public"]["Enums"]["weekday"];
        };
        Update: {
          created_at?: string | null;
          end_time?: string;
          id?: number;
          start_time?: string;
          userId?: string;
          Weekday?: Database["public"]["Enums"]["weekday"];
        };
        Relationships: [
          {
            foreignKeyName: "Time_Slots_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          },
        ];
      };
      Users: {
        Row: {
          created_at: string;
          department_id: number;
          display_name: string;
          email: string;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          created_at?: string;
          department_id: number;
          display_name: string;
          email: string;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          created_at?: string;
          department_id?: number;
          display_name?: string;
          email?: string;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [
          {
            foreignKeyName: "Users_department_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "Department";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_student_visits: {
        Args: { student_id_input: number };
        Returns: undefined;
      };
      is_admin_in_department: {
        Args: { p_department_id: number };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "admin" | "workstudy";
      weekday: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "workstudy"],
      weekday: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
} as const;
