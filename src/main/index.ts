import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const iconPath = join(__dirname, '../../resources/icon.png')

// Window state enum to track current window state
enum WindowState {
  TINY = 'tiny', // Tiny window at top-left (first image)
  MINIMIZE = 'minimize', // Left-docked full height (second image)
  MAXIMIZE = 'maximize' // Fullscreen (third image)
}

// Store the current window state
// let currentWindowState: WindowState = WindowState.MAXIMIZE

function createWindow(): void {
  // Create the browser window without frame (removes min/max bar)
  const mainWindow = new BrowserWindow({
    show: false,
    roundedCorners: true,
    frame: false, // Remove default window frame (min/max/close buttons)
    alwaysOnTop: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: iconPath } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']) // e.g., http://localhost:5173
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')) // => file://...
  }

  // Set initial window state to fullscreen when ready to show
  mainWindow.on('ready-to-show', () => {
    setWindowState(mainWindow, WindowState.MAXIMIZE)
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  // ipcMain.on('ping', () => console.log('pong'))

  // Handle window state change requests from renderer
  ipcMain.on('window-state-change', (_, direction: 'minimize' | 'maximize' | 'tiny') => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (!mainWindow) return
    console.log('direction', direction)

    // Convert string to WindowState enum
    let windowState: WindowState
    switch (direction) {
      case 'tiny':
        windowState = WindowState.TINY
        break
      case 'minimize':
        windowState = WindowState.MINIMIZE
        break
      case 'maximize':
        windowState = WindowState.MAXIMIZE
        break
      default:
        console.error('Unknown window state:', direction)
        return
    }

    setWindowState(mainWindow, windowState)
  })

  // Handle window close request from renderer
  ipcMain.on('window-close', () => {
    app.quit()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/**
 * Sets the window state based on the specified state enum
 *
 * @param window - The BrowserWindow instance to modify
 * @param state - The desired window state
 */
function setWindowState(window: BrowserWindow, state: WindowState): void {
  // Get the screen size to calculate window dimensions
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  // Update the current window state
  console.log('Window state changed to:', state)

  // Send the current state to the renderer process
  window.webContents.send('window-state-updated', state)

  // Apply window size and position based on state
  switch (state) {
    case WindowState.TINY:
      // First image: Tiny window at top-left corner
      window.setFullScreen(false)
      // Ensure we're not in maximized state before setting bounds
      window.unmaximize()
      // Force a specific size for tiny mode
      window.setResizable(false)
      window.setBounds({
        width: 400, // Fixed width instead of percentage
        height: 100, // Small height for timer display
        x: 10,
        y: 40
      })
      // Log the actual bounds after setting
      console.log('Tiny window bounds:', window.getBounds())
      break

    case WindowState.MINIMIZE:
      // Second image: Left-docked window with full height
      window.setFullScreen(false)
      // Make window resizable again
      window.setResizable(true)
      window.setBounds({
        width: Math.floor(screenWidth * 0.2), // About 30% of screen width
        height: screenHeight - 50,
        x: 10,
        y: 40
      })
      console.log('Minimize window bounds:', window.getBounds())
      break

    case WindowState.MAXIMIZE:
      // Third image: Full screen window
      // Make window resizable again before going fullscreen
      window.setResizable(true)
      window.setFullScreen(true)
      console.log('Maximize window state set to fullscreen')
      break
  }
}
