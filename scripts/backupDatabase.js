import { exec } from 'child_process';

const backupCommand = `mongodump --db=mydatabase --out=./backup`;
exec(backupCommand, (error, stdout, stderr) => {
  if (error) console.error(`Error: ${error.message}`);
  else console.log('Database backup successful');
});
