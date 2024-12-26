import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUserImage(
    @CurrentUser() user: User,
    @Args({ name: 'image', type: () => GraphQLUpload })
    image: Promise<FileUpload>,
  ) {
    return this.userService.updateImage(user._id, image);
  }
}