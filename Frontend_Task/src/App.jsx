import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/tasks"; // Update after deployment

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'Medium', dueDate: '', status: 'Pending'
  });

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  // Here we validate client side 
  const isFormValid = formData.title.trim() !== "" && formData.dueDate !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const res = await axios.post(API_URL, formData);
      setTasks([...tasks, res.data]); 
      setFormData({ title: '', description: '', priority: 'Medium', dueDate: '', status: 'Pending' });
    } catch (err) {
      alert("Error adding task");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    const res = await axios.put(`${API_URL}/${id}`, { status: newStatus });
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold mb-6">Task Tracker</h1>

      
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg mb-8 grid gap-4 md:grid-cols-2">
        <input 
          className="p-2 border rounded" 
          placeholder="Task Title *" 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
        />
        <input 
          type="date" 
          className="p-2 border rounded" 
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})} 
        />
        <select 
          className="p-2 border rounded"
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <textarea 
          className="p-2 border rounded md:col-span-2" 
          placeholder="Description (Optional)" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <button 
          disabled={!isFormValid}
          className={`md:col-span-2 p-3 rounded text-white font-bold ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Add Task
        </button>
      </form>

      {/* Here we  Render the task from */}
      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task._id} className="border p-4 rounded flex justify-between items-center shadow-sm">
            <div>
              <h3 className={`text-xl font-semibold ${task.status === 'Completed' ? 'line-through text-green-400' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <span className={`text-xs px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {task.priority}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(task._id, task.status)} className="text-sm bg-gray-200 px-3 py-1 rounded">
                {task.status === 'Pending' ? '✔️ Done' : '↩️ Undo'}
              </button>
              <button onClick={() => deleteTask(task._id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;