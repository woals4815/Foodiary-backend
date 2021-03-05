import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { CreateAccountInput } from './create-account.dto';

@InputType()
export class EditProfileInput extends PartialType(CreateAccountInput) {}

@ObjectType()
export class EditProfileOutput extends CommonOutput {}
