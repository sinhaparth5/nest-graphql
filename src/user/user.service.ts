import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { User, UserDocument } from './user.schema';
import { FileUpload } from 'graphql-upload-minimal';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async updateImage(userId: Types.ObjectId, image: Promise<FileUpload>): Promise<User> {
    const { createReadStream, filename } = await image;
    const uniqueFilename = `${Date.now()}-${filename}`;
    const imagePath = join(process.cwd(), 'uploads', uniqueFilename);

    // Ensure uploads directory exists
    await new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(imagePath))
        .on('finish', resolve)
        .on('error', reject)
    );

    const imageUrl = `/uploads/${uniqueFilename}`;
    return this.userModel.findByIdAndUpdate(
      userId,
      { imageUrl },
      { new: true }
    );
  }
}