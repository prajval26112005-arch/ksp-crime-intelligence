const { spawn } = require('child_process');

function startTunnel() {
  console.log('Starting localtunnel...');
  const lt = spawn('npx', ['localtunnel', '--port', '5173'], { shell: true });

  lt.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(text);
  });

  lt.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  lt.on('close', (code) => {
    console.log(`localtunnel process exited with code ${code}. Restarting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
