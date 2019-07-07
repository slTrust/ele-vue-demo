import { app, BrowserWindow,ipcMain,Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

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
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
ipcMain.on('newWindow',(event,message)=>{
  let subWindow = new BrowserWindow({
    height: 400,
    width: 800,
    useContentSize: true,
    show: false,
    autoHideMenuBar:true,
    parent: mainWindow
  })
  // console.log(winURL+"/#/sub") //开发和构件时路由方式不同，不能用这个
  subWindow.loadURL(winURL);
  subWindow.on('ready-to-show',()=>{
    subWindow.show();
    subWindow.send('router',{path:'/sub'});
  })
  ipcMain.on('sub-ready', () => {
    
    console.log('sub-ready',message);
    subWindow.send('msg','info from main:'+message);
  })
  subWindow.on('closed', () => {
    mainWindow.send('subwindow-closed');
  })
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