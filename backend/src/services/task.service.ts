import mongoose from 'mongoose';
import { Task } from '../models/task.model';
import { ApiError } from '../utils/apiError';
import { TaskInput, TaskQuery } from '../types';

const toObjectId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid ID');
  return new mongoose.Types.ObjectId(id);
};

const serializeTask = (task: any) => ({
  id: task._id.toString(),
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  userId: task.userId.toString(),
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export const createTask = async (userId: string, input: TaskInput) => {
  const task = await Task.create({
    title: input.title,
    description: input.description ?? null,
    status: input.status || 'PENDING',
    priority: input.priority || 'MEDIUM',
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    userId: toObjectId(userId),
  });
  return serializeTask(task);
};

export const getTasks = async (userId: string, query: TaskQuery) => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const skip = (page - 1) * limit;

  const filter: any = { userId: toObjectId(userId) };

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: 'i' } },
      { description: { $regex: query.q, $options: 'i' } },
    ];
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter),
  ]);

  return {
    tasks: tasks.map(serializeTask),
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
  const task = await Task.findOne({
    _id: toObjectId(taskId),
    userId: toObjectId(userId),
  }).lean();

  if (!task) throw new ApiError(404, 'Task not found');
  return serializeTask(task);
};

export const updateTask = async (
  userId: string,
  taskId: string,
  input: Partial<TaskInput>
) => {
  await getTaskById(userId, taskId);

  const updateData: any = { ...input };
  if (input.dueDate !== undefined) {
    updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  }

  const task = await Task.findByIdAndUpdate(
    toObjectId(taskId),
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!task) throw new ApiError(404, 'Task not found');
  return serializeTask(task);
};

export const deleteTask = async (userId: string, taskId: string) => {
  await getTaskById(userId, taskId);
  await Task.findByIdAndDelete(toObjectId(taskId));
  return { message: 'Task deleted successfully' };
};

export const toggleTaskStatus = async (userId: string, taskId: string) => {
  const task = await getTaskById(userId, taskId);

  const statusMap: Record<string, 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'> = {
    PENDING: 'IN_PROGRESS',
    IN_PROGRESS: 'COMPLETED',
    COMPLETED: 'PENDING',
  };

  const updated = await Task.findByIdAndUpdate(
    toObjectId(taskId),
    { $set: { status: statusMap[task.status] } },
    { new: true }
  ).lean();

  if (!updated) throw new ApiError(404, 'Task not found');
  return serializeTask(updated);
};
