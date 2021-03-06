import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsString, MinLength } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Diary } from 'src/diaries/entities/diaries.entity';
import { Comment } from 'src/diaries/entities/comment.entity';

@InputType('userInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  name: string;
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;
  @Column()
  @Field((type) => String)
  @MinLength(10)
  @IsString()
  password: string;
  @OneToMany(() => Diary, (diary) => diary.creator)
  @Field((type) => [Diary])
  @IsArray()
  myDiaries: Diary[];
  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  profilePic?: string;
  @OneToMany(() => Comment, (comment) => comment.creator)
  @Field((type) => [Comment])
  commentsMade: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
