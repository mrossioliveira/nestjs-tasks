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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateListDTO } from './dto/update-list.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Task lists')
@ApiBearerAuth()
@Controller('lists')
@UseGuards(AuthGuard())
export class ListsController {
  private logger = new Logger('ListsController');

  constructor(private listsService: ListsService) {}

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
    return this.listsService.getTaskListById(id, user);
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
  deleteTaskListById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.listsService.deleteTaskListById(id);
  }
}
