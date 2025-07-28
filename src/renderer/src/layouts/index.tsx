import { JSX, useState } from 'react'
import { GlobalStateContext, User, Theme, WindowState } from './global/globalStateContext'
import ScreenBackground from '../components/ui/ScreenBackground'
import CursorClick from '@renderer/components/ui/CursorClick'
// import WindowControls from '../components/WindowControls'

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [screen, setScreen] = useState<WindowState>('maximize')

  return (
    <GlobalStateContext.Provider value={{ user, setUser, theme, setTheme, setScreen, screen }}>
      <ScreenBackground>
        <CursorClick>{children}</CursorClick>
      </ScreenBackground>
    </GlobalStateContext.Provider>
  )
}
