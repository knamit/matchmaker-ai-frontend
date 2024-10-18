import { useState } from 'react'
import { Layout, Input, Button, List, Typography, Card } from 'antd'
import ReactMarkdown from 'react-markdown'
import './styles.css';
import axios from 'axios';

const { Header, Sider, Content } = Layout
const { Text } = Typography

interface Message {
  text: string;
  threadId?: string;
  sender: 'user' | 'ai' | 'ai-res';
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
  const [showText, setShowText] = useState(true)
  const [tools, setTools] = useState<{ name: string, tool_api_endpoint: string }[]>([])
  const [isbuildLoading, setisbuildLoading] = useState(false)
  const [isCrawlerLoading, setIsCrawlerLoading] = useState(false)

  const handleSend = (text: string) => {
    setShowText(false);
    if (!text) return;

    setMessages(prevMessages => [...prevMessages, { text, sender: 'user' }]);

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
        console.log('data', data);
        setMessages(prevMessages => [...prevMessages, { text: data.message, threadId: data.threadId, sender: 'ai' }]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setInput('');
  }

  const handleBuild = (message: any) => {
    setisbuildLoading(true)
    console.log(message);

    const body = {
      message: message.text,
      threadId: message.threadId
    };

    axios.post("https://kqwxt0.buildship.run/tool-options-api-parsed", body).then((res) => {
      console.log(res.data);
      setTools(res.data.tools)
      setisbuildLoading(false)

    })
      .catch((e) => {
        console.log(e)
        setisbuildLoading(false)
      })
  }

  const handleCrawl = (url: string) => {
    setIsCrawlerLoading(true)

    const body = {
      url: url,
    };

    axios.post("https://kqwxt0.buildship.run/crawl", body)
      .then(response => {
        console.log('Crawl response:', response.data);
        setMessages(prevMessages => [...prevMessages, { text: response.data, sender: 'ai-res' }]);
      })
      .catch(error => {
        console.error('Error during crawl:', error);
      });
    setIsCrawlerLoading(false)
  };


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
          {messages && 
          <List
            dataSource={messages}
            renderItem={message => (
              <List.Item
                style={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                  flexDirection: message.sender === 'user' ? "row" : "column"
                }}
              >
                <Card style={{ maxWidth: '60%', background: message.sender === 'user' ? '#e6f7ff' : '#f0f0f0' }}>
                  {message.sender === 'user' ? (
                    <Text>{message.text}</Text>
                  ) : (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  )}
                </Card>

                {message.sender === 'ai' && (
                  <div style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1rem"
                  }}>
                    <Button>
                      Regenerate
                    </Button>
                    <Button onClick={() => handleBuild(message)}>
                      {isbuildLoading ? "Loading..." : "Build"}
                    </Button>
                  </div>
                )}
                {message.sender === 'ai' && tools.length > 0 && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    {tools.map(tool => (
                      <Button
                        key={tool.name}
                        onClick={() => handleCrawl(tool.tool_api_endpoint)}
                      >
                        {isCrawlerLoading ? "Loading..." : tool.name}
                      </Button>
                    ))}
                  </div>
                )}
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
