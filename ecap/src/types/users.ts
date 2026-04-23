export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department: string;
  title: string;
  avatar_initials: string;
  avatar_color: string;
  okta_group: string;
  permissions: string[];
  created_at: string;
  last_login: string;
  active: boolean;
}

export type UserRole = 
  | 'Executive Leadership'
  | 'Senior Leadership'
  | 'Management'
  | 'Analyst'
  | 'IT Team'
  | 'App Admin'
  | 'Power User'
  | 'Standard User'
  | 'Viewer'
  | 'Support'
  | 'Developer'
  | 'DevOps';

export interface OktaConfig {
  enabled: boolean;
  domain: string;
  client_id: string;
  redirect_uri: string;
  scopes: string[];
  group_claim: string;
  required_group: string;
}

export interface RolePermissions {
  access_level: 'full' | 'executive' | 'management' | 'technical' | 'business';
  can_view: string[];
  can_edit: string[];
  can_delete: string[];
  can_admin: boolean;
}

export interface UsersResponse {
  users: User[];
  okta_config: OktaConfig;
  role_permissions: Record<UserRole, RolePermissions>;
}
