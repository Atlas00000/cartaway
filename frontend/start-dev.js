const { spawn } = require('child_process');

console.log('Starting Next.js development server...');

const child = spawn('npx', ['next', 'dev', '--port', '3000'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
});

child.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

