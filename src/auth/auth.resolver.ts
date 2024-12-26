import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginResponse } from "./auth.types";
import { LoginInput, RegisterInput } from "./auth.inputs";
import { GraphQLUpload } from 'graphql-upload-minimal';
import { FileUpload } from "src/types/graphql-upload";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => LoginResponse)
    async login(@Args('input') input: LoginInput) {
        return this.authService.login(input);
    }

    @Mutation(() => LoginResponse)
    async register(
        @Args("input") input: RegisterInput,
        @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
        image?: FileUpload,
    ) {
        return this.authService.register(input, image);
    }
}