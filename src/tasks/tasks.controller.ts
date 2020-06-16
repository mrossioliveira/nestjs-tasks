import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { ParseBooleanPipe } from './pipes/parse-boolean.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUserId } from '../auth/get-user.decorator';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@GetUserId() userId: number): Promise<Task[]> {
    return this.tasksService.getTasks(userId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get(':id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, userId);
  }

  @Delete(':id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDTO,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto, userId);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUserId() userId: number,
  ): Promise<Task> {
    this.logger.verbose(`User ${userId} update task ${id} status to ${status}`);
    return this.tasksService.updateTaskStatus(id, status, userId);
  }

  @Patch(':id/important')
  updateTaskImportant(
    @Param('id', ParseIntPipe) id: number,
    @Body('important', ParseBooleanPipe) important: boolean,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.updateTaskImportant(id, important, userId);
  }
}
