import { ListsService } from './lists.service';
import { Test } from '@nestjs/testing';
import { TaskListRepository } from './list.repository';
import { TaskList } from './list.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskListDto } from './dto/create-list.dto';

const mockUser = { id: 42, username: 'Tester' };
const mockTaskListRepository = () => ({
  getTaskLists: jest.fn(),
  findOne: jest.fn(),
  createTaskList: jest.fn(),
  delete: jest.fn(),
});

describe('ListsService', () => {
  let listsService;
  let listRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListsService,
        {
          provide: TaskListRepository,
          useFactory: mockTaskListRepository,
        },
      ],
    }).compile();

    listsService = await moduleRef.get<ListsService>(ListsService);
    listRepository = await moduleRef.get<TaskListRepository>(
      TaskListRepository,
    );
  });

  describe('getTaskLists', () => {
    it('should return all task lists', async () => {
      listRepository.getTaskLists.mockResolvedValue('lists');

      expect(listRepository.getTaskLists).not.toHaveBeenCalled();

      const result = await listsService.getTaskLists(mockUser);

      expect(listRepository.getTaskLists).toHaveBeenCalled();
      expect(result).toEqual('lists');
    });
  });

  describe('getTaskListById', () => {
    const LIST_ID = 1;

    it('should return a task list for the given id', async () => {
      listRepository.findOne.mockResolvedValue(TaskList.createMock());

      const result = await listsService.getTaskListById(LIST_ID, mockUser.id);

      expect(result).toEqual(TaskList.createMock());
      expect(listRepository.findOne).toHaveBeenCalledWith(
        {
          id: LIST_ID,
          userId: mockUser.id,
        },
        { relations: ['tasks'] },
      );
    });

    it('should thrown an error as the list was not found', () => {
      listRepository.findOne.mockResolvedValue(null);
      expect(listsService.getTaskListById(LIST_ID, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTaskList', () => {
    it('should create and return a new task list', async () => {
      expect(listRepository.createTaskList).not.toHaveBeenCalled();

      const createTaskListDto = new CreateTaskListDto();
      createTaskListDto.title = 'Test task list';

      const expectedResult = {
        ...TaskList.createMock(),
        title: createTaskListDto.title,
        user: mockUser,
      };
      listRepository.createTaskList.mockResolvedValue(expectedResult);

      const result = await listsService.createTaskList(
        createTaskListDto,
        mockUser,
      );

      expect(listRepository.createTaskList).toHaveBeenCalledWith(
        createTaskListDto,
        mockUser,
      );
      expect(result.title).toEqual('Test task list');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTaskList', () => {
    it('should update a task list entity', async () => {
      const LIST_TITLE = 'Test title';
      const save = jest.fn().mockResolvedValue(true);

      listsService.getTaskListById = jest.fn().mockResolvedValue({
        title: LIST_TITLE,
        save,
      });

      expect(listsService.getTaskListById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const updateTaskDto = { title: LIST_TITLE };
      const result = await listsService.updateTaskList(
        1,
        mockUser,
        updateTaskDto,
      );

      expect(listsService.getTaskListById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.title).toEqual(LIST_TITLE);
    });
  });

  describe('deleteTaskListById', () => {
    it('should delete a task list', async () => {
      listRepository.delete.mockResolvedValue({ affected: 1 });

      expect(listRepository.delete).not.toHaveBeenCalled();

      await listsService.deleteTaskListById(1, mockUser.id);

      expect(listRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('should throw an exception as the list was not found', () => {
      listRepository.delete.mockResolvedValue({ affected: 0 });
      expect(listsService.deleteTaskListById(1, mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(listRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });
  });
});
