export type UserType = {
    id?: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
    language: string;
    username: string;
    contact_phone: string | null;
    email: string;
    role: string;
    is_active: boolean;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string; // ISO 8601 datetime string
    updated_at?: string; // ISO 8601 datetime string
    deleted_at?: string | null;
  };