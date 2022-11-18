import {Modal, Input, Form} from 'antd';
import React from 'react';

type TChatModalProps = {
    open: boolean,
    onCreate: (values: {name: string}) => void,
    onCancel: () => void,
}
const ChatModal = ({open, onCreate, onCancel}: TChatModalProps) =>{
    const [form] = Form.useForm();
    return (
        <Modal 
            open={open}
            title="Create a new chatroom"
            okText = "Create"
            cancelText = "Cancel"
            onCancel={onCancel}
            onOk = {() =>{
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                        window.alert(info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name of the person of the chat!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ChatModal;