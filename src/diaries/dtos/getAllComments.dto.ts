import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class GetAllCommentsInput {
  @Field((type) => Number)
  diaryId: number;
}
@ObjectType()
export class GetAllCommentsOutput extends CommonOutput {
  @Field((type) => [Comment], { nullable: true })
  allComments?: Comment[];
}
