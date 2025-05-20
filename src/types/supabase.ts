export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      feedbacks: {
        Row: {
          id: string
          section: string
          feedback: number
          created_at: string
        }
        Insert: {
          id?: string
          section: string
          feedback: number
          created_at?: string
        }
        Update: {
          id?: string
          section?: string
          feedback?: number
          created_at?: string
        }
      }
    }
  }
}