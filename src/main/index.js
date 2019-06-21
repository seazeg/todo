import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  ipcRenderer
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let floatBox = null
let floatWidth = 80,
floatHeight = 80
const floatURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`




function floatWindow() {


  floatBox = new BrowserWindow({
    width: floatWidth,
    height: floatHeight,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    hasShadow: false,
    maximizable: false,
    minimizable: false
  })

  floatBox.once('ready-to-show', () => {


  })

  floatBox.loadURL(floatURL)

  floatBox.on('closed', () => {
    floatBox = null
  })




  macAllFullScreenTopHack(floatBox)



  //边缘吸附效果
  floatBox.on('move', (e, cmd) => {
    let {
      width,
      height
    } = screen.getPrimaryDisplay().bounds
    let x = floatBox.getBounds().x,
      y = floatBox.getBounds().y;
      if (x < 0) {
        e.sender.send('closeMainWin', true);
        floatBox.setBounds({
          x: 0,
          y: y,
          width: floatWidth,
          height: floatHeight
        })
        
      } else if (x > width - floatWidth) {
        e.sender.send('closeMainWin', true);
        floatBox.setBounds({
          x: width - floatWidth,
          y: y,
          width: floatWidth,
          height: floatHeight
        })
      }
      if (y < 0) {
        e.sender.send('closeMainWin', true);
        floatBox.setBounds({
          x: x,
          y: 0,
          width: floatWidth,
          height: floatHeight
        })
      } else if (y > height - floatHeight) {
        e.sender.send('closeMainWin', true);
        floatBox.setBounds({
          x: x,
          y: height - floatHeight,
          width: floatWidth,
          height: floatHeight
        })
      }
  })



  floatBox.on('blur', (e, cmd) => {
    let x = floatBox.getBounds().x,
      y = floatBox.getBounds().y;
    e.sender.send('closeMainWin', true);
    setTimeout(() => {
      floatBox.setBounds({
        x: x,
        y: y,
        width: floatWidth,
        height: floatHeight
      });
    }, 300);
  })
  
}

ipcMain.on('openMainWin', function (e, arg) {
  if (arg) {
    let x = floatBox.getBounds().x,
      y = floatBox.getBounds().y;
    floatBox.setBounds({
      x: x,
      y: y,
      width: 800,
      height: 600
    });
  }
});

ipcMain.on('modeStatus', function (e, arg) {
  console.log(arg);
});







//mac下全屏置顶hack
function macAllFullScreenTopHack(window) {
  app.dock.hide()
  window.setAlwaysOnTop(true, 'normal')
  window.setVisibleOnAllWorkspaces(true)
  window.setFullScreenable(false)
  window.show()
  app.dock.show()
}

app.on('ready', floatWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (floatWindow === null) {
    floatWindow()
  }
})