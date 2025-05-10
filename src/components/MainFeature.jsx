import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ selectedCategory, categories }) => {
  // Icons
  const CheckIcon = getIcon('Check');
  const ChevronRightIcon = getIcon('ChevronRight');
  const ClockIcon = getIcon('Clock');
  const CalendarIcon = getIcon('Calendar');
  const CircleIcon = getIcon('Circle');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ArrowUpCircleIcon = getIcon('ArrowUpCircle');
  const XIcon = getIcon('X');
  const EditIcon = getIcon('Edit');
  const SaveIcon = getIcon('Save');
  const TrashIcon = getIcon('Trash');
  const PlusIcon = getIcon('Plus');
  const FilterIcon = getIcon('Filter');

  // Sample tasks data
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Write and submit the project proposal for client review',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      categoryId: '2', // Work
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Go for a run',
      description: 'Morning jog in the park for 30 minutes',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      categoryId: '3', // Health
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Read book chapter',
      description: 'Read chapter 5 of Clean Code',
      status: 'completed',
      priority: 'low',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      categoryId: '4', // Learning
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Grocery shopping',
      description: 'Buy vegetables, fruits, and milk',
      status: 'not-started',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      categoryId: '1', // Personal
      createdAt: new Date().toISOString()
    }
  ]);

  // States
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    categoryId: selectedCategory !== 'all' ? selectedCategory : '1'
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Get category color by id
  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#6366f1';
  };

  // Get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  // Get priority badge style
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="text-green-500" size={18} />;
      case 'in-progress':
        return <ClockIcon className="text-amber-500" size={18} />;
      case 'not-started':
      default:
        return <CircleIcon className="text-surface-400" size={18} />;
    }
  };

  // Apply category and status filters to tasks
  useEffect(() => {
    let result = [...tasks];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(task => task.categoryId === selectedCategory);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(task => task.status === filterStatus);
    }
    
    // Sort by due date (newest first)
    result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    setFilteredTasks(result);
  }, [tasks, selectedCategory, filterStatus]);

  // Handle task selection
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setEditedTask(task);
    setIsModalOpen(true);
    setEditMode(false);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setEditMode(false);
  };

  // Toggle task status
  const handleToggleStatus = (taskId, e) => {
    e.stopPropagation();
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          let newStatus;
          switch (task.status) {
            case 'not-started':
              newStatus = 'in-progress';
              break;
            case 'in-progress':
              newStatus = 'completed';
              break;
            case 'completed':
              newStatus = 'not-started';
              break;
            default:
              newStatus = 'not-started';
          }
          
          toast.success(`Task marked as ${newStatus.replace('-', ' ')}`, {
            position: "bottom-right",
            autoClose: 2000,
          });
          
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  // Handle edit mode
  const handleEditMode = () => {
    setEditMode(true);
  };

  // Handle edit task
  const handleEditTask = (field, value) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };

  // Save edited task
  const handleSaveEdit = () => {
    if (!editedTask.title.trim()) {
      toast.error("Task title cannot be empty", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === editedTask.id ? editedTask : task
      )
    );
    
    setEditMode(false);
    setSelectedTask(editedTask);
    
    toast.success("Task updated successfully", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setIsModalOpen(false);
    
    toast.info("Task deleted successfully", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Handle new task changes
  const handleNewTaskChange = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  // Save new task
  const handleSaveNewTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    
    const newTaskObj = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      categoryId: newTask.categoryId || (selectedCategory !== 'all' ? selectedCategory : '1')
    };
    
    setTasks(prev => [newTaskObj, ...prev]);
    setIsAddingTask(false);
    setNewTask({
      title: '',
      description: '',
      status: 'not-started',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      categoryId: selectedCategory !== 'all' ? selectedCategory : '1'
    });
    
    toast.success("New task added successfully", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3 sm:gap-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input pr-8"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <FilterIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" size={16} />
          </div>
        </div>
        
        <button 
          onClick={() => setIsAddingTask(true)}
          className="btn btn-primary"
        >
          <PlusIcon size={18} className="mr-1" />
          <span>Add Task</span>
        </button>
      </div>
      
      {/* Tasks List */}
      <div className="card divide-y divide-surface-100 dark:divide-surface-700">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
              <CheckIcon size={32} className="text-surface-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-surface-500 mb-4">
              {selectedCategory !== 'all' ? 
                `No tasks in this category${filterStatus !== 'all' ? ` with status "${filterStatus}"` : ''}` : 
                `No tasks found${filterStatus !== 'all' ? ` with status "${filterStatus}"` : ''}`}
            </p>
            <button 
              onClick={() => setIsAddingTask(true)}
              className="btn btn-primary"
            >
              <PlusIcon size={16} className="mr-1" />
              <span>Add Your First Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              onClick={() => handleTaskSelect(task)}
              className="p-4 hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button 
                    onClick={(e) => handleToggleStatus(task.id, e)}
                    className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform duration-200"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  
                  <div>
                    <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-surface-400' : ''}`}>
                      {task.title}
                    </h3>
                    
                    <div className="mt-1 flex items-center space-x-2 text-xs">
                      <span 
                        className="inline-flex items-center rounded-full px-2 py-0.5 font-medium"
                        style={{ 
                          backgroundColor: `${getCategoryColor(task.categoryId)}20`, 
                          color: getCategoryColor(task.categoryId) 
                        }}
                      >
                        {getCategoryName(task.categoryId)}
                      </span>
                      
                      <span className={`badge ${getPriorityStyle(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      
                      <span className="text-surface-500 flex items-center">
                        <CalendarIcon size={14} className="mr-1" />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <ChevronRightIcon size={18} className="text-surface-400" />
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Task Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 bg-surface-900/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="w-full max-w-xl bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {!editMode ? (
                      <>
                        <div className="bg-surface-100 dark:bg-surface-700 p-2 rounded-lg">
                          {getStatusIcon(selectedTask.status)}
                        </div>
                        <h2 className="text-xl font-semibold">
                          {selectedTask.title}
                        </h2>
                      </>
                    ) : (
                      <input
                        type="text"
                        value={editedTask.title}
                        onChange={(e) => handleEditTask('title', e.target.value)}
                        className="input text-lg font-semibold"
                        placeholder="Task title"
                      />
                    )}
                  </div>
                  
                  <button 
                    onClick={handleCloseModal}
                    className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {!editMode ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-surface-500 mb-1">Description</h3>
                        <p className="text-surface-900 dark:text-surface-100">
                          {selectedTask.description || "No description provided."}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Category</h3>
                          <span 
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium"
                            style={{ 
                              backgroundColor: `${getCategoryColor(selectedTask.categoryId)}20`, 
                              color: getCategoryColor(selectedTask.categoryId) 
                            }}
                          >
                            {getCategoryName(selectedTask.categoryId)}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Priority</h3>
                          <span className={`badge ${getPriorityStyle(selectedTask.priority)}`}>
                            {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Status</h3>
                          <span className="flex items-center">
                            {getStatusIcon(selectedTask.status)}
                            <span className="ml-1 capitalize">
                              {selectedTask.status.replace('-', ' ')}
                            </span>
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Due Date</h3>
                          <span className="flex items-center">
                            <CalendarIcon size={16} className="mr-1 text-surface-500" />
                            {format(new Date(selectedTask.dueDate), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-surface-500 mb-1">Description</h3>
                        <textarea
                          value={editedTask.description}
                          onChange={(e) => handleEditTask('description', e.target.value)}
                          className="input min-h-[100px]"
                          placeholder="Task description"
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Category</h3>
                          <select
                            value={editedTask.categoryId}
                            onChange={(e) => handleEditTask('categoryId', e.target.value)}
                            className="input"
                          >
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Priority</h3>
                          <select
                            value={editedTask.priority}
                            onChange={(e) => handleEditTask('priority', e.target.value)}
                            className="input"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Status</h3>
                          <select
                            value={editedTask.status}
                            onChange={(e) => handleEditTask('status', e.target.value)}
                            className="input"
                          >
                            <option value="not-started">Not Started</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-surface-500 mb-1">Due Date</h3>
                          <input
                            type="date"
                            value={editedTask.dueDate.split('T')[0]}
                            onChange={(e) => handleEditTask('dueDate', e.target.value)}
                            className="input"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-700 p-4 flex justify-between">
                {!editMode ? (
                  <>
                    <button 
                      onClick={() => handleDeleteTask(selectedTask.id)}
                      className="btn btn-outline text-red-500 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                    >
                      <TrashIcon size={18} className="mr-1" />
                      <span>Delete</span>
                    </button>
                    
                    <button 
                      onClick={handleEditMode}
                      className="btn btn-primary"
                    >
                      <EditIcon size={18} className="mr-1" />
                      <span>Edit</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleCloseModal}
                      className="btn btn-outline"
                    >
                      <XIcon size={18} className="mr-1" />
                      <span>Cancel</span>
                    </button>
                    
                    <button 
                      onClick={handleSaveEdit}
                      className="btn btn-primary"
                    >
                      <SaveIcon size={18} className="mr-1" />
                      <span>Save Changes</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Add New Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 bg-surface-900/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="w-full max-w-xl bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold">Add New Task</h2>
                  
                  <button 
                    onClick={() => setIsAddingTask(false)}
                    className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => handleNewTaskChange('title', e.target.value)}
                      className="input"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => handleNewTaskChange('description', e.target.value)}
                      className="input min-h-[100px]"
                      placeholder="Enter task description (optional)"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newTask.categoryId}
                        onChange={(e) => handleNewTaskChange('categoryId', e.target.value)}
                        className="input"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => handleNewTaskChange('priority', e.target.value)}
                        className="input"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Status
                      </label>
                      <select
                        value={newTask.status}
                        onChange={(e) => handleNewTaskChange('status', e.target.value)}
                        className="input"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => handleNewTaskChange('dueDate', e.target.value)}
                        className="input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-700 p-4 flex justify-end space-x-3">
                <button 
                  onClick={() => setIsAddingTask(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                
                <button 
                  onClick={handleSaveNewTask}
                  className="btn btn-primary"
                >
                  <PlusIcon size={18} className="mr-1" />
                  <span>Add Task</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;