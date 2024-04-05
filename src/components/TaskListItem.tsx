import React from 'react';
type TaskListItemProps = {
  title: string;
  id: number;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
};
export default function TaskListItem({
  title,
  id,
  onDelete,
  onEdit,
}: TaskListItemProps) {
  const [isEdit, setIsEdit] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(title);

  const handleEditTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    onEdit(id, trimmedTitle);
    setIsEdit(false);
  };

  return (
    <li style={{ marginTop: '10px' }}>
      {isEdit ? (
        <form onSubmit={handleEditTask}>
          <label htmlFor="edit-task">Edit Task: </label>
          <input
            id="edit-task"
            type="text"
            value={editedTitle}
            required
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button>Save</button>
          <button onClick={() => setIsEdit(false)}>Cancel</button>
        </form>
      ) : (
        title
      )}
      {!isEdit && (
        <>
          <button style={{ margin: '0 10px' }} onClick={() => setIsEdit(true)}>
            Edit
          </button>
          <button onClick={() => onDelete(id)}>Delete</button>
        </>
      )}
    </li>
  );
}
