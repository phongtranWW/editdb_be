import { Provider } from 'src/users/types/provider';

export class ValidateOAthInternal {
  email: string;
  name: string;
  avatar?: string;
  provider: Provider;
  providerId: string;
}
