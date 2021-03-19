import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    console.log('Context', context);
    const gqlContext = GqlExecutionContext.create(context).getContext();
    console.log('gqlContext', gqlContext);
    const user = gqlContext['user'];
    console.log(user);
    return user;
  },
);
