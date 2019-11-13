import { app, BrowserWindow,ipcMain,Menu } from 'electron'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
console.log(BrowserWindow)

Menu.setApplicationMenu(null);
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    autoHideMenuBar:true,
    width: 1000,
    show: false,
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('ready-to-show',()=>{
    console.log(111)
    mainWindow.show();
    // mainWindow.send('router',{path:'/entry'});
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
let subWindosMaps = {};
let subWindow;
ipcMain.on('newWindow',(event,payload)=>{
    subWindow = new BrowserWindow({
        height: 400,
        width: 800,
        // useContentSize: true,
        show: false,
        // autoHideMenuBar:true,
        // frame: false, // 这样子窗口有头部 可以关闭和放大 缩小
        parent: mainWindow
    })
    // console.log(winURL+"/#/sub") //开发和构件时路由方式不同，不能用这个
    subWindow.loadURL(winURL);
    subWindow.on('ready-to-show',()=>{
        subWindow.show();
        subWindow.setTitle(payload.id)
        subWindow.send('router',{path:'/sub'+'/'+payload.id});
        // 缓存这个 subWindow到map里
        subWindosMaps[payload.id] = subWindow;
    })

    // 子窗口挂载了
    ipcMain.on('sub-ready', () => {
        console.log('sub-ready',payload);
        subWindow.send('msg',payload);
    })

    subWindow.on('focus', () => {
        for(var key in subWindosMaps){
            let subWin = subWindosMaps[key];
            subWin.setAlwaysOnTop(false);
        }
        subWindow.setAlwaysOnTop(true);
    })

    subWindow.on('closed', () => {
        // 注销所有事件监听
        subWindow = null;
        mainWindow.send('subwindow-closed',{...payload,msg:"这是子窗口关闭时发来的消息"});
        delete subWindosMaps[payload.id]
        console.log('closed' + payload.id)
    })
})

// 子窗口的消息监听
ipcMain.on('sub-to-main',(a,b)=>{
    // process的 console是在 控制台里
    console.log(b);
    mainWindow.send('sub-to-main',b);
})

ipcMain.on('main-to-sub',(a,b)=>{
    console.log(b);
    for(var key in subWindosMaps){
      let subWin = subWindosMaps[key];
      if(subWin){
          subWin.send && subWin.send('main-to-sub',b);
      }
    }
})




app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
