import { Module } from '@nestjs/common'
import { GiftsResolver } from './gifts.resolver'

@Module({
  providers: [GiftsResolver],
})
export class GiftsModule { }