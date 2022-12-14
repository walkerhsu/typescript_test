import {Input} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import React from 'react'

type TLogInProps = {
    me: string,
    setName: (name: string) => void,
    onLogin: (signedIn: string) => void,
}
const LogIn = ({me, setName, onLogin}: TLogInProps) => {
    return (
        <Input.Search
            size="large"
            style={{width: 300, margin: 50}}
            prefix={<UserOutlined />}
            placeholder="Enter your name"
            value={me}
            onChange={(e) => setName(e.target.value)}
            enterButton="Sign In"
            onSearch={(name)=>onLogin(name)}
        ></Input.Search>
    );
}

export default LogIn