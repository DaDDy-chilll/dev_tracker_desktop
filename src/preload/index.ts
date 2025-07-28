import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  /**
   * Window control methods for managing window state
   */
  windowControl: {
    // Send window state change request to main process
    changeState: (direction: 'minimize' | 'maximize' | 'tiny'): void => {
      ipcRenderer.send('window-state-change', direction)
    },
    // Close the application
    close: (): void => {
      ipcRenderer.send('window-close')
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
