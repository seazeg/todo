import schedule from 'node-schedule'
import {
  ipcMain
} from 'electron'


let taskList = {}

ipcMain.on('timedTask-message', (e, task) => {
  if (taskList[task.id]) {
    taskList[task.id].cancel();
  }
  console.log(task);
  taskList[task.id] = schedule.scheduleJob(task.date, () => {
    e.sender.send('timedTask-reply', `${JSON.stringify(task)}`)
  });
  console.log('start=========>\n', taskList);

  for (let item in taskList) {
    if (!taskList[item]) {
      delete taskList[item]
    }
  }

})

ipcMain.on('timedTaskCancel-message', (e, taskId) => {
  taskList[taskId].cancel();
  for (let item in taskList) {
    if (item == taskId) {
      delete taskList[item]
    }
  }
  console.log('del=========>\n', taskList);
})