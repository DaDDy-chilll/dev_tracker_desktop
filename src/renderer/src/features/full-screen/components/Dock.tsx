import GlassSurface from '@renderer/components/ui/GlassSurface'
import { LayoutPanelLeft, SquareDashedKanban } from 'lucide-react'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX } from 'react'
import { Colors } from '@renderer/constants/Colors'
const Dock = (): JSX.Element => {
  const { setDockType, dockType } = useFullScreenState()
  return (
    <div className="absolute top-1 right-[50%] translate-x-1/2 flex justify-around items-center gap-2 bg-black/60 w-24 h-10 rounded-md">
      <button className="p-2 rounded-full cursor-pointer" onClick={() => setDockType('dashboard')}>
        <GlassSurface
          width={30}
          height={30}
          borderRadius={5}
          className={dockType !== 'dashboard' ? 'hidden' : ''}
        >
          <LayoutPanelLeft color={Colors.primary} size={20} />
        </GlassSurface>
        {dockType !== 'dashboard' && <LayoutPanelLeft color={Colors.primaryForeground} size={20} />}
      </button>
      <button className="p-2 rounded-full cursor-pointer" onClick={() => setDockType('kanban')}>
        <GlassSurface
          width={30}
          height={30}
          borderRadius={5}
          className={dockType !== 'kanban' ? 'hidden' : ''}
        >
          <SquareDashedKanban color={Colors.primary} size={20} />
        </GlassSurface>
        {dockType !== 'kanban' && <SquareDashedKanban color={Colors.primaryForeground} size={20} />}
      </button>
    </div>
  )
}

export default Dock
