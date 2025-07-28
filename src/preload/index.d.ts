import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      windowControl: {
        changeState: (direction: 'minimize' | 'maximize' | 'tiny') => void
        close: () => void
      }
    }
  }
}
