import prisma from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { TaskInput, TaskQuery } from '../types';

export const createTask = async (userId: string, input: TaskInput) => {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status || 'PENDING',
      priority: input.priority || 'MEDIUM',
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId,
    },
  });
  return task;
};

export const getTasks = async (userId: string, query: TaskQuery) => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const skip = (page - 1) * limit;

  // Build filters
  const where: any = { userId };

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.q) {
    where.OR = [
      { title: { contains: query.q } },
      { description: { contains: query.q } },
    ];
  }

  // Run query + count in parallel
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  input: Partial<TaskInput>
) => {
  // Check task exists and belongs to user
  await getTaskById(userId, taskId);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    },
  });

  return task;
};

export const deleteTask = async (userId: string, taskId: string) => {
  // Check task exists and belongs to user
  await getTaskById(userId, taskId);

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: 'Task deleted successfully' };
};

export const toggleTaskStatus = async (userId: string, taskId: string) => {
  const task = await getTaskById(userId, taskId);

  // Cycle: PENDING → IN_PROGRESS → COMPLETED → PENDING
  const statusMap: Record<string, 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'> = {
    PENDING: 'IN_PROGRESS',
    IN_PROGRESS: 'COMPLETED',
    COMPLETED: 'PENDING',
  };

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status: statusMap[task.status] },
  });

  return updatedTask;
};