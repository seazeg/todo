import {
  app,
  BrowserWindow,
  screen,
  ipcMain
} from 'electron'

import './timer'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let floatBox = null
let floatWidth = 80,
  floatHeight = 80
const floatURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`


function blurFn(e, win, param) {
  let x = win.getBounds().x,
    y = win.getBounds().y;
  e.sender.send('closeMainWin', true);
  setTimeout(() => {
    floatBox.setBounds({
      x: x,
      y: y,
      width: param.w,
      height: param.h
    });
  }, 300);
}

function moveFn(e, win, param) {
  let {
    width,
    height
  } = screen.getPrimaryDisplay().bounds
  let x = win.getBounds().x,
    y = win.getBounds().y;
  if (x < 0) {
    if (!param.isFloat) {
      e.sender.send('closeMainWin', true);
    }
    setTimeout(() => {
      floatBox.setBounds({
        x: 0,
        y: y,
        width: param.w,
        height: param.h
      })
    }, 100);

  } else if (x > width - param.w) {
    if (!param.isFloat) {
      e.sender.send('closeMainWin', true);
    }
    setTimeout(() => {
      floatBox.setBounds({
        x: width - param.w,
        y: y,
        width: param.w,
        height: param.h
      })
    }, 100);
  }
  if (y < 0) {
    if (!param.isFloat) {
      e.sender.send('closeMainWin', true);
    }
    setTimeout(() => {
      floatBox.setBounds({
        x: x,
        y: 0,
        width: param.w,
        height: param.h
      })
    }, 100);
  } else if (y > height - param.h) {
    if (!param.isFloat) {
      e.sender.send('closeMainWin', true);
    }
    setTimeout(() => {
      floatBox.setBounds({
        x: x,
        y: height - param.h,
        width: param.w,
        height: param.h
      })
    }, 100);
  }
}



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
    moveFn(e, floatBox, {
      w: floatWidth,
      h: floatHeight
    })
  })

  floatBox.on('blur', (e, cmd) => {
    blurFn(e, floatBox, {
      w: floatWidth,
      h: floatHeight
    })
  })

}

//打开主窗口
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

//打开气泡窗口
ipcMain.on('openBubbleWin', function (e, arg) {
  if (arg) {
    let x = floatBox.getBounds().x,
      y = floatBox.getBounds().y;


    floatBox.setBounds({
      x: x,
      y: y,
      width: 300,
      height: 300
    });
    
  }
});

//判断mode模式
ipcMain.on('modeStatus', function (e, arg) {
  if (arg == true) {
    //窗口模式
    removeListeners(floatBox);
    floatBox.on('move', (e, cmd) => {
      moveFn(e, floatBox, {
        w: 800,
        h: 600,
        isFloat: arg
      })
    })
  } else if (typeof arg == 'string') {
    //悬浮气泡弹出后
    removeListeners(floatBox);
    floatBox.on('move', (e, cmd) => {
      moveFn(e, floatBox, {
        w: 300,
        h: 300,
        isFloat: arg
      })
    })
  } else {
    //悬浮模式
    removeListeners(floatBox);
    floatBox.on('move', (e, cmd) => {
      moveFn(e, floatBox, {
        w: floatWidth,
        h: floatHeight
      })
    })
    floatBox.on('blur', (e, cmd) => {
      blurFn(e, floatBox, {
        w: floatWidth,
        h: floatHeight
      })
    });
  }
});


function removeListeners(win){
  win.removeAllListeners('blur');
  win.removeAllListeners('move')
}




//mac下全屏置顶hack
function macAllFullScreenTopHack(win) {
  app.dock.hide()
  win.setAlwaysOnTop(true, 'normal')
  win.setVisibleOnAllWorkspaces(true)
  win.setFullScreenable(false)
  win.show()
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