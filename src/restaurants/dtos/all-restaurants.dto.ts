import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { Restaurant } from '../entities/restaurants.entity';

@ObjectType()
export class getAllRestaurantsOutput extends CommonOutput {
  @Field((returns) => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
  @Field((returns) => Number, { nullable: true })
  counts?: number;
}
