import { IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class LoginRegisterDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    pseudo: string;
}