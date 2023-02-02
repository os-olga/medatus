import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async byId(id: string) {
    return await this.userModel.findById({ _id: id });
  }

  async byUsername(username: string) {
    return await this.userModel.findOne({ username: username });
  }

  async byEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({
      username: data.username,
      email: data.email.toLocaleLowerCase(),
      password: hashedPassword,
    });
    return await newUser.save();
  }
}
