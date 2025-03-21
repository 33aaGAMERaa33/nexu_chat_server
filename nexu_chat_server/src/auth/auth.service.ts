import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {
  }

  async generateToken(user: UsersEntity) {
    const payload = {
      id: user.id,
      uuid: user.uuid,
      username: user.username,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return token;
  }
  async decodeToken(token: string) { 
    return await this.jwtService.decode(token);
  }
}
