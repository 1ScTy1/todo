import React, { useEffect, useState } from 'react'
import { Route, useParams } from 'react-router-dom'
import axios from 'axios'
import Main from './main'
import TaskList from './taskList'
import '../assets/scss/main.scss'

const Home = () => {
  const { category } = useParams()
  const [categories, setCategories] = useState([])
  const [task, setTask] = useState([])
  const updateStatus = (id, status) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { status })
    setTask(task.map((el) => (el.taskId === id ? { ...el, status } : el)))
  }
  const updateTitle = (id, title) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { title })
    setTask(task.map((el) => (el.taskId === id ? { ...el, title } : el)))
  }
  const deletedTask = (id) => {
    axios.delete(`/api/v1/${category}/${id}`)
  }
  const deleteFile = (name) => {
    axios.delete(`/api/v1/tasks/${name}`)
  }
  const addCategory = (newCategory) => {
    if (newCategory) {
      axios.post(`/api/v1/tasks/${newCategory}`)
      setCategories([...categories, newCategory])
    }
  }
  const addTask = (newTask) => {
    if (newTask !== '') {
      axios
        .post(`/api/v1/tasks/${category}`, { title: newTask })
        .then(({ data }) => setTask([...task, data.newTask]))
    }
  }
  const timeChange = (time) => {
    axios(`/api/v1/tasks/${category}/${time}`).then(({ data }) => setTask(data))
  }
  useEffect(() => {
    axios('/api/v1/categories').then(({ data }) => setCategories(data))
  }, [])
  useEffect(() => {
    axios(`/api/v1/tasks/${category}`).then(({ data }) => setTask(data))
  }, [category])
  return (
    <div>
      <Route
        exact
        path="/"
        component={() => (
          <Main categories={categories} addCategory={addCategory} deleteFile={deleteFile} />
        )}
      />
      <Route
        exact
        path="/:category"
        component={() => (
          <TaskList
            task={task}
            timeChange={timeChange}
            updateStatus={updateStatus}
            addTask={addTask}
            deletedTask={deletedTask}
            updateTitle={updateTitle}
          />
        )}
      />
    </div>
  )
}

Home.propTypes = {}

export default Home
