import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dtos/create-comment.dto';
import { CreateDiaryInput, CreateDiaryOutput } from './dtos/create-diary.dto';
import { DeleteCommentInput } from './dtos/delete-comment.dto';
import { DeleteDiaryInput, DeleteDiaryOutput } from './dtos/delete-diary.dto';
import { EditCommentInput, EditCommentOutput } from './dtos/edit-comment.dto';
import { EditDiaryInput, EditDiaryOutput } from './dtos/edit-diary.dto';
import { getAllDiariesOutput } from './dtos/get-all-diaries.to';
import { GetOneDiaryInput, GetOneDiaryOutput } from './dtos/get-one-diary.dto';
import {
  GetAllCommentsInput,
  GetAllCommentsOutput,
} from './dtos/getAllComments.dto';
import { GetMyDiariesOutput } from './dtos/getMyDiaries.dto';
import {
  GetOneCommentInput,
  GetOneCommentOutput,
} from './dtos/getOneComment.dto';
import { Comment } from './entities/comment.entity';
import { Diary } from './entities/diaries.entity';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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
  async getOneDiary({ diaryId }: GetOneDiaryInput): Promise<GetOneDiaryOutput> {
    try {
      const diary = await this.diaryRepository.findOne(
        { id: diaryId },
        { relations: ['comments'] },
      );
      if (!diary) {
        return {
          ok: false,
          error: 'Cannot find the diary.',
        };
      }
      if (!diary.publicOrNot) {
        return {
          ok: false,
          error: 'You cannot access this diary.',
        };
      }
      return {
        ok: true,
        myDiary: diary,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'You cannot access this diary.',
      };
    }
  }
  async getAllCommentsOfoneDiary({
    diaryId,
  }: GetAllCommentsInput): Promise<GetAllCommentsOutput> {
    try {
      const { ok, error, myDiary: diary } = await this.getOneDiary({ diaryId });
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      if (diary.comments.length === 0) {
        return {
          ok: false,
          error: 'There are no comments yet.',
        };
      }
      return {
        ok: true,
        allComments: diary.comments,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot get any comments.',
      };
    }
  }
  async createComment(
    { diaryId, comment }: CreateCommentInput,
    creator: User,
  ): Promise<CreateCommentOutput> {
    try {
      const { myDiary: diary, ok, error } = await this.getOneDiary({ diaryId });
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      const newComment = await this.commentRepository.create({ comment });
      newComment.diary = diary;
      newComment.creator = creator;
      await this.commentRepository.save(newComment);
      return {
        ok: true,
        commentId: newComment.id,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't do any comments.",
      };
    }
  }
  async deleteComment(
    { commentId }: DeleteCommentInput,
    commentOwner: User,
  ): Promise<CommonOutput> {
    try {
      const { ok, error, comment } = await this.getOneComment({ commentId });
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      if (comment.creator.id !== commentOwner.id) {
        return {
          ok: false,
          error: 'This comment is not yours.',
        };
      }
      await this.commentRepository.delete({ id: commentId });
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot delete the comment',
      };
    }
  }
  async getOneComment({
    commentId,
  }: GetOneCommentInput): Promise<GetOneCommentOutput> {
    try {
      const comment = await this.commentRepository.findOneOrFail(commentId, {
        relations: ['creator'],
      });
      if (!comment) {
        return {
          ok: false,
          error: 'Cannot find the comment.',
        };
      }
      return {
        ok: true,
        comment,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot find the comment.',
      };
    }
  }
  async editComment(
    { commentId, comment }: EditCommentInput,
    commentOwner: User,
  ): Promise<EditCommentOutput> {
    try {
      const { comment: commentExist, ok, error } = await this.getOneComment({
        commentId,
      });
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      if (commentExist.creatorId !== commentOwner.id) {
        return {
          ok: false,
          error: 'This comment is not yours.',
        };
      }
      commentExist.comment = comment;
      await this.commentRepository.save(commentExist);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Cannot edit the commend.',
      };
    }
  }
}
