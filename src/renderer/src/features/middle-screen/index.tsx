import { JSX } from 'react'
import { MiddleScreenLayoutProvider } from '../../layouts/middle-screen/middle-screen.layout'
import { useMiddleScreenState } from '@renderer/layouts/middle-screen/useMiddleScreenState'

const MiddleScreen = (): JSX.Element => {
  const { middleTest } = useMiddleScreenState()
  console.log('middleTest Logs', middleTest)
  return (
    <MiddleScreenLayoutProvider>
      <div className=" text-red-500">this is middle screen</div>
    </MiddleScreenLayoutProvider>
  )
}

export default MiddleScreen
