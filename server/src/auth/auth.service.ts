import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MemberRole } from '../member/member.entity';
import { MemberService } from '../member/member.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.memberService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Un compte avec cet e-mail existe déjà.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const member = await this.memberService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      role: MemberRole.ROWER,
      isActive: true,
    });

    return this.buildTokenResponse(member.id, member.email, member.role);
  }

  async login(dto: LoginDto) {
    const member = await this.memberService.findByEmail(dto.email);
    // Message générique pour ne pas révéler si l'email existe
    const invalid = new UnauthorizedException('Identifiants incorrects.');

    if (!member || !member.isActive) throw invalid;

    const valid = await bcrypt.compare(dto.password, member.passwordHash);
    if (!valid) throw invalid;

    return this.buildTokenResponse(member.id, member.email, member.role);
  }

  private buildTokenResponse(sub: string, email: string, role: string) {
    return {
      accessToken: this.jwtService.sign({ sub, email, role }),
      user: { id: sub, email, role },
    };
  }
}
