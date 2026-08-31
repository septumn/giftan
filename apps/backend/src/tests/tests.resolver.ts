import { Args, Resolver, Query } from '@nestjs/graphql'
import { TestsService } from './tests.service'
import { Public } from 'src/common/decorators/public.decorator'

@Resolver()
export class TestsResolver {
  constructor(
    private readonly testsService: TestsService
  ) { }

  @Query(() => String, { name: 'getTokenTest', nullable: true })
  @Public()
  getTokenTest(
    @Args('email') email: string
  ): Promise<string | null> {
    return this.testsService.getTokenTest(email)
  }
}