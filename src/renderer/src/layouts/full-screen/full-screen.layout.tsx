import React, { JSX, useState } from 'react'
import { FullScreenLayoutContext } from './full-screenContext'
import { useGlobalState } from '../global/useGlobalState'
import { useToggle } from 'usehooks-ts'

export const FullScreenLayoutProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  const [dockType, setDockType] = useState<'dashboard' | 'kanban'>('dashboard')
  const { screen } = useGlobalState()
  const [value, toggle] = useToggle(true)
  const [selectedProjectId, setSelectedProjectId] = useState<{
    id: number
    projectDir: string
  }>({
    id: 0,
    projectDir: ''
  })

  if (screen !== 'maximize') return <></>
  else
    return (
      <FullScreenLayoutContext.Provider
        value={{
          dockType,
          setDockType,
          isViewPrice: value,
          priceToggle: toggle,
          selectedProjectId,
          setSelectedProjectId
        }}
      >
        {children}
      </FullScreenLayoutContext.Provider>
    )
}
