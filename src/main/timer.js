import schedule from 'node-schedule'
import {
  ipcMain
} from 'electron'


let taskList = []

ipcMain.on('timedTask-message', (e, task) => {
  if (taskList[task.id]) {
    taskList[task.id].cancel();
  }
  console.log(task);
  taskList[task.id] = schedule.scheduleJob(task.date, () => {
    console.log('完成');
    e.sender.send('timedTask-reply', `${JSON.stringify(task)}`)
  });

})

ipcMain.on('timedTaskCancel-message', (e, task) => {
  taskList[task.id].cancel();
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == task.id) {
      taskList.splice(i, 1)
    }
  }
})