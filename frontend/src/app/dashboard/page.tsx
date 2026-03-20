import { TaskList } from '../../components/tasks/TaskList';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage your tasks, priorities, and deadlines.
        </p>
      </div>
      
      <TaskList />
    </div>
  );
}
