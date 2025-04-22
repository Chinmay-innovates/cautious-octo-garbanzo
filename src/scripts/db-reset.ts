import { spawn } from 'child_process';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const runCommand = (cmd: string, args: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const process = spawn(cmd, args, { stdio: 'inherit' });

    process.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${cmd} ${args.join(' ')}" failed with code ${code}`));
      }
    });
  });
};

(async () => {
  console.log('🧨 Running db:fresh...');
  await runCommand('bun', ['run', 'payload', 'migrate:fresh']);

  console.log('⏳ Waiting 3 seconds...');
  await delay(3000);

  console.log('🌱 Running db:seed...');
  await runCommand('bun', ['run', 'src/scripts/seed.ts']);

  console.log('✅ Done!');
})();
