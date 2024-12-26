import { Field, ID, InputType } from "@nestjs/graphql";
import { IsNotEmpty, Length } from "class-validator";

@InputType()
export class CreateTodoInput {
    @Field()
    @IsNotEmpty()
    @Length(1, 100)
    title: string;
}

@InputType()
export class UpdateTodoInput {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    @Length(1, 100)
    title?: string;

    @Field({ nullable: true })
    completed?: boolean
}