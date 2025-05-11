  export interface Template {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    fields: Field[];
    theme?: Theme;
    tags?: string[];
    is_archived: boolean;
    shared: boolean;
    shared_slug?: string | null;
    usage_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Field {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'email' | 'select' | 'checkbox' | 'date' | 'file';
    required: boolean;
    placeholder?: string;
    default_value?: string | number | boolean;
    options?: string[]; // For select field
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
    };
  }
  
  export interface Theme {
    color?: string;
    layout?: 'standard' | 'compact' | 'wide';
    font?: string;
    background_color?: string;
    text_color?: string;
  }
  
  