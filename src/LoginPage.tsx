import { useNavigate } from 'react-router-dom'
import { Button, Card, Typography } from 'antd'

const { Title } = Typography

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) {
  const navigate = useNavigate()

  const handleSSOLogin = () => {
    // Simulate SSO login
    setIsLoggedIn(true)
    navigate('/chat')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 300 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>AI Tool Recommendation Platform</Title>
        <Button type="primary" onClick={handleSSOLogin} block>
          Login with SSO
        </Button>
      </Card>
    </div>
  )
}
