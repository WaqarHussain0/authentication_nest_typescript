import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import { UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingEmail = await this.userModel.findOne({
      email: createUserDto.email,
    });
    console.log(existingEmail);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword; // Update password in DTO
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(role?: 'user' | 'admin'): Promise<User[]> {
    if (role) {
      return this.userModel.find({ role: role }).exec();
    } else {
      return this.userModel.find().exec();
    }
  }

  async findOne(userID: string): Promise<User> {
    return this.userModel.findOne({ userID: userID }).exec();
  }

  async update(userID: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .updateOne(
        { userID: userID },
        {
          name: updateUserDto.name,
          email: updateUserDto.email,
          role: updateUserDto.role,
          password: updateUserDto.password,
        },
      )
      .exec();
  }

  async remove(userID: string) {
    return this.userModel.deleteOne({ userID: userID }).exec();
  }

  async validateUser(validateUserDto: any) {
    const { email, password } = validateUserDto;
    const user = await this.userModel.findOne({ email }).exec();

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (user && passwordMatch) {
      const payload = {
        name: user.name,
        userID: user.userID,
        email: user.email,
      };
      const accessToken = this.jwtService.sign(payload);
      return { message: 'Login Successfull', accessToken, user };
    }
    return new NotFoundException('Incorrect email or password');
  }
}
