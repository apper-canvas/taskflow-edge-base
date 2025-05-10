import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Get icons
  const FolderXIcon = getIcon('FolderX');
  const HomeIcon = getIcon('Home');
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[70vh] text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-surface-100 dark:bg-surface-800/50 p-6 rounded-full mb-6">
        <FolderXIcon size={80} className="text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        404: Page Not Found
      </h1>
      
      <p className="text-lg md:text-xl mb-8 max-w-lg text-surface-600 dark:text-surface-300">
        Oops! The page you're looking for has disappeared, just like tasks when they're completed.
      </p>
      
      <Link to="/" className="btn btn-primary px-6 py-3 text-lg">
        <HomeIcon className="mr-2" size={20} />
        Back to Dashboard
      </Link>
      
      <div className="mt-12 w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-300 dark:border-surface-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface-50 dark:bg-surface-900 px-4 text-sm text-surface-500">
              Need help with anything else?
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;