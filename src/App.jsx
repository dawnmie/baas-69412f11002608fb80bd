import { useState, useEffect } from 'react'
import { account } from './appwrite'
import './DarkTheme.css'

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLoginMode, setIsLoginMode] = useState(true) // 新增状态：true为登录模式，false为注册模式

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await account.get()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (e) => {
    e.preventDefault()
    try {
      await account.createEmailPasswordSession(email, password)
      await checkUser()
    } catch (error) {
      alert(error.message)
    }
  }

  const register = async (e) => {
    e.preventDefault()
    try {
      await account.create('unique()', email, password, name)
      await login(e)
    } catch (error) {
      alert(error.message)
    }
  }

  const logout = async () => {
    await account.deleteSession('current')
    setUser(null)
  }

  if (loading) {
    return <div className="container"><p>Loading...</p></div>
  }

  if (user) {
    return (
      <div className="container">
        <div className="user-profile">
          <h1>Welcome back, {user.name || user.email.split('@')[0]}!</h1>
          <div className="user-info">
            <div className="info-item">
              <strong>Email:</strong> {user.email}
            </div>
            {user.name && (
              <div className="info-item">
                <strong>Name:</strong> {user.name}
              </div>
            )}
            <div className="info-item">
              <strong>Member since:</strong> {new Date(user.$createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="section">
            <h2>🚀 Quick Actions</h2>
            <div className="action-buttons">
              <button onClick={() => alert('Profile settings would open here')}>
                Edit Profile
              </button>
              <button onClick={() => alert('Account settings would open here')}>
                Account Settings
              </button>
            </div>
          </div>

          <div className="section">
            <h2>📊 Your Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">1</div>
                <div className="stat-label">Active Sessions</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{Math.floor(Math.random() * 10) + 1}</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{Math.floor(Math.random() * 50) + 10}</div>
                <div className="stat-label">Activities</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>💡 Tips & Features</h2>
            <ul className="features-list">
              <li>Secure authentication with Appwrite</li>
              <li>Responsive dark theme design</li>
              <li>Easy to extend with new features</li>
              <li>Modern React hooks implementation</li>
            </ul>
          </div>
        </div>

        <div className="logout-section">
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Appbuild</h1>
      
      {/* 切换按钮 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <button 
          type="button" 
          onClick={() => setIsLoginMode(true)}
          style={{
            flex: 1,
            padding: '8px',
            background: isLoginMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <button 
          type="button" 
          onClick={() => setIsLoginMode(false)}
          style={{
            flex: 1,
            padding: '8px',
            background: !isLoginMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
      </div>

      {/* 根据模式显示对应的表单 */}
      {isLoginMode ? (
        <form onSubmit={login}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={register}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  )
}

export default App