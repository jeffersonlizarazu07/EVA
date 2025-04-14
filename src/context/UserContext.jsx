import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 

const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Lee los valores desde las cookies si existen
  const [userId, setUserId] = useState(() => Cookies.get('userId') || ''); 
  const [userType, setUserType] = useState(() => Cookies.get('userType') || ''); 
  const [accessToken, setAccessToken] = useState(() => Cookies.get('accessToken') || ''); 
  const [languageUser, setLanguageUser] = useState(() => Cookies.get('languageUser') || '');
  const [clients, setClients] = useState(() => Cookies.get('clients') || '');

  useEffect(() => {
    const tabCount = sessionStorage.getItem('tabCount');
    sessionStorage.setItem('tabCount', tabCount ? parseInt(tabCount) + 1 : 1);

    // Guarda los valores en las cookies
    if (userId) {
      Cookies.set('userId', userId, { expires: 1 / 24, path: '/' }); 
    }

    if (userType) {
      Cookies.set('userType', userType, { expires: 1 / 24, path: '/' });
    }

    if (accessToken) {
      Cookies.set('accessToken', accessToken, { expires: 1 / 24, path: '/' });
    }

    if (languageUser) {
      Cookies.set('languageUser', languageUser, { expires: 1 / 24, path: '/' });
    }

    if (clients) {
      Cookies.set('clients', clients, { expires: 1 / 24, path: '/' });
    }

    // Elimina las cookies cuando el usuario cierre la sesión
    const handleBeforeUnload = () => {
      const tabCount = sessionStorage.getItem('tabCount');
      if (tabCount) {
        const newCount = parseInt(tabCount) - 1;
        sessionStorage.setItem('tabCount', newCount);

        if (newCount === 0) {
          // Elimina las cookies
          Cookies.remove('userId');
          Cookies.remove('userType');
          Cookies.remove('accessToken');
          Cookies.remove('languageUser');
          Cookies.remove('clients');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId, userType, accessToken, languageUser, clients]);

  return (
    <UserContext.Provider value={{ userId, setUserId, userType, setUserType, accessToken, setAccessToken, languageUser, setLanguageUser, clients, setClients }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
