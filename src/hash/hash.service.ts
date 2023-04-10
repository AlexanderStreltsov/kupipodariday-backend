import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async createHash(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async checkHash(password: string, hash: string) {
    const isHashValid = await bcrypt.compare(password, hash);
    return isHashValid;
  }
}
