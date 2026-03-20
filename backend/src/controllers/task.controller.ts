import { Request, Response } from 'express';
import { catchAsync } from '../utils/apiError';
import { taskSchema, updateTaskSchema } from '../utils/validation';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../services/task.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const validated = taskSchema.parse(req.body);
  const task = await createTask(req.user!.userId, validated as any);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await getTasks(req.user!.userId, req.query as any);

  res.status(200).json({
    success: true,
    message: 'Tasks fetched successfully',
    data: result,
  });
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const task = await getTaskById(req.user!.userId, id);

  res.status(200).json({
    success: true,
    message: 'Task fetched successfully',
    data: task,
  });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const validated = updateTaskSchema.parse(req.body);
  const task = await updateTask(req.user!.userId, id, validated as any);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await deleteTask(req.user!.userId, id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const toggle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const task = await toggleTaskStatus(req.user!.userId, id);

  res.status(200).json({
    success: true,
    message: `Task status updated to ${task.status}`,
    data: task,
  });
});