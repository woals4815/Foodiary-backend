import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { CreateDiaryInput } from './create-diary.dto';

@InputType()
export class EditDiaryInput extends PartialType(CreateDiaryInput) {
  @Field((type) => Number)
  diaryId: number;
}

@ObjectType()
export class EditDiaryOutput extends CommonOutput {}
