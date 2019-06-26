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
    e.sender.send('timedTask-reply', `${task.title}==完成==${new Date()}`)
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