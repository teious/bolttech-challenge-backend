import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { TodoService } from "./todos.service";

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class TodoController {

    constructor(private todoService: TodoService) { }

    @Post('create')
    async createProject(@Request() req) {
        const { _id } = req.user
        const { projectName } = req.body

        return await this.todoService.createProject(projectName, _id)
    }

    @Get()
    async getProjects(@Request() req) {
        const { _id } = req.user

        return await this.todoService.getProjects(_id)
    }

    @Delete(':projectId')
    async deleteProject(@Request() req, @Param('projectId') projectId) {
        const { _id } = req.user
        return await this.todoService.deleteProject(projectId, _id)
    }

    @Put()
    async updateProjectName(@Request() req, @Body() project) {
        const { _id } = req.user
        return await this.todoService.updateProjectName(project, _id)
    }

    @Post(':projectId/todos')
    async addTodo(@Request() req, @Param('projectId') projectId, @Body() todo) {
        const { _id } = req.user
        const { description } = todo;
        return await this.todoService.addTodo(projectId, description, _id)
    }
    @Delete(':projectId/todos/:todoId')
    async deleteTodo(@Request() req, @Param() params) {
        const { _id } = req.user
        const { projectId, todoId } = params
        return await this.todoService.deleteTodo(projectId, todoId, _id)
    }
    @Put(':projectId/todos/:todoId/finish')
    async finishTodo(@Request() req, @Param() params) {
        const { _id } = req.user
        const { projectId, todoId } = params

        return await this.todoService.finishTodo(projectId, todoId, _id)
    }

}