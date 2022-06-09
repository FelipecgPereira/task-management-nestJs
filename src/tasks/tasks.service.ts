import { User } from './../auth/entities/user.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskStatus } from './enum/task-status.enum';

@Injectable()
export class TasksService {

    private readonly logger = new Logger(TasksService.name,{timestamp:true});
  
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository:Repository<Task>,
        ){}
  
   

    async getTask(filterDto: GetTasksFilterDto, user:User): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.taskRepository.createQueryBuilder('task');
        query.where({ user });
    
        if (status) {
          query.andWhere('task.status = :status', { status });
        }
    
        if (search) {
          query.andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
            { search: `%${search}%` },
          );
        }
    
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
            error.stack)
            throw new InternalServerErrorException();
            
        }
        
    }

    async getTaskById(id: string,user:User): Promise<Task> {
        const found = await this.taskRepository.findOneBy({id, user});

        if(!found){
            throw new NotFoundException(`Task with Id ${id} not found`);
            this.logger
        }

        return found

    }


    async createTask({title,description}: CreateTaskDto, user:User): Promise<Task>{
        const task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });
        this.taskRepository.save(task);
        return task;
    }

    async updateTask(id: string, status: TaskStatus,user:User): Promise<Task>{
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

    async deleteTask(id: string, user:User): Promise<void>{
        const found = await this.getTaskById(id, user);
        this.taskRepository.remove(found);
    }


}
