import { Logo } from '@renderer/components/icons'
import { Counter } from '@renderer/components/ui/Counter'
import { Colors } from '@renderer/constants/Colors'
import { JSX } from 'react'
const Header = (): JSX.Element => {
  return (
    <div className="w-full  flex justify-between items-center h-13 ">
      <div className="flex items-center gap-2" style={{ marginLeft: 10 }}>
        <Logo width={30} height={30} />
        <Counter liveClock={true} fontSize={24} digitStyle={{ color: Colors.primary }} />
      </div>
    </div>
  )
}

export default Header
