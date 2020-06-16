import {
  Controller,
  Get,
  Post,
  ValidationPipe,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  UsePipes,
  UseGuards,
  Logger,
  Patch,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { TaskList } from './list.entity';
import { CreateTaskListDto } from './dto/create-list.dto';
import { GetUserId } from '../auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateListDTO } from './dto/update-list.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/task.entity';

@ApiTags('Task lists')
@ApiBearerAuth()
@Controller('lists')
@UseGuards(AuthGuard())
export class ListsController {
  private logger = new Logger('ListsController');

  constructor(
    private listsService: ListsService,
    private tasksService: TasksService,
  ) {}

  @Get()
  getAllTaskLists(@GetUserId() userId: number): Promise<TaskList[]> {
    this.logger.verbose(`User ${userId} getting all task lists`);
    return this.listsService.getTaskLists(userId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTaskList(
    @Body() createTaskDto: CreateTaskListDto,
    @GetUserId() userId: number,
  ): Promise<TaskList> {
    this.logger.verbose(
      `User ${userId} creating task with payload ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.listsService.createTaskList(createTaskDto, userId);
  }

  @Get(':id')
  getTaskListById(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<TaskList> {
    this.logger.verbose(`User ${userId} getting the list id ${id}`);
    return this.listsService.getTaskListById(id, userId);
  }

  @Get(':id/tasks')
  getTasksByTaskListById(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<Task[]> {
    this.logger.log(`Getting all tasks for ${id}.`);
    return this.tasksService.getByTaskListId(id, userId);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateTaskList(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: UpdateListDTO,
    @GetUserId() userId: number,
  ): Promise<TaskList> {
    this.logger.log(updateListDto.title);
    return this.listsService.updateTaskList(id, userId, updateListDto);
  }

  @Delete(':id')
  deleteTaskListById(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<void> {
    return this.listsService.deleteTaskListById(id, userId);
  }
}
