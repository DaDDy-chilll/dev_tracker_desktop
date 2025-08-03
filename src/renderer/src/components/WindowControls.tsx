import { useEffect, useState } from 'react'
import { IpcRendererEvent } from 'electron'
import { Expand, GalleryHorizontal, GalleryVerticalEnd, SquareX } from 'lucide-react'
import { Colors } from '@renderer/constants/Colors'
import { useGlobalState } from '@renderer/layouts/global/useGlobalState'

// Define the window state type to match the main process enum
type WindowState = 'tiny' | 'minimize' | 'maximize'

/**
 * WindowControls component provides custom window control buttons
 * for minimizing, maximizing, and closing the window.
 * It also handles the window state transitions between the three states:
 * - Tiny (top-left corner)
 * - Left-docked (full height)
 * - Fullscreen
 */
const WindowControls: React.FC = () => {
  // Track the current window state
  const [windowState, setWindowState] = useState<WindowState>('maximize')
  const { setScreen } = useGlobalState()

  useEffect(() => {
    // Safely check if window.electron exists before adding listeners
    if (window.electron && window.electron.ipcRenderer) {
      // Define the handler function separately for better cleanup
      const handleWindowStateUpdate = (_event: IpcRendererEvent, state: WindowState): void => {
        setWindowState(state)
      }

      // Listen for window state updates from the main process
      window.electron.ipcRenderer.on('window-state-updated', handleWindowStateUpdate)

      // Cleanup listener on unmount
      return () => {
        if (window.electron && window.electron.ipcRenderer) {
          window.electron.ipcRenderer.removeListener(
            'window-state-updated',
            handleWindowStateUpdate
          )
        }
      }
    }
    // Return empty cleanup function when electron is not available
    return () => {}
  }, [])


  const handleTiny = (): void => {
    try {
      if (window.api && window.api.windowControl) {
        window.api.windowControl.changeState('tiny')
        setScreen('tiny')
      } else {
        console.warn('Electron IPC not available for minimize')
      }
    } catch (error) {
      console.error('Error in minimize handler:', error)
    }
  }

  // Handle minimize button click (cycle down: full -> left -> tiny)
  const handleMinimize = (): void => {
    try {
      if (window.api && window.api.windowControl) {
        window.api.windowControl.changeState('minimize')
        setScreen('minimize')
      } else {
        console.warn('Electron IPC not available for minimize')
      }
    } catch (error) {
      console.error('Error in minimize handler:', error)
    }
  }

  // Handle maximize button click (cycle up: tiny -> left -> full)
  const handleMaximize = (): void => {
    try {
      if (window.api && window.api.windowControl) {
        window.api.windowControl.changeState('maximize')
        setScreen('maximize')
      } else {
        console.warn('Electron IPC not available for maximize')
      }
    } catch (error) {
      console.error('Error in maximize handler:', error)
    }
  }

  // Handle close button click
  const handleClose = (): void => {
    try {
      if (window.api && window.api.windowControl) {
        window.api.windowControl.close()
      } else {
        console.warn('Electron IPC not available for close')
      }
    } catch (error) {
      console.error('Error in close handler:', error)
    }
  }

  return (
    // Root element with highest possible z-index to ensure it's above everything
    <div className="window-controls" style={{ position: 'relative' }}>
      {/* Window controls container - positioned based on current state */}
      <div className="fixed top-3 right-3 flex items-center justify-between gap-6 z-9999 pointer-events-auto">
        {/* Tiny button */}
        {windowState !== 'tiny' && (
          <button
            onClick={handleTiny}
            className="window-control-button cursor-pointer"
            title="Minimize"
          >
            <GalleryVerticalEnd size={20} color={Colors.primaryForeground} />
          </button>
        )}

        {/* Left-docked button */}
        {windowState !== 'minimize' && (
          <button
            onClick={handleMinimize}
            className="window-control-button cursor-pointer"
            title="Maximize"
          >
            <GalleryHorizontal color={Colors.primaryForeground} size={20} />
          </button>
        )}

        {/* Fullscreen button */}
        {windowState !== 'maximize' && (
          <button
            onClick={handleMaximize}
            className="window-control-button cursor-pointer"
            title="Maximize"
          >
            <Expand color={Colors.primaryForeground} size={20} />
          </button>
        )}

        {/* Close button */}
        {windowState === 'maximize' && (
          <button
            onClick={handleClose}
            className="window-control-button cursor-pointer"
            title="Close"
          >
            <SquareX color={Colors.primaryForeground} size={20} />
            {/* <Expand color={Colors.primaryForeground} size={20} /> */}
          </button>
        )}
      </div>
    </div>
  )
}

export default WindowControls

// Root element with highest possible z-index to ensure it's above everything
// <div className="window-controls" style={{ position: 'relative' }}>
//   {/* Window controls container - positioned based on current state */}
//   <div
//     className={`window-controls-container ${windowState}`}
//     style={{
//       position: 'fixed',
//       top: 0,
//       right: 0,
//       padding: '10px',
//       display: 'flex',
//       gap: '10px',
//       zIndex: 9999, // Extremely high z-index to ensure it's on top of everything
//       // Make controls more visible in fullscreen mode
//       backgroundColor: windowState === 'full' ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
//       pointerEvents: 'auto' // Ensure clicks are captured
//     }}
//   >
//     {/* Minimize button */}
//     <button
//       onClick={handleMinimize}
//       className="window-control-button"
//       style={{
//         width: '24px',
//         height: '24px',
//         border: 'none',
//         borderRadius: '50%',
//         backgroundColor: '#ffbd44',
//         cursor: 'pointer',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//       title="Minimize"
//     >
//       <span style={{ fontSize: '16px', fontWeight: 'bold' }}>-</span>
//     </button>

//     {/* Maximize button */}
//     <button
//       onClick={handleMaximize}
//       className="window-control-button"
//       style={{
//         width: '24px',
//         height: '24px',
//         border: 'none',
//         borderRadius: '50%',
//         backgroundColor: '#00ca4e',
//         cursor: 'pointer',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//       title="Maximize"
//     >
//       <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span>
//     </button>

//     {/* Close button */}
//     <button
//       onClick={handleClose}
//       className="window-control-button"
//       style={{
//         width: '24px',
//         height: '24px',
//         border: 'none',
//         borderRadius: '50%',
//         backgroundColor: '#ff605c',
//         cursor: 'pointer',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//       title="Close"
//     >
//       <span style={{ fontSize: '16px', fontWeight: 'bold' }}>×</span>
//     </button>
//   </div>

//   {/* Timer display for tiny mode */}
//   {windowState === 'tiny' && (
//     <div
//       className="timer-display"
//       style={{
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         fontSize: '48px',
//         fontWeight: 'bold',
//         color: '#4ade80', // Green color for the timer
//         fontFamily: 'monospace'
//       }}
//     >
//       02:02:02
//     </div>
//   )}
// </div>
