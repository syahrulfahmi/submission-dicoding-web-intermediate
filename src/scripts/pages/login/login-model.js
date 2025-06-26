import { login } from '../../data/api';

export class LoginModel {
  async login(email, password) {
    return login(email, password);
  }
}
