import { v4 as uuid } from 'uuid';

export class Todo {
    public _id: string;
    public done: boolean;
    public startDate: Date;
    public finishDate?: Date;
    constructor(public description: string) {
        this._id = uuid()
        this.done = false
        this.startDate = new Date()
    }
}

export class Project {
    public _id: string;
    public todos: Todo[] = [];
    constructor(
        public name: string,
        public userId: string
    ) {
        this._id = uuid()
    }
}
