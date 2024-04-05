import { describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

describe('App', () => {
  test('should render input field and add button', () => {
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('should add task to list when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Task');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  test('should clear the input field after adding a task', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Task');
    await user.click(button);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('should not add an empty task', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const button = screen.getByRole('button', { name: 'Add' });

    await user.type(input, '   '); // Makes sense to also test with spaces
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
  });

  test('should add a task by pressing the enter key', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });

    await user.type(input, 'New Task{enter}');

    await waitFor(() => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(1);
    });
  });

  // edit & delete button should be visible if the task exists
  test('should render edit & delete buttons if task exists', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: 'Edit' });
    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  // on click of edit button input field & save & cancel button should be visible
  test('should render edit input, save & edit button on click of edit button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const editInput = screen.getByRole('textbox', { name: 'Edit Task:' });
    const saveButton = screen.getByRole('button', { name: 'Save' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(editInput).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  // on click of cancel button input should be hidden save hidden & edit delete visible
  test('on click of cancel button input should be hidden, save hidden & edit delete visible', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.type(input, 'New Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    const editInput = screen.queryByRole('textbox', { name: 'Edit Task:' });
    const saveButton = screen.queryByRole('button', { name: 'Save' });
    const editButtonAfterCancel = screen.queryByRole('button', {
      name: 'Edit',
    });
    const deleteButtonAfterCancel = screen.queryByRole('button', {
      name: 'Delete',
    });

    expect(editInput).not.toBeInTheDocument();
    expect(saveButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
    expect(editButtonAfterCancel).toBeInTheDocument();
    expect(deleteButtonAfterCancel).toBeInTheDocument();
  });

  // if user edits the task & click on save button then the task should be updated
  test('on click of save button, edited task should be saved', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByRole('textbox', { name: 'Add Task:' });
    const addButton = screen.getByRole('button', { name: 'Add' });

    // Add a task
    await user.type(input, 'New Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const editInput = screen.getByRole('textbox', { name: 'Edit Task:' });
    await user.clear(editInput);
    await user.type(editInput, 'Edited Task');

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
    expect(screen.getByText('Edited Task')).toBeInTheDocument();
  });
});
