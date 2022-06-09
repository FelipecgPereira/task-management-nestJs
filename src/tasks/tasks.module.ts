import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entity/task.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports:[
    ConfigModule.forRoot({
      envFilePath:[`./env/postgres.env`]
    }),
    TypeOrmModule.forFeature([Task]),
    AuthModule
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
