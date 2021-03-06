import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant extends CommonEntity {
  @Column()
  @Field((type) => String)
  name: string;
  @Column()
  @Field((type) => Number)
  rating: number;
  @Column()
  @Field((type) => String)
  location: string;
  @Column()
  @Field((type) => Number)
  average_price: number;
}
