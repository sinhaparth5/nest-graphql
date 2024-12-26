import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Document, Types } from "mongoose";
import { User } from "src/user/user.schema";

@ObjectType()
@Schema()
export class Todo {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field()
    @Prop({ required: true })
    title: string;

    @Field()
    @Prop({ default: false })
    completed: boolean;

    @Field(() => ID)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Field(() => User)
    user?: User;
}

export type TodoDocument = Todo & Document;
export const TodoSchema = SchemaFactory.createForClass(Todo);