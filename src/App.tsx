import { useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { AiOutlineSend } from 'react-icons/ai';
// import { BsCircle, BsCheckCircle } from 'react-icons/bs';
import { FcCheckmark } from 'react-icons/fc';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [task, setTask] = useState<Task>({ id: '', text: '', completed: false });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [typeTasks, setTypeTasks] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    if (typeTasks === 'all') return tasks;
    if (typeTasks === 'active') return tasks.filter((task) => !task.completed);
    if (typeTasks === 'completed') return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, typeTasks]);

  const activeTaskCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = () => {
    if (task) {
      setTasks((prevTasks) => [...prevTasks, { id: uuidv4(), text: task.text, completed: false }]);
      setTask({ id: '', text: '', completed: false });
      inputRef.current!.value = '';
    }
  };

  const toggleCheck = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleTypeCheck = (type: string) => {
    setTypeTasks(type);
  };

  const handleDelete = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    setTypeTasks('all');
  };

  return (
    <>
      <div className={'w-full overflow-y-auto'}>
        <div className={'m-auto max-w-[90rem] md:px-4'}>
          <div className={'m-auto max-w-[60rem] bg-gray-200'}>
            <div className={'mx-4 flex flex-col gap-4 py-4 md:items-center md:px-6'}>
              <h1
                className={
                  'text text-primary-500 pt2 text-4xl tracking-tight md:pt-7 md:text-7xl/[1.15]'
                }
              >
                todos
              </h1>
              <div className={'flex w-full flex-col gap-1'}>
                <div className={'relative flex items-center bg-white shadow-lg'}>
                  <input
                    ref={inputRef}
                    maxLength={45}
                    className={
                      'text-primary-500 w-full py-4 pr-12 pl-4 text-lg focus:outline-none md:text-2xl'
                    }
                    type="text"
                    placeholder="What needs to be done?"
                    onChange={handleChange}
                    name={'text'}
                  />
                  <button
                    className={'absolute right-4'}
                    onClick={handleSubmit}
                    disabled={!inputRef.current?.value}
                  >
                    <AiOutlineSend
                      className={`h-6 w-6 md:h-8 md:w-8 ${inputRef.current?.value ? 'cursor-pointer text-blue-500' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
                <ul className={'flex flex-col gap-[.15rem]'}>
                  {filteredTasks.map((task) => (
                    <li
                      key={task.id}
                      className={
                        'flex items-center gap-2 bg-white px-4 py-4 shadow-lg transition-all duration-200 md:gap-6'
                      }
                    >
                      <div
                        onClick={() => toggleCheck(task.id)}
                        className={`flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-full border border-gray-400 opacity-30 transition-all duration-200 md:min-h-8 md:min-w-8 ${task.completed ? 'opacity-70' : ''}`}
                      >
                        <FcCheckmark
                          className={`h-4 w-4 transition-all duration-200 md:h-6 md:w-6 ${task.completed ? 'opacity-100' : 'opacity-0'}`}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-primary-500 text-lg font-light tracking-tight break-all transition-all duration-200 md:text-2xl ${task.completed ? 'line-through opacity-20' : ''}`}
                        >
                          {task.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className={
                    'flex flex-col items-center justify-between gap-6 bg-white px-4 py-4 shadow-lg md:flex-row'
                  }
                >
                  <span className={'text-primary-50 text-lg tracking-tight'}>
                    {activeTaskCount} items left
                  </span>
                  <div className={'flex items-center gap-2 md:gap-4'}>
                    <button
                      onClick={() => handleTypeCheck('all')}
                      className={`text-primary-50 cursor-pointer text-lg tracking-tight transition-all duration-100 ${typeTasks === 'all' ? 'rounded-md border px-1' : ''}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleTypeCheck('active')}
                      className={`text-primary-50 cursor-pointer text-lg tracking-tight transition-all duration-100 ${typeTasks === 'active' ? 'rounded-md border px-1' : ''}`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => handleTypeCheck('completed')}
                      className={`text-primary-50 cursor-pointer text-lg tracking-tight transition-all duration-100 ${typeTasks === 'completed' ? 'rounded-md border px-1' : ''}`}
                    >
                      Completed
                    </button>
                  </div>
                  <button
                    onClick={handleDelete}
                    className={
                      'text-primary-50 hover:text-primary-500 cursor-pointer text-lg tracking-tight transition-all duration-200'
                    }
                  >
                    Clear completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
