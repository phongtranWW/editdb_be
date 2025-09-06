import { Role } from 'src/users/types/role';

export class JwtInternal {
  sub: string;
  email: string;
  role: Role;
  name: string;
  avatar?: string;
}
