import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Diary } from './diaries.entity';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  comment: string;

  @ManyToOne(() => Diary, (diary) => diary.comments)
  @Field((type) => String)
  diary: Diary;
  @RelationId((comment: Comment) => comment.diary)
  diaryId: number;

  @ManyToOne(() => User, (user) => user.commentsMade)
  @Field((type) => User)
  creator: User;

  @RelationId((comment: Comment) => comment.creator)
  creatorId: number;
}
