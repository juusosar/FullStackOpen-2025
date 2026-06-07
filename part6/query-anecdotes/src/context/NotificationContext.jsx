import { createContext, useState } from 'react'


const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState('')
  
  const notify = (message) => {
    if (notification) return
    
    setNotification(message)
    setTimeout(() => setNotification(''), 5000)
  }
  
  return (
    <NotificationContext.Provider value={ { notify, notification }}>
      {children}
    </NotificationContext.Provider>
  )
}