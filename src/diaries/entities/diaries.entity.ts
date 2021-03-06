import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('diaryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Diary extends CommonEntity {
  @Column('text', { nullable: true, array: true })
  @Field((type) => [String], { nullable: true })
  images?: string[];
  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  description?: string;
  @Column({ default: 5 })
  @Field((type) => Number, { defaultValue: 5 })
  @Min(0)
  @Max(5)
  rating: number;
  @Column({ default: false })
  @Field((type) => Boolean, { defaultValue: false })
  publicOrNot: boolean;
  @ManyToOne(() => User, (user) => user.myDiaries)
  @Field((type) => User)
  creator: User;
  @RelationId((diary: Diary) => diary.creator)
  creatorId: number;
}