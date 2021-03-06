import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsResolver, DiariesResolver } from './diaries.resolver';
import { DiariesService } from './diaries.service';
import { Comment } from './entities/comment.entity';
import { Diary } from './entities/diaries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, Comment])],
  providers: [DiariesResolver, DiariesService, CommentsResolver],
})
export class DiariesModule {}
