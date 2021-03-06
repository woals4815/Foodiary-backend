import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginIntput, LoginOutput } from './dtos/login-dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }
  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginIntput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }
  @Mutation((returns) => EditProfileOutput)
  @Role(['User'])
  async editProfile(
    @Args('input') editProfileInput: EditProfileInput,
    @AuthUser() user: User,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(editProfileInput, user);
  }
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userId: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userId);
  }
}
