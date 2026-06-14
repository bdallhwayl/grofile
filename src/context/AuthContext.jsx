import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import { logActivity } from '../services/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper for mock users database
  const getMockUsers = () => JSON.parse(localStorage.getItem('mock_users')) || [];
  const setMockUsers = (users) => localStorage.setItem('mock_users', JSON.stringify(users));

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Check if admin email or admin role in firestore
          const isOwnerEmail = user.email.toLowerCase() === 'bdallhwaylg@gmail.com';
          let hasAdminRole = false;

          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              hasAdminRole = userDoc.data().role === 'admin';
              setCurrentUser({ ...user, ...userDoc.data() });
            } else {
              // Create user document if doesn't exist
              const initialData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'مستخدم جديد',
                photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
                role: isOwnerEmail ? 'admin' : 'user',
                createdAt: new Date().toISOString()
              };
              await setDoc(doc(db, 'users', user.uid), initialData);
              setCurrentUser({ ...user, ...initialData });
            }
          } catch (e) {
            console.error("Firestore user fetch error: ", e);
            setCurrentUser(user);
          }

          setIsAdmin(isOwnerEmail || hasAdminRole);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Mock Auth Initialization
      const mockActive = JSON.parse(localStorage.getItem('mock_active_user'));
      if (mockActive) {
        setCurrentUser(mockActive);
        setIsAdmin(mockActive.role === 'admin' || mockActive.email.toLowerCase() === 'bdallhwaylg@gmail.com');
      }
      setLoading(false);
    }
  }, []);

  // 1. REGISTER
  const register = async (email, password, displayName) => {
    setLoading(true);
    const lowercaseEmail = email.toLowerCase();
    const isOwnerEmail = lowercaseEmail === 'bdallhwaylg@gmail.com';
    const role = isOwnerEmail ? 'admin' : 'user';
    const defaultPhoto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60';

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName, photoURL: defaultPhoto });
        
        const userData = {
          uid: user.uid,
          email: lowercaseEmail,
          displayName,
          photoURL: defaultPhoto,
          role,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        setCurrentUser({ ...user, ...userData });
        setIsAdmin(role === 'admin');
        await logActivity(`تسجيل حساب جديد للمستخدم: ${displayName} (${email})`, displayName);
        return user;
      } catch (err) {
        setLoading(false);
        throw err;
      }
    } else {
      // Mock Register
      const mockUsers = getMockUsers();
      if (mockUsers.find(u => u.email === lowercaseEmail)) {
        setLoading(false);
        throw new Error('البريد الإلكتروني مسجل بالفعل');
      }

      const newMockUser = {
        uid: `user-${Date.now()}`,
        email: lowercaseEmail,
        password, // stored plain for mock demo only
        displayName,
        photoURL: defaultPhoto,
        role,
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(newMockUser);
      setMockUsers(mockUsers);
      
      localStorage.setItem('mock_active_user', JSON.stringify(newMockUser));
      setCurrentUser(newMockUser);
      setIsAdmin(role === 'admin');
      setLoading(false);
      await logActivity(`تسجيل حساب تجريبي للمستخدم: ${displayName} (${email})`, displayName);
      return newMockUser;
    }
  };

  // 2. LOGIN
  const login = async (email, password) => {
    setLoading(true);
    const lowercaseEmail = email.toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await logActivity(`تسجيل دخول المستخدم: ${email}`, email);
        return userCredential.user;
      } catch (err) {
        setLoading(false);
        throw err;
      }
    } else {
      // Mock Login
      const lowercaseOwnerEmail = 'bdallhwaylg@gmail.com';
      let mockUsers = getMockUsers();
      
      // Seed default admin in mock mode if it does not exist
      if (!mockUsers.find(u => u.email === lowercaseOwnerEmail)) {
        const defaultAdmin = {
          uid: 'admin-mock-1',
          email: lowercaseOwnerEmail,
          password: 'adminpassword', // Default password for local testing
          displayName: 'عبد الله وائل فتحي',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        mockUsers.push(defaultAdmin);
        setMockUsers(mockUsers);
      }

      const user = mockUsers.find(u => u.email === lowercaseEmail && u.password === password);
      if (user) {
        localStorage.setItem('mock_active_user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAdmin(user.role === 'admin' || user.email === lowercaseOwnerEmail);
        setLoading(false);
        await logActivity(`تسجيل دخول تجريبي للمسؤول/المستخدم: ${user.displayName}`, user.displayName);
        return user;
      } else {
        setLoading(false);
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    }
  };

  // 3. LOGOUT
  const logout = async () => {
    setLoading(true);
    const userName = currentUser?.displayName || 'غير معروف';
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem('mock_active_user');
      setCurrentUser(null);
      setIsAdmin(false);
    }
    await logActivity(`تسجيل خروج للمستخدم: ${userName}`, userName);
    setLoading(false);
  };

  // 4. RESET PASSWORD
  const resetPassword = async (email) => {
    if (isFirebaseConfigured && auth) {
      return sendPasswordResetEmail(auth, email);
    } else {
      const mockUsers = getMockUsers();
      const user = mockUsers.find(u => u.email === email.toLowerCase());
      if (!user) throw new Error('البريد الإلكتروني غير مسجل');
      // For mock purposes, just alert/simulate
      console.log(`[Mock reset email sent to ${email}]. Password was: ${user.password}`);
      return true;
    }
  };

  // 5. UPDATE PROFILE
  const updateUserProfile = async (displayName, photoURL) => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName, photoURL });
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, { displayName, photoURL }, { merge: true });
      setCurrentUser(prev => ({ ...prev, displayName, photoURL }));
    } else if (currentUser) {
      // Mock update
      const mockUsers = getMockUsers();
      const index = mockUsers.findIndex(u => u.uid === currentUser.uid);
      if (index !== -1) {
        mockUsers[index].displayName = displayName;
        mockUsers[index].photoURL = photoURL;
        setMockUsers(mockUsers);
        
        const updated = { ...currentUser, displayName, photoURL };
        localStorage.setItem('mock_active_user', JSON.stringify(updated));
        setCurrentUser(updated);
      }
    }
    await logActivity(`تحديث بيانات الحساب الشخصي`);
  };

  // 6. UPDATE PASSWORD
  const updateUserPassword = async (newPass) => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await updatePassword(auth.currentUser, newPass);
    } else if (currentUser) {
      const mockUsers = getMockUsers();
      const index = mockUsers.findIndex(u => u.uid === currentUser.uid);
      if (index !== -1) {
        mockUsers[index].password = newPass;
        setMockUsers(mockUsers);
        
        const updated = { ...currentUser, password: newPass };
        localStorage.setItem('mock_active_user', JSON.stringify(updated));
        setCurrentUser(updated);
      }
    }
    await logActivity(`تغيير كلمة المرور الخاصة بالحساب`);
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
