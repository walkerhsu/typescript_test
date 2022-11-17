import {useEffect} from 'react'
import styled from 'styled-components'
import { useChat } from './hooks/useChat'
import SignIn from './SignIn'
import ChatRoom from './ChatRoom'
import React from 'react'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 500px;
    margin: auto;
  `
  
function App() {
  // console.log("in")
  // const obj = useChat()
  // console.log(obj)
  const {status, me , signedIn, displayStatus} = useChat()
  useEffect( () => {
    displayStatus(status)
  } , [status])
  // const {me, signedIn} = useChat()

  // console.log(`me=${me}, signedIn=${signedIn}`);

  return (
    <Wrapper>
      {signedIn?<ChatRoom me={me}/>:<SignIn me={me}/>}
    </Wrapper>
  )
  
      
}

export default App
