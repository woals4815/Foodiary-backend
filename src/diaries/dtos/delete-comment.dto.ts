import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCommentInput {
  @Field((type) => Number)
  commentId: number;
}
