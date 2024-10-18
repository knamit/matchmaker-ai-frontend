import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Input, Button, List, Typography, Card, Space } from 'antd'
import ReactMarkdown from 'react-markdown'
import './styles.css';
const { Header, Sider, Content } = Layout
const { Text } = Typography

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Inc.',
  role: 'Product Manager'
}

const mockTools = [
  { id: 1, name: 'AI Writer Pro', description: 'Advanced AI-powered writing assistant' },
  { id: 2, name: 'SmartAnalyzer', description: 'Intelligent data analysis tool' },
  { id: 3, name: 'CodeGPT', description: 'AI pair programmer for developers' }
]

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface Tool {
  id: number;
  name: string;
  description: string;
}

const user = {
  photo: 'https://scontent.fsyd14-1.fna.fbcdn.net/v/t39.30808-6/309380614_754721388894625_9094021605852200057_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Sg40iTRVBb8Q7kNvgFwZZox&_nc_zt=23&_nc_ht=scontent.fsyd14-1.fna&_nc_gid=AZ3_F2xWKoLmLboBPXggCYK&oh=00_AYApnjfljUW2lw1o-ZW2RnWqyoJOfPHVsA85XmYLw0JhHQ&oe=67184FA7',
  name: 'Sarah Williams',
  position: 'Marketing Manager',
  company: 'InspireTech Marketing Solutions',
  contact: '0414720011',
};

export default function ChatPage({ setSelectedTool }: { setSelectedTool: (tool: any) => void }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [showText, setShowText] = useState(true);
  const navigate = useNavigate()

  const handleSend = (text: string) => {
    setShowText(false);
    if (!text) return;

    // Add user message to the chat
    setMessages(prevMessages => [...prevMessages, { text, sender: 'user' }]);

    // Scroll down to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);

    const data = { message: text };

    fetch('https://kqwxt0.buildship.run/tool_recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Add AI response to the chat
        console.log('data', data);
        setMessages(prevMessages => [...prevMessages, { text: data.message, sender: 'ai' }]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Clear the input field after sending
    setInput('');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} style={{ background: '#f0f2f5', padding: '20px' }}>
        <Card style={{ marginBottom: '20px', textAlign: 'center' }}>
          <img src={user.photo} alt="User" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
          <h3>{user.name}</h3>
        </Card>
        <Card title="Position" style={{ marginBottom: '20px' }}>
          {user.position}
        </Card>
        <Card title="Company" style={{ marginBottom: '20px' }}>
          {user.company}
        </Card>
        <Card title="Contact" style={{ marginBottom: '20px' }}>
          {user.contact}
        </Card>
      </Sider>
      <Layout>
        <Content style={{ padding: 24, background: '#fff', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <div style={{ flex: 1 }} />
          {showText && (
            <div className="centered-text" id='#div-to-remove'>
              Build Your Next Big Thing
            </div>
          )}
          <div style={{ flex: 1 }} />
          {messages && <List
            dataSource={messages}
            renderItem={message => (
              <List.Item
                style={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                }}
              >
                <Card style={{ maxWidth: '60%', background: message.sender === 'user' ? '#e6f7ff' : '#f0f0f0' }}>
                  {message.sender === 'ai' ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    <Text>{message.text}</Text>
                  )}
                </Card>
              </List.Item>
            )}
          />}
        </Content>
        <Header style={{ background: '#fff', padding: '10px 16px' }}>
          <Input.Search
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSearch={handleSend}
            enterButton="Send"
            placeholder="Type your request..."
          />
        </Header>
      </Layout>
    </Layout>
  )
}
