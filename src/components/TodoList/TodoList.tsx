import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  isDataLoading: boolean;
  isDeleting: boolean;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const { todos, onDeleteTodo, isDataLoading, isDeleting, tempTodo } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoComponent
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          isDataLoading={isDataLoading}
          isDeleting={isDeleting}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} onDeleteTodo={onDeleteTodo} />}
    </section>
  );
};
