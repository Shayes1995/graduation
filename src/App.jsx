import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Rootlayout from './rootlayout/Rootlayout';
import LoginRegister from './pages/LoginRegister';
import Home from './pages/Home';
import FindTalent from './pages/FindTalent';
import MyPage from './pages/MyPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/configfb';

const App = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDocRef = user.email === "Admin@test.com" ? doc(db, 'admins', 'admin') : doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setRole(userData.role);
                } else {
                    console.error("User document does not exist");
                }
            } else {
                setUser(null);
                setRole(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Rootlayout />,
            children: [
                {
                    path: '/',
                    element: <LoginRegister />,
                },
                {
                    path: '/home',
                    element: <Home />,
                },
                {
                    path: '/find-talent',
                    element: role === 'admin' ? <FindTalent /> : <Home />,
                },
                {
                    path: '/my-page',
                    element: user ? <MyPage /> : <LoginRegister />,
                },
            ],
        },
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
};

export default App;