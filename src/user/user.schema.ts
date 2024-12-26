import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@ObjectType()
@Schema()
export class User {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field()
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Field({ nullable: true })
    @Prop()
    imageUrl?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);