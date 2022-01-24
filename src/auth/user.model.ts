
import { v4 as uuid } from 'uuid';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class User {
    public _id: string;

    constructor(
        public username: string,
        public password: string
    ) {
        this._id = uuid()
    }
}


export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8, { message: 'Password is too short (8 characters min)' })
    @MaxLength(20, { message: 'Password is too long (20 characters max)' })
    password: string;
}