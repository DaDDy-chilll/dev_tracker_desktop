import { JSX } from 'react'
import { FullScreenLayoutProvider } from '../../layouts/full-screen/full-screen.layout'
import Header from './components/Header'
import { Dashboard } from './Dashboard'
import Project from './Project'
import Dock from './components/Dock'
const FullScreen = (): JSX.Element => {
  return (
    <FullScreenLayoutProvider>
      <Header />
      <Dashboard />
      <Project />
      <Dock />
    </FullScreenLayoutProvider>
  )
}

export default FullScreen
