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
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
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
  getAllTaskLists(@GetUser() user: User): Promise<TaskList[]> {
    this.logger.verbose(`User ${user.username} getting all task lists`);
    return this.listsService.getTaskLists(user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTaskList(
    @Body() createTaskDto: CreateTaskListDto,
    @GetUser() user: User,
  ): Promise<TaskList> {
    this.logger.verbose(
      `User ${user.username} creating task with payload ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.listsService.createTaskList(createTaskDto, user);
  }

  @Get(':id')
  getTaskListById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TaskList> {
    this.logger.verbose(`User ${user.username} getting the list id ${id}`);
    return this.listsService.getTaskListById(id, user);
  }

  @Get(':id/tasks')
  getTasksByTaskListById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.log(`Getting all tasks for ${id}.`);
    return this.tasksService.getByTaskListId(id, user);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateTaskList(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: UpdateListDTO,
    @GetUser() user: User,
  ): Promise<TaskList> {
    this.logger.log(updateListDto.title);
    return this.listsService.updateTaskList(id, user, updateListDto);
  }

  @Delete(':id')
  deleteTaskListById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.listsService.deleteTaskListById(id, user);
  }
}
