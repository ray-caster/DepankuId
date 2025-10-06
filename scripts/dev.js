#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Depanku.id development servers...\n');

// Start Flask backend
const backend = spawn('python', ['app.py'], {
    cwd: path.join(__dirname, '..', 'backend'),
    stdio: 'inherit',
    shell: true
});

// Start Next.js frontend
const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit();
});

backend.on('error', (err) => {
    console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
    console.error('❌ Frontend error:', err);
});

