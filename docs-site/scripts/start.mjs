import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const child = spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-p','4324','-H','127.0.0.1'],{stdio:'inherit',windowsHide:true});
let stopping = false;
function stop() {
 if (stopping || !child.pid || child.exitCode !== null) return;
 stopping = true;
 // Next may own a worker process; Windows termination must include its children.
 if (process.platform === 'win32') {
  const killer = spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
  killer.on('error',error=>{console.error(error);child.kill();});
 } else child.kill('SIGTERM');
}
const timer = setTimeout(()=>{console.log('文档站已运行 12 小时，自动停止。');stop();},12*60*60*1000);
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,stop);
child.on('error',error=>{console.error(error);clearTimeout(timer);process.exitCode=1;});
child.on('exit',code=>{clearTimeout(timer);process.exitCode=code??0;});
