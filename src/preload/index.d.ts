import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      windowControl: {
        changeState: (direction: 'minimize' | 'maximize' | 'tiny') => void
        close: () => void
      }
      network: {
        getMacAddress: () => Promise<string | null>
        getLocalIp: () => Promise<string | null>
      }
      taskStatus: {
        changeState: (
          status: string,
          projectDir: string,
          category: string,
          branchName: string
        ) => void
        close: () => void
      }
    }
  }
}
