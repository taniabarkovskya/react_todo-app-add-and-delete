import React from 'react';
import cn from 'classnames';
import { Filters } from '../../types/Filters';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  activeCount: number | undefined;
  completedCount: number | undefined;
  status: Filters;
  setStatus: Dispatch<SetStateAction<Filters>>;
  onDeleteAllCompleted: () => {};
};

export const Footer: React.FC<Props> = props => {
  const {
    activeCount,
    completedCount,
    status,
    setStatus,
    onDeleteAllCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setStatus(Filters.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setStatus(Filters.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setStatus(Filters.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteAllCompleted}
        disabled={!completedCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
