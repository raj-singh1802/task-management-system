'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { Task, TasksResponse } from '../../types';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export function TaskList() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const { data, isLoading, error } = useQuery<TasksResponse>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data.data;
    },
  });

  const createTask = useMutation({
    mutationFn: (newTask: any) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
      setIsFormOpen(false);
    },
    onError: () => toast.error('Failed to create task'),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...updateData }: any) => api.put(`/tasks/${id}`, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
      setEditingTask(null);
      setIsFormOpen(false);
    },
    onError: () => toast.error('Failed to update task'),
  });

  const toggleTask = useMutation({
    mutationFn: (id: string) => api.patch(`/tasks/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: () => toast.error('Failed to toggle task status'),
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: () => toast.error('Failed to delete task'),
  });

  const handleFormSubmit = async (formData: any) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...formData });
    } else {
      createTask.mutate(formData);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center text-red-600">
          Failed to load tasks. Please try again.
        </CardContent>
      </Card>
    );
  }

  const tasks = data?.tasks || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Your Tasks</h2>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <TaskForm 
              initialData={editingTask} 
              onSubmit={handleFormSubmit} 
              onCancel={handleCancel}
              isLoading={createTask.isPending || updateTask.isPending}
            />
          </CardContent>
        </Card>
      )}

      {tasks.length === 0 && !isFormOpen ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-white">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating a new task.</p>
          <Button onClick={() => setIsFormOpen(true)}>Create your first task</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(id) => toggleTask.mutate(id)}
              onDelete={(id) => {
                if(confirm('Are you sure you want to delete this task?')) {
                  deleteTask.mutate(id);
                }
              }}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Just importing an icon for empty state
import { CheckSquare } from 'lucide-react';
