import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth"
import { auth } from "../lib/firebase"

const AuthContext = createContext(null)

const BASE_URL = import.meta.env.VITE_API_URL || ""

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken()
                    const res = await fetch(`${BASE_URL}/auth/sync`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (res.ok) {
                        const userData = await res.json()
                        setUser(userData)
                    } else {
                        setUser(null)
                    }
                } catch {
                    setUser(null)
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const login = async (email, password) => {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        const token = await cred.user.getIdToken()
        const res = await fetch(`${BASE_URL}/auth/sync`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Error al sincronizar usuario")
        const userData = await res.json()
        setUser(userData)
        return userData
    }

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        const cred = await signInWithPopup(auth, provider)
        const token = await cred.user.getIdToken()
        const res = await fetch(`${BASE_URL}/auth/sync`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Error al sincronizar usuario")
        const userData = await res.json()
        setUser(userData)
        return userData
    }

    const logout = async () => {
        await signOut(auth)
        setUser(null)
    }

    const value = useMemo(
        () => ({ user, loading, login, loginWithGoogle, logout }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, loading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
    return ctx
}
