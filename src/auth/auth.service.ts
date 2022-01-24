import { ConflictException, Injectable } from '@nestjs/common';
import { AuthCredentialsDto, User } from './user.model';
import * as PouchDB from 'pouchdb';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    private db: PouchDB.Database<User>;

    constructor(private jwtService: JwtService) {
        this.db = new PouchDB<User>('users');
    }
    async signUp(credentials: AuthCredentialsDto) {
        const { username, password } = credentials;
        try {
            const { docs } = await this.db.find({
                selector: {
                    username
                }
            })

            if (docs.length) {
                throw new ConflictException('User already exists');
            } else {



                const hashedPassword = await bcrypt.hash(password, 10);

                const res = await this.db.put(new User(username, hashedPassword));
                return res.id;


            }

        } catch (error) {
            throw error;
        }
    }


    async validateUser(username: string, password: string): Promise<Partial<User>> {
        const { docs } = await this.db.find({ selector: { username } })
        const [user] = docs

        if (!user) {
            return null;
        }
        const valid = await bcrypt.compare(password, user.password);

        if (valid) {
            const { password, _rev, ...result } = user;
            return result;
        }

        return null;


    }

    async signIn(user: User) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
