import React, { JSX, useState } from 'react'
import { MiddleScreenLayoutContext } from './middle-screenContext'
import { useGlobalState } from '../global/useGlobalState'

export const MiddleScreenLayoutProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  const [middleTest, setMiddleTest] = useState('')
  const { screen } = useGlobalState()

  if (screen !== 'minimize') return <></>
  else
    return (
      <MiddleScreenLayoutContext.Provider value={{ middleTest, setMiddleTest }}>
        {children}
      </MiddleScreenLayoutContext.Provider>
    )
}
