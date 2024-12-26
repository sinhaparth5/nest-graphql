import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Todo, TodoDocument } from "./todo.schema";
import { Model, Types } from "mongoose";
import { CreateTodoInput, UpdateTodoInput } from "./todo.inputs";

@Injectable()
export class TodoService {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    ) {}

    async findAll(userId: Types.ObjectId): Promise<Todo[]> {
        return this.todoModel.find({ userId }).exec();
    }

    async findOne(id: string, userId: Types.ObjectId): Promise<Todo> {
        const todo = await this.todoModel.findOne({
            _id: new Types.ObjectId(id),
            userId
        }).exec();

        if (!todo) {
            throw new NotFoundException(`Todo #${id} not found`);
        }

        return todo;
    }

    async create(input: CreateTodoInput, userId: Types.ObjectId): Promise<Todo> {
        const todo = new this.todoModel({
            ...input,
            userId,
        });
        return todo.save();
    }

    async update(input: UpdateTodoInput, userId: Types.ObjectId): Promise<Todo> {
        const todo = await this.todoModel.findOneAndUpdate(
            {_id: new Types.ObjectId(input.id), userId},
            { $set: { title: input.title, completed: input.completed }},
            { new: true }
        ).exec();

        if (!todo) {
            throw new NotFoundException(`Todo #${input.id} not found`);
        }

        return todo;
    }

    async delete(id: string, userId: Types.ObjectId): Promise<boolean> {
        const result = await this.todoModel.deleteOne({
            _id: new Types.ObjectId(id),
            userId
        }).exec();

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Todo #${id} not found`);
        }

        return true;
    }
}