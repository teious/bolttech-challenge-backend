import { ForbiddenException, Injectable } from "@nestjs/common";
import { Project, Todo } from "./project.model";
import * as PouchDB from 'pouchdb';

@Injectable()
export class TodoService {
    private db: PouchDB.Database<Project>;

    constructor() {
        this.db = new PouchDB<Project>('projects')
    }

    async createProject(projectName: string, userId: string) {
        try {
            await this.db.put<Project>(new Project(projectName, userId))
            const { docs } = await this.db.find({
                selector: {
                    userId
                }
            })
            return docs
        } catch (error) {
            throw error
        }
    }
    async getProjects(userId: string) {
        try {
            const { docs } = await this.db.find({ selector: { userId } })
            return docs

        } catch (error) {
            throw error
        }

    }
    async deleteProject(projectId: string, userId: string) {
        try {
            const doc = await this.db.get(projectId)
            if (doc.userId !== userId) {
                throw new ForbiddenException('Project does not belong to user')
            }
            await this.db.remove(doc)

            const { docs } = await this.db.find({ selector: { userId } })
            return docs
        } catch (error) {
            throw error
        }
    }

    async updateProjectName(data: Project, userId: string) {
        try {
            const doc = await this.db.get(data._id);
            if (doc.userId !== userId) {
                throw new ForbiddenException('Project does not belong to user')
            }
            await this.db.put({ ...doc, name: data.name })
            const { docs } = await this.db.find({ selector: { userId } })
            return docs


        } catch (error) {
            throw error
        }

    }

    async addTodo(projectId: string, description: string, userId: string) {
        try {
            const doc = await this.db.get(projectId);
            if (doc.userId !== userId) {
                throw new ForbiddenException('Project does not belong to user')
            }
            await this.db.put({ ...doc, todos: [...doc.todos, new Todo(description)] })
            const { docs } = await this.db.find({ selector: { userId } })
            return docs


        } catch (error) {
            throw error
        }
    }

    async deleteTodo(projectId: string, todoId: string, userId: string) {
        try {
            const doc = await this.db.get(projectId);
            if (doc.userId !== userId) {
                throw new ForbiddenException('Project does not belong to user')
            }
            await this.db.put({
                ...doc,
                todos: doc.todos.filter(({ _id }) => _id !== todoId)
            })
            const { docs } = await this.db.find({ selector: { userId } })
            return docs


        } catch (error) {
            throw error
        }
    }


    async finishTodo(projectId: string, todoId: string, userId: string) {
        try {
            const doc = await this.db.get(projectId);
            if (doc.userId !== userId) {
                throw new ForbiddenException('Project does not belong to user')
            }
            const todo = doc.todos.find(({ _id }) => _id === todoId);
            await this.db.put({
                ...doc,
                todos: [
                    ...doc.todos.filter(({ _id }) => _id !== todoId),
                    {
                        ...todo,
                        done: true,
                        finishDate: new Date(),
                    }
                ]
            })
            const { docs } = await this.db.find({ selector: { userId } })
            return docs


        } catch (error) {
            throw error
        }
    }

}