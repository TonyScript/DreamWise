#!/usr/bin/env node

/**
 * DreamWise Server Startup Script
 * This script helps set up and start the DreamWise backend server
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌙 DreamWise Server Setup');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  No .env file found. Creating from .env.example...');
    
    const exampleEnvPath = path.join(__dirname, '.env.example');
    if (fs.existsSync(exampleEnvPath)) {
        fs.copyFileSync(exampleEnvPath, envPath);
        console.log('✅ Created .env file from .env.example');
        console.log('📝 Please edit .env file with your configuration before starting the server\n');
    } else {
        console.log('❌ .env.example file not found');
        process.exit(1);
    }
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit', cwd: __dirname });
        console.log('✅ Dependencies installed successfully\n');
    } catch (error) {
        console.log('❌ Failed to install dependencies');
        console.log('Please run "npm install" manually in the server directory');
        process.exit(1);
    }
}

// Check SQLite database
console.log('🔍 Checking system requirements...');

try {
    // Check SQLite database path
    const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'database/dreamwise.sqlite');
    console.log(`📊 SQLite Database: ${dbPath}`);
    
    // Create database directory if it doesn't exist
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`✅ Created database directory: ${dbDir}`);
    }
    
    console.log('✅ SQLite database ready to use (no external database server required)');
} catch (error) {
    console.log('⚠️  Could not verify SQLite database:', error.message);
}

console.log('\n🚀 Starting DreamWise server...');
console.log('Press Ctrl+C to stop the server\n');

// Start the server
try {
    require('./server.js');
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
}