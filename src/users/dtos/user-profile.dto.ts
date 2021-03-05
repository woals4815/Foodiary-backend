import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { User } from '../entities/users.entity';

@ArgsType()
export class UserProfileInput {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
