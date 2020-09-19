import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/scss/main.scss'

const Main = ({ categories, addCategory, deleteFile }) => {
  const [newCategory, setNewCategory] = useState()
  return (
    <div className="w-full h-screen container mx-auto text-center">
      <h2 className="text-3xl text-bold text-yellow-500 my-10">TaskManager</h2>
      <input
        type="text"
        className="bg-gray-500 mr-4 border-4 border-white rounded mb-4 "
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button type="button" className="status" onClick={() => addCategory(newCategory)}>
        Add
      </button>
      <div>
        {categories.map((el) => (
          <div key={el} className="w-3/5 mx-auto flex justify-between border-4 p-4">
            <h2 className="text-2xl text-bold text-yellow-500 inline-block">Name :</h2>
            <Link className=" text-white mr-2 text-2xl text-orange-700" to={`/${el}`}>
              {el}
            </Link>
            <button type="button" className="status red" onClick={() => deleteFile(el)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Main
