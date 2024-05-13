import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
// import { RoleGuard } from 'src/role/role.guard';

@Controller('user')
// @UseGuards(RoleGuard) // Add guards to all routes of user
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // get /user?role=user --> [] //return an array

  @Get()
  @UseGuards(AuthGuard)
  // @UseGuards(RoleGuard) // Add guards to only this route
  findAll(@Query('role') role: 'user' | 'admin') {
    // const service = new UserService();
    // return service.findAll(role);

    return this.userService.findAll(role);
  }

  // get /user/:userID --> {} //return an object

  @Get(':userID')
  // ParseIntPipe will transform the string userID into a number
  // findOne(@Param('userID', ParseIntPipe) userID: number) {
  findOne(@Param('userID') userID: string) {
    try {
      return this.userService.findOne(userID);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Put(':userID')
  updateUser(
    @Param('userID') userID: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userID, updateUserDto);
  }

  @Delete(':userID')
  remove(@Param('userID') userID: string) {
    return this.userService.remove(userID);
  }
}
