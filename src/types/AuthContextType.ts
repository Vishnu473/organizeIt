export interface AuthContextType {
    user: any;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: any }>;
    signup: (email: string, password: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
  }