import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariesResolver } from './diaries.resolver';
import { DiariesService } from './diaries.service';
import { Diary } from './entities/diaries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diary])],
  providers: [DiariesResolver, DiariesService],
})
export class DiariesModule {}
