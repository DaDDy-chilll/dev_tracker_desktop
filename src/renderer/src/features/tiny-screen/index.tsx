import { JSX } from 'react'
import { TinyScreenLayoutProvider } from '../../layouts/tiny-screen/tiny-screen.layout'
import { useTinyScreenState } from '@renderer/layouts/tiny-screen/useTinyScreenState'

const TinyScreen = (): JSX.Element => {
  const { tinyTest } = useTinyScreenState()
  return (
    <TinyScreenLayoutProvider>
      <div className=" text-red-500">this is tiny screen</div>
    </TinyScreenLayoutProvider>
  )
}

export default TinyScreen
