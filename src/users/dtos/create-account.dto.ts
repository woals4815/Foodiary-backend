import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { User } from '../entities/users.entity';
import { CommonOutput } from '../../common/dtos/common.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'name',
  'profilePic',
]) {
  @Field((type) => String)
  confirmPassword: string;
}

@ObjectType()
export class CreateAccountOutput extends CommonOutput {
  @Field((type) => Int, { nullable: true })
  userId?: number;
}
