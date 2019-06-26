import schedule from 'node-schedule'
import {
  ipcMain
} from 'electron'




ipcMain.on('timedTask-message', (e, date) => {
  schedule.scheduleJob(date, () => {
    e.sender.send('asynchronous-reply', 'wancheng')
  });
})