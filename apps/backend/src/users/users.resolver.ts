import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { UserType } from './dto/user.type'
import { UpdateProfileInput } from './dto/update-profile.input'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { RemoveBanResponse } from 'src/auth/dto/responses/remove-ban.reponse'
import { Public } from 'src/common/decorators/public.decorator'
import { UsersService } from './users.service'
import { type CurrentUserPayload } from 'src/common/interfaces/current-user.interface'

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => UserType, { name: 'userById', nullable: true })
  getUserById(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findById(id)
  }

  @Query(() => UserType, { name: 'me', nullable: true })
  getMe(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.usersService.findById(currentUser.id)
  }

  @Query(() => Boolean, { name: 'legitCheck' })
  legitCheck(): boolean {
    return true
  }

  @Mutation(() => UserType, { name: 'updateProfile' })
  updateProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Args('input') input: UpdateProfileInput
  ) {
    return this.usersService.updateProfile(currentUser.id, input)
  }

  @Mutation(() => RemoveBanResponse, { name: 'removeFromBlacklist' })
  @Public()
  removeFromBlacklist(
    @Args('userId', { type: () => String }) userId: string
  ) {
    if (!userId) return { success: false, error: 'Поле ID пустое' }

    return this.usersService.removeUserFromBlacklist(userId)
  }

  @Mutation(() => UserType, { name: 'uploadAvatar' })
  updateAvatar(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Args('image', { type: () => String, nullable: true }) image: string | null
  ) {
    return this.usersService.updateAvatar(currentUser.id, image)
  }
}