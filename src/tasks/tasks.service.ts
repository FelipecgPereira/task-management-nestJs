import { createQueryBuilder, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskStatus } from './enum/task-status.enum';

@Injectable()
export class TasksService {
  
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository:Repository<Task>,
        ){}
  
   

    async getTask(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.taskRepository.createQueryBuilder('task');
    
        if (status) {
          query.andWhere('task.status = :status', { status });
        }
    
        if (search) {
          query.andWhere(
            'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
            { search: `%${search}%` },
          );
        }
    
        const tasks = await query.getMany();
        return tasks;
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.taskRepository.findOne({id});

        if(!found){
            throw new NotFoundException(`Task with Id ${id} not found`);
        }

        return found

    }


    async createTask({title,description}: CreateTaskDto): Promise<Task>{
        const task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN
        });
        this.taskRepository.save(task);
        return task;
    }

    async updateTask(id: string, status: TaskStatus): Promise<Task>{
        const task = await this.getTaskById(id);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

    async deleteTask(id: string): Promise<void>{
        const found = await this.getTaskById(id);
        this.taskRepository.remove(found);
    }


}
