import { SetMetadata } from '@nestjs/common';

export type AllowedRoles = 'User' | 'Any';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
