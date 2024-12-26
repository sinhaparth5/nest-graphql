import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.schema";

@ObjectType()
export class LoginResponse {
    @Field()
    token: string;

    @Field(() => User)
    user: User;
}

@ObjectType()
export class AuthPayload {
    @Field()
    userId: string;
}