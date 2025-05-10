import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Personal', color: '#6366f1' },
    { id: '2', name: 'Work', color: '#ec4899' },
    { id: '3', name: 'Health', color: '#10b981' },
    { id: '4', name: 'Learning', color: '#f59e0b' }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    toast.info(`Category filtered: ${categoryId === 'all' ? 'All Tasks' : 
      categories.find(c => c.id === categoryId)?.name || 'Unknown'}`, {
      position: "bottom-right",
      autoClose: 2000,
    });
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Create icon components
  const CheckSquareIcon = getIcon('CheckSquare');
  const LayersIcon = getIcon('Layers');
  const PlusIcon = getIcon('Plus');
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  const BoxesIcon = getIcon('Boxes');

  return (
    <div className="flex h-full relative">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden absolute top-0 left-4 z-30">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white dark:bg-surface-800 shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700"
        >
          {isSidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-surface-900/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:relative z-20 h-full w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 shadow-md md:shadow-none 
          md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={{ x: window.innerWidth < 768 ? -320 : 0 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center">
              <LayersIcon className="mr-2" size={18} />
              Categories
            </h2>
            <button className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
              <PlusIcon size={18} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => handleCategorySelect('all')}
                className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 
                  ${selectedCategory === 'all' 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <BoxesIcon size={18} className="mr-2" />
                <span>All Tasks</span>
              </button>
            </li>
            {categories.map(category => (
              <li key={category.id}>
                <button 
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 
                    ${selectedCategory === category.id 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span>{category.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-0 md:ml-6 mt-12 md:mt-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center">
              <CheckSquareIcon className="mr-2 text-primary" size={24} />
              {selectedCategory === 'all' 
                ? 'All Tasks' 
                : categories.find(c => c.id === selectedCategory)?.name || 'Tasks'}
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Manage and organize your tasks efficiently
            </p>
          </div>
          <button className="btn btn-primary hidden sm:flex">
            <PlusIcon size={18} className="mr-1" />
            <span>Add Task</span>
          </button>
          <button className="btn btn-primary p-2 sm:hidden">
            <PlusIcon size={18} />
          </button>
        </div>

        <MainFeature 
          selectedCategory={selectedCategory} 
          categories={categories}
        />
      </main>
    </div>
  );
};

export default Home;