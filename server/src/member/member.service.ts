import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async findByEmail(email: string): Promise<Member | null> {
    // addSelect pour récupérer password_hash (exclu par défaut)
    return this.memberRepository
      .createQueryBuilder('member')
      .addSelect('member.passwordHash')
      .where('member.email = :email', { email })
      .getOne();
  }

  async create(data: Partial<Member>): Promise<Member> {
    const member = this.memberRepository.create(data);
    return this.memberRepository.save(member);
  }
}
