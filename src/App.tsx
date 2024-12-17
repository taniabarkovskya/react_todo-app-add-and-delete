/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Filters } from './types/Filters';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorTodos, setErrorTodos] = useState('');
  const [status, setStatus] = useState(Filters.All);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleErrorClose = () => {
    setErrorTodos('');
  };

  const visibleTodos = todos?.filter(todo => {
    switch (status) {
      case Filters.Completed:
        return todo.completed;
      case Filters.Active:
        return todo.completed === false;
      default:
        return true;
    }
  });

  const activeTodosCount = todos?.filter(todo => !todo.completed).length;

  const completedTodos = todos?.filter(todo => todo.completed);
  const completedTodosCount = completedTodos.length;

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(error => {
        setErrorTodos('Unable to load todos');
        throw new Error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onAddTodo = async (newTodo: Omit<Todo, 'id'>): Promise<void> => {
    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch (error) {
      setErrorTodos('Unable to add a todo');
      throw error;
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    try {
      setIsDeleting(true);
      await deleteTodo(todoId);
      setTodos(currentTodos =>
        currentTodos?.filter(todo => todo.id !== todoId),
      );
    } catch (error) {
      setErrorTodos('Unable to delete a todo');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const onDeleteAllCompleted = () => {
    const values: Promise<void>[] = [];

    completedTodos.forEach(completedTodo => {
      values.push(onDeleteTodo(completedTodo.id));
    });

    Promise.all(values)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos?.filter(todo => todo.completed === false),
        );
      })
      .catch(error => {
        setErrorTodos('Unable to delete a todo');
        throw new Error(error);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          completedTodosCount={completedTodosCount}
          onAddTodo={onAddTodo}
          setErrorTodos={setErrorTodos}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
        />

        {todos?.length && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              isDataLoading={isLoading}
              isDeleting={isDeleting}
              tempTodo={tempTodo}
            />

            <Footer
              activeCount={activeTodosCount}
              completedCount={completedTodosCount}
              status={status}
              setStatus={setStatus}
              onDeleteAllCompleted={onDeleteAllCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={errorTodos}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
