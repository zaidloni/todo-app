import React from 'react';
import { Task } from './types';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import TaskListItem from './components/TaskListItem';
import TaskListHeader from './components/TaskListHeader';

function App() {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const onAddTask = (taskName: string) => {
    setTasks([
      ...tasks,
      {
        id: new Date().getTime(),
        title: taskName,
        isCompleted: false,
      },
    ]);
  };

  const onDeleteTask = (taskId: number) => {
    const confirmStatus = confirm('Are you sure you want to delete this task?');
    if (confirmStatus) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };
  const onEditTask = (taskId: number, newTitle: string) => {
    setTasks(
      tasks?.map((task) =>
        task?.id === taskId ? { ...task, title: newTitle } : task,
      ),
    );
  };

  return (
    <div>
      <h1>Tasks</h1>
      <AddTask onAddTask={onAddTask} />
      <TaskList header={<TaskListHeader count={tasks?.length} />}>
        {tasks?.map((task) => (
          <TaskListItem
            key={task?.id}
            id={task?.id}
            title={task?.title}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
          />
        ))}
      </TaskList>
    </div>
  );
}

export default App;
