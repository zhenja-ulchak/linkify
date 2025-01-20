export type AccountingSoftwareType = {
    id?: number;
    tenant_id: number;
    name: string;
    type: string;
    url: string;
    organization_id: number | null;
    event_type: string | null;
    description: string;
    additional_settings: {
      region: string;
    };
    is_active: boolean;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string; // ISO 8601 datetime string
    updated_at?: string; // ISO 8601 datetime string
    deleted_at?: string | null;
  };