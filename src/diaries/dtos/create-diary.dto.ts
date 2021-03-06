import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Diary } from '../entities/diaries.entity';

@InputType()
export class CreateDiaryInput extends PickType(Diary, [
  'images',
  'description',
  'publicOrNot',
  'rating',
]) {}

@ObjectType()
export class CreateDiaryOutput extends CommonOutput {
  @Field((returns) => Number, { nullable: true })
  diaryId?: number;
}
