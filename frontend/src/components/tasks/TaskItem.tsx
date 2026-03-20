'use client';

import * as React from 'react';
import { Task } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, Circle, Clock, Edit2, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const isCompleted = task.status === 'COMPLETED';

  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <Card className={`transition-all ${isCompleted ? 'opacity-75 bg-gray-50' : 'hover:shadow-md'}`}>
      <CardContent className="p-4 sm:p-6 flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 flex-shrink-0 focus:outline-none rounded-full ${
            isCompleted ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <h4 className={`text-lg font-medium truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center text-xs text-gray-500 gap-4 mt-2">
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
