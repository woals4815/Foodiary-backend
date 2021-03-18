import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { User } from 'src/users/entities/users.entity';

@InputType()
export class SearchUserInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchUserOutput extends CommonOutput {
  @Field((type) => [User], { nullable: true })
  users?: User[];
}
