import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entity/task.entity';

@Controller('tasks')
export class TasksController {
    
    constructor(private readonly tasksService: TasksService) {}
   
   @Get()
   getTasks(@Query() filterDto:GetTasksFilterDto): Promise<Task[]>{
       return this.tasksService.getTask(filterDto) 
   }

   @Get('/:id')
   getTaskById(@Param('id') id: string): Promise<Task>{
        
       return this.tasksService.getTaskById(id);
   }

   @Post()
   createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task>{
       
       return this.tasksService.createTask(createTaskDto)
   }

//    @Patch('/:id/status')
//    updateTask(@Param('id') id: string,@Body() {status}:UpdateTaskDto):Task{
   
//     return this.tasksService.updateTask(id,status)
//    }

   @Delete('/:id')
   deleteTask(@Param('id') id: string){
       this.tasksService.deleteTask(id);
   }
}
