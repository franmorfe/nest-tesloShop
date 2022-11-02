import { IsEAN, IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a upper case, a lower case, letters and numbers'
  })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;


}