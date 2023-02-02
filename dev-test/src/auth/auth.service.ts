import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  passwordValidation(value) {
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    const isValidLength = /^.{8,64}$/;

    switch (true) {
      case value === '' || value === undefined:
        return 'Pasword should not be empty';
      case !isContainsUppercase.test(value):
        return 'Password must have at least one uppercase character.';
      case !isContainsLowercase.test(value):
        return 'Password must have at least one lowercase character.';
      case !isContainsNumber.test(value):
        return 'Password must contain at least one digit.';
      case !isContainsSymbol.test(value):
        return 'Password must contain at least one special symbol.';
      case !isValidLength.test(value):
        return 'Password must be 8 - 64 characters Long';
      default:
        return null;
    }
  }

  emailValidation(value) {
    const reg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    switch (true) {
      case value === '' || value === undefined:
        return 'Email should not be empty';
      case !reg.test(value):
        return 'Email is not valid';
      default:
        return null;
    }
  }

  async register(username, email, password) {
    const isExistedUser = await this.userService.byEmail(email);

    if (isExistedUser) {
      throw new BadRequestException('User is already exist');
    }

    const isValidPassword = this.passwordValidation(password);

    if (isValidPassword !== null) {
      throw new BadRequestException(isValidPassword);
    }

    const isValidEmail = this.emailValidation(email);

    if (isValidEmail !== null) {
      throw new BadRequestException(isValidEmail);
    }

    this.emailValidation(email);
    const test = await this.userService.createUser({
      username,
      email,
      password,
    });
    return test;
  }

  async validateUser(username, password: string) {
    const foundUser = await this.userService.byUsername(username);
    if (foundUser) {
      const matched = bcrypt.compare(password, foundUser.password);
      if (matched) {
        return foundUser;
      } else {
        return null;
      }
    }

    return null;
  }

  async updatePassword(oldPassword: string, newPassword: string, user) {
    const foundUser = await this.userService.byId(user._id);

    const isValidPassword = await bcrypt.compare(
      oldPassword,
      foundUser.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('The current password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const update = foundUser;
    update.password = hashedPassword;

    return await foundUser.updateOne(update);
  }
}
