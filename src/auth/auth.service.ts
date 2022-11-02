import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository  } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });


      await this.userRepository.save( user );
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors( error );
    }

  }


  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where : { email },
      select: { id: true, email:true, password: true }
    });

    if ( !user || !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid');

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }


  async checkAuthStatus( user: User ) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }


  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
 }

  private handleDBErrors( error: any ): never {

    if ( error.code === '23505' )
      throw new BadRequestException( error.detail );

    console.log( error );

    throw new InternalServerErrorException('Please, check server logs');

  }

}
