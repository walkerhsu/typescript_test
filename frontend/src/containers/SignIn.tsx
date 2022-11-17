import LogIn from '../components/Login'
import Title from '../components/Title'
import {useChat} from './hooks/useChat'
import React from 'react'

interface Props {
    me: string;
}
const SignIn = ({me}: Props) => {
    // console.log(`me=${me}`);
    const {setMe, setSignedIn, displayStatus} = useChat();
    const handleLogin = (name: string): void => {
        if(!name)
            displayStatus({
                type: "error",
                msg: "Missing username."
            });
        else {
            console.log(`${name} signs in`);
            setSignedIn(true);
        }
    }
    const setName = (name:string): void => {
        if(name.length===1){
            name = name.toUpperCase();
            console.log("first letter, capitalizing");
        }
        else{
            console.log("not first letter");
        }
        setMe(name);
    }
    return (
        <>
            <Title name={me} />
            <LogIn me={me} setName={setName} onLogin={handleLogin} />
        </>
    );
}

export default SignIn;