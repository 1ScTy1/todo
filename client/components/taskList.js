import React, { useState } from 'react'
import Item from './taskListItem'

const TaskList = ({ addTask, updateStatus, task, timeChange, deletedTask, updateTitle }) => {
  const [newTask, setNewTask] = useState('')
  return (
    <div>
      <div className="flex justify-between">
        <button
          className="w-1/3 p-4 text-white border-2 bg-teal-400"
          type="button"
          onClick={() => timeChange('all')}
        >
          All
        </button>
        <button
          className="w-1/3 p-4 text-white border-2 bg-teal-400"
          type="button"
          onClick={() => timeChange('day')}
        >
          Day
        </button>
        <button
          className="w-1/3 p-4 text-white border-2 bg-teal-400"
          type="button"
          onClick={() => timeChange('week')}
        >
          Week
        </button>
        <button
          className="w-1/3 p-4 text-white border-2 bg-teal-400"
          type="button"
          onClick={() => timeChange('month')}
        >
          Month
        </button>
      </div>
      <div className="text-center">
        {task.map((el) => (
          <Item
            el={el}
            updateStatus={updateStatus}
            updateTitle={updateTitle}
            deletedTask={deletedTask}
          />
        ))}
      </div>
      <input type="text" className="bg-gray-500" onChange={(e) => setNewTask(e.target.value)} />
      <button type="button" onClick={() => addTask(newTask)}>
        Add
      </button>
    </div>
  )
}

export default TaskList
