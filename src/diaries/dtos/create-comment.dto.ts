import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput extends PickType(Comment, ['comment']) {
  @Field((type) => Number)
  diaryId: number;
}

@ObjectType()
export class CreateCommentOutput extends CommonOutput {
  @Field((type) => Number, { nullable: true })
  commentId?: number;
}
