import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Main = ({ categories, addCategory }) => {
  const [newCategory, setNewCategory] = useState()
  return (
    <div>
      <div>
        {categories.map((el) => (
          <div key={el}>
            <Link to={`/${el}`}>{el}</Link>
          </div>
        ))}
      </div>
      <input type="text" className="bg-gray-500" onChange={(e) => setNewCategory(e.target.value)} />
      <button type="button" onClick={() => addCategory(newCategory)}>
        Add
      </button>
    </div>
  )
}
export default Main
