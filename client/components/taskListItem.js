import React, { useState } from 'react'

const Item = ({ el, updateStatus, deletedTask, updateTitle }) => {
  const [edit, setEdit] = useState(false)
  const [editName, setEditName] = useState(el.title)
  return (
    <div className="w-3/5 container mx-auto border-4 border-b-0 ">
      <div key={el.taskId}>
        {!edit ? (
          <div className="w-full h-24 flex items-center justify-center">
            <h2 className="w-1/3 text-center text-2xl text-bold text-yellow-500">Name of Task :</h2>
            <div className="w-2/3 text-white mr-2 text-2xl text-bold text-orange-700">
              {el.title}
            </div>
            <div className="w-1/3 ">
              {el.status === 'new' && (
                <button
                  type="button"
                  className="status"
                  onClick={() => updateStatus(el.taskId, 'in progress')}
                >
                  in progress
                </button>
              )}
              {el.status === 'in progress' && (
                <div>
                  <button
                    type="button"
                    className="status"
                    onClick={() => updateStatus(el.taskId, 'done')}
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    className="status red mb-4"
                    onClick={() => updateStatus(el.taskId, 'blocked')}
                  >
                    Blocked
                  </button>
                </div>
              )}
              {el.status === 'blocked' && (
                <button
                  type="button"
                  className="status"
                  onClick={() => updateStatus(el.taskId, 'new')}
                >
                  Unblocked
                </button>
              )}
              {el.status === 'done' && (
                <button type="button" className="status red" onClick={() => deletedTask(el.taskId)}>
                  Delete
                </button>
              )}
              <button type="button" className="status" onClick={() => setEdit(true)}>
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="status"
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
