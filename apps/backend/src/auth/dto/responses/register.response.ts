import { ObjectType, Field } from "@nestjs/graphql"
import { UserType } from "src/users/dto/user.type";

@ObjectType()
export class RegisterResponse {
  @Field(() => String, { nullable: true })
  success?: string;

  @Field(() => UserType, { nullable: true })
  user?: UserType;
}