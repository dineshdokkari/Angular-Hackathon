export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed in real apps; kept plain here for demo simplicity
  createdAt: string;
}
 
export interface AuthState {
  token: string | null;
  user: Pick<User, 'id' | 'name' | 'email'> | null;
}
 
export interface Credentials {
  email: string;
  password: string;
}