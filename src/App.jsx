import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'

const tickRate = 1000

const globalStyles = css`
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-family: monospace;
`

const StyledButton = styled.button`
  ${globalStyles}
  background: none;
  border: none;
  color: blue;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: underline;
    outline: none;
  }
`
const StyledDiv = styled.div`
  ${globalStyles}
`

function App() {
  const [multipliers, setMultipliers] = useState({
    researchRatePerScientist: 0.1,
    publicationsPerResearch: 0.1,
    supportersPerPublication: 0.05
  })
  const [state, setState] = useState({
    scientists: null,
    research: null,
    equipment: null,
    publications: null,
    supporters: null
  })
  function update() {
    setState(prevState => ({
      ...prevState,
      ...(prevState.research !== null && prevState.scientists !== null
        ? {
            day: (prevState.day || 0) + 1,
            research:
              prevState.research +
              prevState.scientists *
                (prevState.equipment + 1) *
                multipliers.researchRatePerScientist,
            publications:
              prevState.publications +
              prevState.research * multipliers.publicationsPerResearch,
            supporters:
              prevState.supporters +
              prevState.publications * multipliers.supportersPerPublication
          }
        : {})
    }))
  }
  useEffect(() => {
    setInterval(update, tickRate)
  }, [])
  const filteredState = Object.entries({
    ...state,
    ...(state.scientists !== null
      ? {
          'global support': (state.supporters / (7 * 10 ** 6)) * 100
        }
      : {})
  }).filter(([, value]) => value !== null)
  console.log(filteredState)
  return (
    <div className="App">
      {filteredState.length === 0 && (
        <StyledButton
          onClick={() =>
            setState(prevState => ({
              ...prevState,
              scientists: 0,
              ...(prevState.research === null
                ? { research: 0, supporters: 0, equipment: 0 }
                : {})
            }))
          }>
          Save the earth.
        </StyledButton>
      )}
      {/* {state.scientists !== null && (
        <>


        </>
      )} */}
      {filteredState.map(([key, value]) => (
        <StyledDiv key={key}>
          {key}: {Math.floor(value)}.{' '}
          {key === 'scientists' && (
            <StyledButton
              // inline
              onClick={() =>
                setState(prevState => ({
                  ...prevState,
                  scientists: prevState.scientists + 1
                }))
              }>
              Hire scientist
            </StyledButton>
          )}
          {key === 'equipment' &&
            state.scientists &&
            state.scientists > 0 &&
            state.equipment < state.scientists && (
              <StyledButton
                onClick={() =>
                  setState(prevState => ({
                    ...prevState,
                    equipment: prevState.equipment + 1
                  }))
                }>
                Purchase science equipment
              </StyledButton>
            )}
        </StyledDiv>
      ))}
    </div>
  )
}

export default App
