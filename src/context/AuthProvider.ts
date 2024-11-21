'use client'
import { Session } from "inspector/promises";
import { SessionProvider } from "next-auth/react"
import nextAuth from 'next-auth'
export default function AuthProvider({
    children,
}:{
    children:React.ReactNode;
}){
    return (
        <SessionProvider>
        {children}
        </SessionProvider>
    )
}