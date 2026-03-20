'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ initialData, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'MEDIUM',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="title"
        label="Task Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title')}
      />
      
      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          rows={3}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Add some details..."
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full flex flex-col gap-1.5">
          <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            {...register('priority')}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
        </div>

        <Input
          id="dueDate"
          type="date"
          label="Due Date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
