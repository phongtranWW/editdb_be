import { Role } from '../types/role';

export class CreateUserInternal {
  email: string;
  name: string;
  avatar?: string;
  role?: Role;
  isActive?: boolean;
  providers: {
    provider: string;
    providerId?: string;
    hash?: string;
  }[];
}
