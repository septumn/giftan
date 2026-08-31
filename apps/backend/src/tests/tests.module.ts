import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsResolver } from './tests.resolver';

@Module({
  providers: [TestsService, TestsResolver]
})
export class TestsModule { }
