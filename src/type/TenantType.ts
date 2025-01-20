export type TenantType = {
    id?: number;
    company_name: string;
    address: string;
    tariff: string;
    invoice_address: string;
    license_valid_until: string; // ISO 8601 date string
    contact_email: string;
    invoice_email: string;
    contact_phone: string;
    is_active: boolean;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string; // ISO 8601 datetime string
    updated_at?: string; // ISO 8601 datetime string
    deleted_at?: string | null;
  };
  