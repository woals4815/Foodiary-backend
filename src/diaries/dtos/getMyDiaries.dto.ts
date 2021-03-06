import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Diary } from '../entities/diaries.entity';

@InputType()
export class GetMyDiariesInput {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class GetMyDiariesOutput extends CommonOutput {
  @Field((type) => [Diary], { nullable: true })
  myDiaries?: Diary[];
}
