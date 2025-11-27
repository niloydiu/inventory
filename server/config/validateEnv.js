/**
 * Environment variables validation
 * Ensures all required environment variables are set before starting the server
 */
function validateEnv() {
  // Skip validation during build time (Vercel builds)
  if (process.env.VERCEL_ENV || process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⏭️  Skipping environment validation during build phase');
    return;
  }

  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Validate values in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET must be at least 32 characters in production');
      process.exit(1);
    }
    
    if (!process.env.MONGODB_URI.includes('mongodb+srv://') && !process.env.MONGODB_URI.includes('mongodb://')) {
      console.error('❌ Invalid MONGODB_URI format');
      process.exit(1);
    }

    if (!process.env.FRONTEND_URL) {
      console.error('❌ FRONTEND_URL must be set in production');
      process.exit(1);
    }

    console.log('✅ Production environment variables validated');
  } else {
    console.log('✅ Development environment variables validated');
  }
}

module.exports = validateEnv;
