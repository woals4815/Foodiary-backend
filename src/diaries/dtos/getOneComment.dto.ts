import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class GetOneCommentInput {
  @Field((type) => Number)
  commentId: number;
}

@ObjectType()
export class GetOneCommentOutput extends CommonOutput {
  @Field((type) => Comment, { nullable: true })
  comment?: Comment;
}
