import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateDiaryInput, CreateDiaryOutput } from './dtos/create-diary.dto';
import { DeleteDiaryInput, DeleteDiaryOutput } from './dtos/delete-diary.dto';
import { EditDiaryInput, EditDiaryOutput } from './dtos/edit-diary.dto';
import { getAllDiariesOutput } from './dtos/get-all-diaries.to';
import { GetOneDiaryInput, GetOneDiaryOutput } from './dtos/get-one-diary.dto';
import { GetMyDiariesOutput } from './dtos/getMyDiaries.dto';
import { Diary } from './entities/diaries.entity';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}
  async getAllDiaries(): Promise<getAllDiariesOutput> {
    try {
      const diaries = await this.diaryRepository.find({ publicOrNot: true });
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'No diaries yet.',
      };
    }
  }
  async createDiary(
    createDiaryInput: CreateDiaryInput,
    creator: User,
  ): Promise<CreateDiaryOutput> {
    try {
      const diary = await this.diaryRepository.create(createDiaryInput);
      diary.creator = creator;
      await this.diaryRepository.save(diary);
      return {
        ok: true,
        diaryId: diary.id,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot create the diary.',
      };
    }
  }
  async getMyDiaries(user: User): Promise<GetMyDiariesOutput> {
    try {
      const myDiaries = await this.diaryRepository.find({ creator: user });
      return {
        ok: true,
        myDiaries,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot find you diaries.',
      };
    }
  }
  async getMyOneDiary(
    { diaryId }: GetOneDiaryInput,
    user: User,
  ): Promise<GetOneDiaryOutput> {
    try {
      const { ok, error, myDiaries } = await this.getMyDiaries(user);
      if (!ok) {
        return {
          ok: false,
          error,
        };
      }
      const myDiary = myDiaries.find((diary) => diary.id === diaryId);
      if (!myDiary) {
        return {
          ok: false,
          error: 'Cannot find the diary.',
        };
      }
      return {
        ok: true,
        myDiary,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot find my diary.',
      };
    }
  }
  async editDiary(
    { description, publicOrNot, images, rating, diaryId }: EditDiaryInput,
    user: User,
  ): Promise<EditDiaryOutput> {
    try {
      const { ok, error, myDiary } = await this.getMyOneDiary(
        { diaryId },
        user,
      );
      if (!ok) {
        return {
          ok: false,
          error,
        };
      }
      if (myDiary.creatorId !== user.id) {
        return {
          ok: false,
          error: 'This diary is not yours.',
        };
      }
      if (description) {
        myDiary.description = description;
      }
      if (publicOrNot) {
        myDiary.publicOrNot = publicOrNot;
      }
      if (images) {
        myDiary.images = [...images];
      }
      if (rating) {
        myDiary.rating = rating;
      }
      await this.diaryRepository.save(myDiary);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot edit your diary.',
      };
    }
  }
  async deleteDiary(
    { diaryId }: DeleteDiaryInput,
    user: User,
  ): Promise<DeleteDiaryOutput> {
    try {
      const { myDiary, error, ok } = await this.getMyOneDiary(
        { diaryId },
        user,
      );
      if (!ok) {
        return { ok, error };
      }
      if (myDiary.creatorId !== user.id) {
        return {
          ok: false,
          error: 'This diary is not yours.',
        };
      }
      await this.diaryRepository.delete({ id: diaryId });
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot delete the diary.',
      };
    }
  }
}
