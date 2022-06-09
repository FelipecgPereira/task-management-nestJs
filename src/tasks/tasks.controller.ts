import { User } from './../auth/entities/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Logger } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entity/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
    
    private readonly logger = new Logger(TasksController.name);
    
    constructor(private readonly tasksService: TasksService) {}

   
   @Get()
   getTasks(@Query() filterDto:GetTasksFilterDto, @GetUser() user:User): Promise<Task[]>{
       this.logger.verbose(`User "${user.username}" retrieving all tasks`)
       return this.tasksService.getTask(filterDto,user) 
   }

   @Get('/:id')
   getTaskById(@Param('id') id: string, 
   @GetUser() user:User): Promise<Task>{
        
       return this.tasksService.getTaskById(id,user);
   }

   @Post()
   createTask(
       @Body() createTaskDto: CreateTaskDto,
       @GetUser() user:User,
       ): Promise<Task>{
        this.logger.verbose(`User "${user.username}" created new task.`)
       return this.tasksService.createTask(createTaskDto,user)
   }

//    @Patch('/:id/status')
//    updateTask(@Param('id') id: string,@Body() {status}:UpdateTaskDto):Task{
   
//     return this.tasksService.updateTask(id,status)
//    }

   @Delete('/:id')
   deleteTask(@Param('id') id: string,
   @GetUser() user:User){
       this.tasksService.deleteTask(id,user);
   }
}
