import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { userInfo } from 'node:os';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { User } from 'src/users/entities/users.entity';
import { DiariesService } from './diaries.service';
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

@Resolver((of) => Diary)
export class DiariesResolver {
  constructor(private readonly diariesService: DiariesService) {}
  @Query((returns) => getAllDiariesOutput)
  async getAllDiaries(): Promise<getAllDiariesOutput> {
    return this.diariesService.getAllDiaries();
  }
  @Mutation((returns) => CreateDiaryOutput)
  @Role(['User'])
  async createDiary(
    @Args('input') createDiaryInput: CreateDiaryInput,
    @AuthUser() creator: User,
  ): Promise<CreateDiaryOutput> {
    return this.diariesService.createDiary(createDiaryInput, creator);
  }
  @Query((returns) => GetMyDiariesOutput)
  @Role(['User'])
  async getMyDiaries(@AuthUser() user: User): Promise<GetMyDiariesOutput> {
    return this.diariesService.getMyDiaries(user);
  }
  @Query((returns) => GetOneDiaryOutput)
  @Role(['User'])
  async getMyOneDiary(
    @Args('input') getOneDiaryInput: GetOneDiaryInput,
    @AuthUser() user: User,
  ): Promise<GetOneDiaryOutput> {
    return this.diariesService.getMyOneDiary(getOneDiaryInput, user);
  }
  @Query((returns) => GetOneDiaryOutput)
  @Role(['User'])
  async getOneDiary(
    @Args('input') { diaryId }: GetOneDiaryInput,
  ): Promise<GetOneDiaryOutput> {
    return this.diariesService.getOneDiary({ diaryId });
  }

  @Mutation((returns) => EditDiaryOutput)
  @Role(['User'])
  async editDiary(
    @Args('input') editDiaryInput: EditDiaryInput,
    @AuthUser() user: User,
  ): Promise<EditDiaryOutput> {
    return this.diariesService.editDiary(editDiaryInput, user);
  }

  @Mutation((returns) => DeleteDiaryOutput)
  @Role(['User'])
  async deleteDiary(
    @Args('input') deleteDiaryInput: DeleteDiaryInput,
    @AuthUser() user: User,
  ): Promise<DeleteDiaryOutput> {
    return this.diariesService.deleteDiary(deleteDiaryInput, user);
  }
}

@Resolver((of) => Comment)
export class CommentsResolver {
  constructor(private readonly diariesService: DiariesService) {}

  @Role(['User'])
  @Query((returns) => GetAllCommentsOutput)
  async getAllCommentsOfoneDiary(
    @Args('input') { diaryId }: GetAllCommentsInput,
  ): Promise<GetAllCommentsOutput> {
    return this.diariesService.getAllCommentsOfoneDiary({ diaryId });
  }
  @Role(['User'])
  @Mutation((returns) => CreateCommentOutput)
  async createComment(
    @Args('input') createCommentInput: CreateCommentInput,
    @AuthUser() creator: User,
  ): Promise<CreateCommentOutput> {
    return this.diariesService.createComment(createCommentInput, creator);
  }
  @Role(['User'])
  @Mutation((returns) => CommonOutput)
  async deleteComment(
    @Args('input') deleteCommentInput: DeleteCommentInput,
    @AuthUser() commentOwner: User,
  ): Promise<CommonOutput> {
    return this.diariesService.deleteComment(deleteCommentInput, commentOwner);
  }
  @Role(['User'])
  @Query((returns) => GetOneCommentOutput)
  async getOneComment(
    @Args('input') getOneCommentInput: GetOneCommentInput,
  ): Promise<GetOneCommentOutput> {
    return this.diariesService.getOneComment(getOneCommentInput);
  }
  @Role(['User'])
  @Mutation((returns) => EditCommentOutput)
  async editComment(
    @Args('input') editCommentInput: EditCommentInput,
    @AuthUser() commentOwner: User,
  ): Promise<EditCommentOutput> {
    return this.diariesService.editComment(editCommentInput, commentOwner);
  }
}
