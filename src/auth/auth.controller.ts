import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }


  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ) {

    return this.authService.checkAuthStatus( user );
  }


  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    //@Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {

    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      rawHeaders
    }
  }


  @Get('private2')
  //@SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected( ValidRoles.admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }


  @Get('private3')
  //@SetMetadata('roles', ['admin', 'super-user'])
  @Auth( ValidRoles.admin )
  privateRoute3(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }


  
}
