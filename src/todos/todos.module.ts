import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TodoController } from './todos.controller';
import { TodoService } from './todos.service';


@Module({
    imports: [AuthModule],
    controllers: [TodoController],
    providers: [TodoService]
})
export class TodoModule { }
