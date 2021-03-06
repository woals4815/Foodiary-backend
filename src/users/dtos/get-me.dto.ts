import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { User } from '../entities/users.entity';

@ObjectType()
export class GetMeOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  me?: User;
}
