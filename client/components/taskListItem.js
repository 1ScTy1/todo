import React, { useState } from 'react'

const Item = ({ el, updateStatus, deletedTask, updateTitle }) => {
  const [edit, setEdit] = useState(false)
  const [editName, setEditName] = useState(el.title)
  return (
    <div>
      <div key={el.taskId} className="flex items center bodrder-2">
        {!edit ? (
          <div className="bodrder-2">
            <button type="button" onClick={() => setEdit(true)}>
              Edit
            </button>
            <div className="text-white">{el.title}</div>
            <div>
              {el.status === 'new' && (
                <button type="button" onClick={() => updateStatus(el.taskId, 'in progress')}>
                  in progress
                </button>
              )}
              {el.status === 'in progress' && (
                <div>
                  <button type="button" onClick={() => updateStatus(el.taskId, 'done')}>
                    Done
                  </button>
                  <button type="button" onClick={() => updateStatus(el.taskId, 'blocked')}>
                    Blocked
                  </button>
                </div>
              )}
              {el.status === 'blocked' && (
                <button type="button" onClick={() => updateStatus(el.taskId, 'new')}>
                  Unblocked
                </button>
              )}
              {el.status === 'done' && (
                <button type="button" onClick={() => deletedTask(el.taskId)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => {
                setEdit(false)
                updateTitle(el.taskId, editName)
              }}
            >
              Save
            </button>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
        )}
      </div>
    </div>
  )
}
export default Item
