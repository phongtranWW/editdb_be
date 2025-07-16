export class CreateUserDto {
  email: string;
  name: string;
  providers: {
    provider: string;
    providerId: string;
    hash?: string;
  }[];
  avatar?: string;
  roles?: string[];
  isActive?: boolean;
}
