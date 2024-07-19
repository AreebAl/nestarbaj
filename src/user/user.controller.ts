import { Controller, Get, Post, Body, Param, Delete, Patch, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email?: string,
    @Body('fullName') fullName?: string,
  ) {
    return this.usersService.create(username, password, email, fullName);
  }

  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    const user = await this.usersService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user,
      message: 'Login successful',
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<User>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
 async remove(@Param('id') id: number) {
    const user=await this.usersService.remove(id);
    return {user:user,
      message:"deleted succesfully"
    };
  }
}
