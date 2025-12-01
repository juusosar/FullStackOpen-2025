import Notification from './Notification.jsx'

const LoginForm= ({ handleLogin, username, setUsername, password, setPassword, message, error }) => {
    return (
        <div>
            <h2>Log in to application</h2>
            <Notification message={ message } error={ error } />
            <form onSubmit={ handleLogin }>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={ username }
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={ password }
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm