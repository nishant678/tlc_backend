const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/connection');
const { setupTables } = require('./config/setupTables');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const questionTypeRoutes = require('./routes/questionTypeRoutes');
const questionAnswerRoutes = require('./routes/questionAnswerRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for profile images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/question-types', questionTypeRoutes);
app.use('/api/question-answers', questionAnswerRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    // Check for JWT_SECRET (warning instead of error)
    const defaultSecret = 'default_dev_secret_key_change_in_production_min_32_chars_required';
    const isUsingDefaultSecret = !process.env.JWT_SECRET;
    
    if (isUsingDefaultSecret) {
      console.warn('⚠️  WARNING: JWT_SECRET is not set in environment variables!');
      console.warn('💡 Authentication features may not work properly.');
      console.warn('💡 Please set JWT_SECRET in your environment variables:');
      console.warn('   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars');
      // Use a default development secret (NOT recommended for production)
      process.env.JWT_SECRET = defaultSecret;
      console.warn('⚠️  Using default JWT_SECRET. This is NOT secure for production!');
    } else {
      console.log('✅ JWT_SECRET is configured');
    }

    // Test database connection
    console.log('🔄 Testing database connection...');
    const isConnected = await testConnection();

    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    // Setup database tables
    console.log('🔄 Setting up database tables...');
    await setupTables();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API base URL: http://localhost:${PORT}/api`);
      if (isUsingDefaultSecret) {
        console.warn('⚠️  Remember to set JWT_SECRET environment variable for production!');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
