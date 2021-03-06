import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Diary } from '../entities/diaries.entity';

@InputType()
export class GetOneDiaryInput {
  @Field((type) => Number)
  diaryId: number;
}

@ObjectType()
export class GetOneDiaryOutput extends CommonOutput {
  @Field((type) => Diary, { nullable: true })
  myDiary?: Diary;
}
