import {IsEnum} from 'class-validator';
import { TaskStatus } from '../enum/task-status.enum';
export class UpdateTaskDto {
    @IsEnum(TaskStatus)
    status: TaskStatus;
  
}
