import { Tag } from "antd";
import styled from "styled-components";
import React from "react";
const StyledMessage = styled.div`
    display: flex;
    align-items: center;
    flex-direction: ${({isMe}:{isMe: boolean}) => (isMe ? 'row-reverse' : 'row')};
    margin: 8px 10px;
    & p:first-child {
        margin: 0 5px;
    }

    & p:last-child {
        padding: 2px 5px;
        border-radius: 5px;
        background: #eee;
        color: gray;
        margin: auto 0;
    }
`;

type TMessageProps = {
    isMe: boolean,
    message: string,
}
const Message = ({ isMe, message}: TMessageProps) => {
    console.log(`isMe = ${isMe}, message = ${message}`);
    return (
        <StyledMessage isMe={isMe}>
            <p>{message}</p>
        </StyledMessage>
    );
};




export default Message;