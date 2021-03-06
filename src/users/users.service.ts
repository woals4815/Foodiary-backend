import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/dtos/common.dto';
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
  verifyPassword(password, confirmPassword): CommonOutput {
    const passwordRegix = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,20}$/;
    if (password !== confirmPassword) {
      return {
        ok: false,
        error: 'Please write same password.',
      };
    }
    if (!passwordRegix.test(password)) {
      return {
        ok: false,
        error:
          'Password should contain one number and one special character at least.',
      };
    }
    return { ok: true };
  }
  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const userExist = await this.userRepository.findOne({
        email: createAccountInput.email,
      });
      if (userExist) {
        return {
          ok: false,
          error: 'User already exists.',
        };
      }
      const passwordConfirm = this.verifyPassword(
        createAccountInput.password,
        createAccountInput.confirmPassword,
      );
      if (!passwordConfirm.ok) {
        return passwordConfirm;
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
    { email, name, password, confirmPassword }: EditProfileInput,
    user: User,
  ): Promise<EditProfileOutput> {
    try {
      const userExist = await this.userRepository.findOne(user.id);
      if (!userExist) {
        return {
          ok: false,
          error: 'User not exist.',
        };
      }
      if (email) {
        userExist.email = email;
      }
      if (password) {
        const passwordConfirm = this.verifyPassword(password, confirmPassword);
        if (!passwordConfirm.ok) {
          return passwordConfirm;
        }
        userExist.password = password;
      }
      if (name) {
        userExist.name = name;
      }
      await this.userRepository.save(userExist);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot edit you profile.',
      };
    }
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
