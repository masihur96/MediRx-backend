import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

enum CredentialType {
  EMAIL = 'email',
  PHONE = 'phone',
  BMDC = 'bmdc'
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  /**
   * Detect the type of credential (email, phone, or BMDC code)
   */
  private detectCredentialType(credential: string): CredentialType {
    // Check if it's an email (contains @)
    if (credential.includes('@')) {
      return CredentialType.EMAIL;
    }

    // Check if it's a BMDC code (pattern: letter(s)-digits, e.g., A-12345)
    const bmdcPattern = /^[A-Za-z]+-\d+$/;
    if (bmdcPattern.test(credential)) {
      return CredentialType.BMDC;
    }

    // Default to phone number (starts with + or contains only digits)
    return CredentialType.PHONE;
  }

  /**
   * Unified credential validation - auto-detects credential type
   */
  async validateCredential(credential: string, password: string): Promise<User | null> {
    const credentialType = this.detectCredentialType(credential);
    let user: User | null = null;

    switch (credentialType) {
      case CredentialType.EMAIL:
        user = await this.usersService.findByEmail(credential);
        break;
      case CredentialType.PHONE:
        user = await this.usersService.findByPhone(credential);
        break;
      case CredentialType.BMDC:
        user = await this.usersService.findByBmdcCode(credential);
        break;
    }

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    return isPasswordValid ? user : null;
  }

  /**
   * Generate JWT token with user information
   */
  async generateToken(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      bmdcCode: user.bmdcCode
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        bmdcCode: user.bmdcCode
      }
    };
  }

  // ========== Backward Compatibility Methods ==========

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.passwordHash);
    return match ? user : null;
  }

  

  async login(user: any) {
    return this.generateToken(user);
  }

}
