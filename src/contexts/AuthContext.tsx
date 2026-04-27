import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs, increment, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isVip: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Capture referral code from URL and persist in localStorage
    const searchParams = new URLSearchParams(window.location.search);
    const refFromUrl = searchParams.get('ref');
    if (refFromUrl) {
      localStorage.setItem('prudente_ref', refFromUrl.toUpperCase());
    }

    // Handle redirect result
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log('REDIRECT_LOGIN_SUCCESS:', result.user.email);
      }
    }).catch((error) => {
      console.error('REDIRECT_LOGIN_ERROR:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AUTH_STATE_CHANGED:', firebaseUser?.email || 'Logged Out');
      setUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('LOGIN_SUCCESS:', firebaseUser.email);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to profile changes
        const unsubProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            console.log('PROFILE_LOADED:', firebaseUser.email);
            const data = docSnap.data();
            setProfile({
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            } as UserProfile);
          } else {
            console.log('REGISTERING_NEW_USER:', firebaseUser.email);
            // New user registration logic
            let referredByUid = '';
            const storedRef = localStorage.getItem('prudente_ref');
            
            if (storedRef) {
              try {
                const q = query(collection(db, 'users'), where('referralCode', '==', storedRef));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                  const referrerDoc = querySnapshot.docs[0];
                  referredByUid = referrerDoc.id;
                  
                  // Update referrer count
                  await updateDoc(doc(db, 'users', referredByUid), {
                    referralCount: increment(1)
                  });

                  // Log the referral
                  await addDoc(collection(db, 'referrals'), {
                    referrerId: referredByUid,
                    refereeId: firebaseUser.uid,
                    createdAt: serverTimestamp()
                  });
                }
              } catch (e) {
                console.error("Error processing referral:", e);
              } finally {
                localStorage.removeItem('prudente_ref');
              }
            }

            const uniqueReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Usuário',
              role: 'user',
              isVip: false,
              createdAt: serverTimestamp(),
              referralCode: uniqueReferralCode,
              referredBy: referredByUid || null,
              referralCount: 0,
              firstPaymentCompleted: false,
              commissionGenerated: false,
              totalEarnings: 0
            };

            await setDoc(userDocRef, newProfile);
            setProfile({
              ...newProfile,
              createdAt: new Date()
            } as UserProfile);

            // Bootstrap admin
            if (firebaseUser.email === 'contato.fh3@gmail.com') {
              console.log('BOOTSTRAPPING_ADMIN:', firebaseUser.email);
              setDoc(doc(db, 'admins', firebaseUser.uid), {
                email: firebaseUser.email,
                bootstrapped: true
              });
              setDoc(userDocRef, { role: 'admin' }, { merge: true });
            }
          }
          setLoading(false);
        }, (error) => {
          console.error('PROFILE_LOAD_ERROR:', error);
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isVip: profile?.role === 'vip' || profile?.role === 'admin' || profile?.isVip === true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
