<<<<<<< HEAD
import { ObjectType, Field } from '@nestjs/graphql'
import { RegisterResponse } from '@giftan/contracts'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class RegisterResponseDto implements RegisterResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => GraphQLJSON, { nullable: true })
  user?: any

  @Field(() => String, { nullable: true })
  error?: string
=======
import { ObjectType, Field } from "@nestjs/graphql"
import { UserType } from "src/users/dto/user.type";

@ObjectType()
export class RegisterResponse {
  @Field(() => String, { nullable: true })
  success?: string;

  @Field(() => UserType, { nullable: true })
  user?: UserType;
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
}