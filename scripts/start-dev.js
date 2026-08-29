const { spawn } = require('child_process');

const [portal = 'main', port = '3000'] = process.argv.slice(2);
const normalizedPortal = portal === 'main' ? '' : portal;

const env = {
  ...process.env,
  PORT: port,
  BROWSER: process.env.BROWSER || 'none',
};

if (normalizedPortal) {
  env.REACT_APP_LOCAL_SUBDOMAIN = normalizedPortal;
} else {
  delete env.REACT_APP_LOCAL_SUBDOMAIN;
}

const reactScriptsStart = require.resolve('react-scripts/scripts/start');

console.log(
  `Starting ${normalizedPortal || 'main'} portal on http://localhost:${port}`
);

const child = spawn(process.execPath, [reactScriptsStart], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});

child.on('exit', code => {
  process.exit(code ?? 0);
});
