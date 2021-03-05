import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginIntput, LoginOutput } from './dtos/login-dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const passwordRegix = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,20}$/;
      const userExist = await this.userRepository.findOne({
        email: createAccountInput.email,
      });
      if (userExist) {
        return {
          ok: false,
          error: 'User already exists.',
        };
      }
      if (createAccountInput.password !== createAccountInput.confirmPassword) {
        return {
          ok: false,
          error: 'Please write the same password.',
        };
      }
      if (!passwordRegix.test(createAccountInput.password)) {
        return {
          ok: false,
          error:
            'password should contain one number and one special character at least.',
        };
      }
      const newUser = await this.userRepository.create(createAccountInput);
      await this.userRepository.save(newUser);
      return {
        ok: true,
        userId: newUser.id,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot create the account.',
      };
    }
  }
  async login({ email, password }: LoginIntput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password.',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't log user in.",
      };
    }
  }
  async editProfile(
    editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return {
      ok: true,
    };
  }
  async findById({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(userId);
      if (!user) {
        return {
          ok: false,
          error: 'Cannot find the user.',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot find the user.',
      };
    }
  }
}
