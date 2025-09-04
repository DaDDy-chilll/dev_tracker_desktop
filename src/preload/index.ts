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
  },

  /**
   * Network interface methods for security headers
   */
  network: {
    // Get MAC address from main process
    getMacAddress: (): Promise<string | null> => {
      return ipcRenderer.invoke('get-mac-address')
    },
    // Get local IP address from main process
    getLocalIp: (): Promise<string | null> => {
      return ipcRenderer.invoke('get-local-ip')
    }
  },
  taskStatus: {
    // Send task status request to main process
    changeState: (
      status: string,
      projectDir: string,
      category: string,
      branchName: string
    ): void => {
      ipcRenderer.send('task-change-status', status, projectDir, category, branchName)
    },
    // Close the application
    close: (): void => {
      ipcRenderer.send('task-close')
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
