import React, { useState } from 'react'

import CharPicker from './components/CharPicker'
import Character from './components/Character'

const App = props => {
  /* 
    useState() always returns a array which contains 2 variables, we can use array-destructuring to get them.
    The first variable we got is the state, at the beginning it is the initial state we passed into useState() function
    The second variable is a setter function which responsible for updating the state
  */
  const [side, setSide] = useState('light')
  const [selectedCharacter, setSelectedCharacter] = useState(1)
  const [destroyed, setDestroyed] = useState(false)

  const sideHandler = side => {
    setSide(side)
  }

  const charSelectHandler = event => {
    const charId = event.target.value
    setSelectedCharacter(charId)
  }

  const destructionHandler = () => {
    setDestroyed(true)
  }

  let content = (
    <React.Fragment>
      <CharPicker
        side={side}
        selectedChar={selectedCharacter}
        onCharSelect={charSelectHandler}
      />
      <Character selectedChar={selectedCharacter} />
      <button onClick={() => sideHandler('light')}>Light Side</button>
      <button onClick={() => sideHandler('dark')}>Dark Side</button>
      {side === 'dark' && (
        <button onClick={destructionHandler}>DESTROY!</button>
      )}
    </React.Fragment>
  )

  if (destroyed) {
    content = <h1>Total destruction!</h1>
  }
  return content
}

export default App
