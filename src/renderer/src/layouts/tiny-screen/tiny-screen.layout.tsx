import React, { JSX, useState } from 'react'
import { TinyScreenLayoutContext } from './tiny-screenContext'
import { useGlobalState } from '../global/useGlobalState'

export const TinyScreenLayoutProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  const [tinyTest, setTinyTest] = useState('')
  const { screen } = useGlobalState()

  if (screen !== 'tiny') return <></>
  else
    return (
      <TinyScreenLayoutContext.Provider value={{ tinyTest, setTinyTest }}>
        {children}
      </TinyScreenLayoutContext.Provider>
    )
}
