import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Todo } from "./todo.schema";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { TodoService } from "./todo.service";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/user/user.schema";
import { CreateTodoInput, UpdateTodoInput } from "./todo.inputs";

@Resolver(() => Todo)
@UseGuards(JwtAuthGuard)
export class TodoResolver {
    constructor(private todoService: TodoService) {}

    @Query(() => [Todo])
    async todos(@CurrentUser() user: User) {
        return this.todoService.findAll(user._id);
    }

    @Mutation(() => Todo)
    async createTodo(
        @Args('input') input: CreateTodoInput,
        @CurrentUser() user: User,
    ) {
        return this.todoService.create(input, user._id);
    }

    @Mutation(() => Todo)
    async updateTodo(
        @Args('input') input: UpdateTodoInput,
        @CurrentUser() user: User,
    ) {
        return this.todoService.update(input, user._id);
    }

    @Mutation(() => Boolean)
    async deleteTodo(
        @Args('id') id: string,
        @CurrentUser() user: User,
    ) {
        return this.todoService.delete(id, user._id);
    }
}
