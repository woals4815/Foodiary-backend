import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { CreateCommentInput } from './create-comment.dto';

@InputType()
export class EditCommentInput extends PickType(CreateCommentInput, [
  'comment',
]) {
  @Field((type) => Number)
  commentId: number;
}

@ObjectType()
export class EditCommentOutput extends CommonOutput {}
