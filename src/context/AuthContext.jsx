import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { ref, set, get } from 'firebase/database';

// React Context that holds auth state and functions.
// Any component in the tree can access the logged-in user via useAuth()
// without having to pass props down manually.
const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // While Firebase checks if the user is still logged in, we block rendering
  // the app to avoid a flash of "logged out" UI
  const [loading, setLoading] = useState(true);

  // Sign up
  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update Firebase Auth profile so user.displayName is immediately available
    await updateProfile(user, { displayName });

    // Store extra user info in Realtime Database (Auth only stores email/uid by default)
    await set(ref(db, `users/${user.uid}`), {
      displayName: displayName,
      email: user.email,
    });

    // Manually sync currentUser state because onAuthStateChanged may not
    // fire fast enough to reflect the updated displayName right away
    setCurrentUser({ ...user, displayName });

    return userCredential;
  };

  // Log in
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in RTDB, if not create them.
    // Google sign-in may be used by first-time users, so we create a DB record only once.
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      await set(userRef, {
        displayName: user.displayName,
        email: user.email,
      });
    }

    return result;
  };

  // Log out
  const logout = () => {
    return signOut(auth);
  };

  // onAuthStateChanged is a Firebase listener that fires whenever the user's
  // auth state changes (login, logout, page refresh). It runs once on mount,
  // sets currentUser to the logged-in user (or null), and clears the loading flag.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup: unsubscribe from the listener when the provider unmounts
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children after Firebase has resolved the auth state,
          preventing a flicker where protected pages briefly show as logged-out */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
