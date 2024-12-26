import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/user.schema";
import { LoginInput, RegisterInput } from "./auth.inputs";
import * as bcrypt from 'bcrypt';
import { FileUpload } from "src/types/graphql-upload";
import { v4 as uuidv4 } from 'uuid';
import { join } from "path";
import { createWriteStream } from "fs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async login(input: LoginInput) {
        const user = await this.userModel.findOne({ email: input.email });
        if (!user) {
            throw new Error('User not found');
        }

        const valid = await bcrypt.compare(input.password, user.password);
        if(!valid) {
            throw new Error('Invalid password');
        }

        return {
            token: this.jwtService.sign({ userId: user._id }),
            user,
        };
    }

    async register(input: RegisterInput, image?: FileUpload) {
        const exits = await this.userModel.findOne({ email: input.email });
        if (exits) {
            throw new Error('Email already exists');
        }

        let imageUrl;
        if (image) {
            const { createReadStream, filename } = await image;
            const uniqueFilename = `${uuidv4()}-${filename}`;
            const imagePath = join(process.cwd(), 'uploads', uniqueFilename);

            await new Promise((resolve, reject) =>
                createReadStream()
                    .pipe(createWriteStream(imagePath))
                    .on('finish', resolve)
                    .on('error', reject)
            );

            imageUrl = `/uploads/${uniqueFilename}`;
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await this.userModel.create({
            ...input,
            password: hashedPassword,
            imageUrl,
        });

        return {
            token: this.jwtService.sign({ userId: user._id }),
            user,
        };
    }
}