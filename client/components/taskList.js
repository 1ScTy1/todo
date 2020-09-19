import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Item from './taskListItem'

const TaskList = ({ addTask, updateStatus, task, timeChange, deletedTask, updateTitle }) => {
  const [newTask, setNewTask] = useState('')
  return (
    <div>
      <div className="flex justify-between mb-10">
        <button
          className="w-1/3 p-4 text-blue-800 text-bold text-xl border-2 border-blue-800 bg-teal-400"
          type="button"
          onClick={() => timeChange('all')}
        >
          All
        </button>
        <button
          className="w-1/3 p-4 text-blue-800 text-bold text-xl border-2 border-blue-800 bg-teal-400"
          type="button"
          onClick={() => timeChange('day')}
        >
          Day
        </button>
        <button
          className="w-1/3 p-4 text-blue-800 text-bold text-xl border-2 border-blue-800 bg-teal-400"
          type="button"
          onClick={() => timeChange('week')}
        >
          Week
        </button>
        <button
          className="w-1/3 p-4 text-blue-800 text-bold text-xl border-2 border-blue-800 bg-teal-400"
          type="button"
          onClick={() => timeChange('month')}
        >
          Month
        </button>
      </div>
      <Link
        to="/"
        className="text-white border-2 rounded border-white hover:bg-black py-1 px-4 ml-10"
      >
        Back to Main
      </Link>
      <div className=" w-full mt-5 text-center text-xl">
        <input
          type="text"
          className="bg-gray-500 mr-4 border-4 border-white rounded mb-4 "
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="button" className="status" onClick={() => addTask(newTask)}>
          Add
        </button>
        {task.map((el) => (
          <Item
            className="h-10"
            el={el}
            updateStatus={updateStatus}
            updateTitle={updateTitle}
            deletedTask={deletedTask}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskList
