import { InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { GetOneDiaryInput } from './get-one-diary.dto';

@InputType()
export class DeleteDiaryInput extends GetOneDiaryInput {}

@ObjectType()
export class DeleteDiaryOutput extends CommonOutput {}
