import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Diary } from '../entities/diaries.entity';

@ObjectType()
export class getAllDiariesOutput extends CommonOutput {
  @Field((returns) => [Diary], { nullable: true })
  diaries?: Diary[];
}
