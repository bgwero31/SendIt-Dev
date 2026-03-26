'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "../../lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail // ✅ NEW
} from "firebase/auth"
import { ref, set } from "firebase/database"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [nationalId, setNationalId] = useState("")

  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("") // ✅ NEW
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 4200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("speechSynthesis" in window)) return

    const msg = new SpeechSynthesisUtterance(
      "Send It. Errands handled. Time saved."
    )
    msg.rate = 0.9
    msg.pitch = 1

    const t = setTimeout(() => {
      window.speechSynthesis.speak(msg)
    }, 1400)

    return () => clearTimeout(t)
  }, [])

  /* ================= RESET PASSWORD ================= */
  const handleReset = async () => {
    if (!email) {
      setError("Enter your email first")
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("Reset email sent ✅ Check inbox")
      setError("")
    } catch (err) {
      setError("Failed to send reset email")
    }
  }

  const submit = async () => {

    if (!email || !password) return

    if (isSignup && (!name || !phone || !nationalId)) {
      setError("Please fill all fields")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    let userCred

    try {

      userCred = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password)

    } catch (error) {

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("SendIt: Incorrect email or password")
      } else {
        setError("SendIt: Something went wrong. Please try again.")
      }

      setLoading(false)
      return
    }

    const uid = userCred.user.uid

    // ✅ SAFE SIGNUP WRITE
    if (isSignup) {
      await set(ref(db, `users/${uid}`), {
        email,
        name,
        phone,
        nationalId,
        role: "user",
        createdAt: Date.now()
      })

      await set(ref(db, `wallets/${uid}`), {
        balance: 100
      })
    }

    router.push("/")
    setLoading(false)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {showIntro && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-black to-blue-950 intro-fade">
          <div className="sendit-logo">
            {"SendIt".split("").map((l, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>
                {l}
              </span>
            ))}
          </div>
          <p className="mt-4 text-blue-300 tracking-wide">
            Errands handled. Save your time.
          </p>
        </div>
      )}

      <div className="absolute inset-0 flame-layer" />
      <div className="absolute inset-0 flame-layer delay" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <div className="glass-card w-full max-w-sm rounded-2xl p-6 shadow-xl">

          <div className="login-logo">
            <span className="send">Send</span>
            <span className="it">It</span>
          </div>

          <div className="divider"></div>

          <p className="text-sm text-gray-400 mb-6 text-center">
            {isSignup
              ? "Create your SendIt account"
              : "Welcome back. Continue to SendIt"}
          </p>

          {isSignup && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="input mb-3" />
          )}

          {isSignup && (
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="input mb-3" />
          )}

          {isSignup && (
            <input value={nationalId} onChange={e => setNationalId(e.target.value)} placeholder="National ID" className="input mb-3" />
          )}

          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="input" />

          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="input mt-3" />

          {/* 🔥 RESET OPTIONS */}
          {!isSignup && (
            <div className="flex justify-between mt-2 text-xs">
              <button onClick={handleReset} className="text-blue-400">
                Reset Email
              </button>

              <a
                href="https://wa.me/263774309795?text=Hi%20SendIt,%20I%20forgot%20my%20password"
                target="_blank"
                className="text-green-400"
              >
                WhatsApp
              </a>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          {message && <p className="text-green-400 text-sm mt-3">{message}</p>}

          <button onClick={submit} disabled={loading} className="btn-primary mt-4">
            {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
          </button>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full mt-4 text-sm text-blue-400"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Create a new account"}
          </button>

        </div>

      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs text-gray-500">
        ALL RIGHTS RESERVED. SendIt © 2026
      </footer>

      <style jsx>{`
        .sendit-logo {
          font-size: 3.5rem;
          font-weight: 800;
          display: flex;
          gap: 0.15em;
        }

        .sendit-logo span {
          opacity: 0;
          transform: translate(var(--x), var(--y)) rotate(12deg);
          animation: flyIn 1.2s ease forwards;
          color: #60a5fa;
          text-shadow: 0 0 25px rgba(59,130,246,0.9);
        }

        .sendit-logo span:nth-child(1) { --x: -120px; --y: -80px; }
        .sendit-logo span:nth-child(2) { --x: 90px; --y: -100px; }
        .sendit-logo span:nth-child(3) { --x: -100px; --y: 90px; }
        .sendit-logo span:nth-child(4) { --x: 120px; --y: 70px; }
        .sendit-logo span:nth-child(5) { --x: -80px; --y: -120px; }
        .sendit-logo span:nth-child(6) { --x: 100px; --y: 100px; }

        @keyframes flyIn {
          to {
            opacity: 1;
            transform: translate(0,0) rotate(0);
          }
        }

        .intro-fade {
          animation: fadeOut 1s ease forwards;
          animation-delay: 3.6s;
        }

        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }

        .login-logo {
          display: flex;
          justify-content: center;
          gap: 0.12em;
          font-size: 2.8rem;
          font-weight: 800;
        }

        .login-logo .send {
          color: #3b82f6;
          animation: wave 4s ease-in-out infinite;
          text-shadow: 0 0 18px rgba(59,130,246,0.8);
        }

        .login-logo .it {
          color: #ffffff;
          animation: wave 4s ease-in-out infinite;
          animation-delay: 0.6s;
          text-shadow: 0 0 12px rgba(255,255,255,0.6);
        }

        @keyframes wave {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }

        .flame-layer {
          background:
            radial-gradient(circle at 50% 80%, rgba(59,130,246,0.35), transparent 60%),
            radial-gradient(circle at 20% 90%, rgba(37,99,235,0.3), transparent 65%),
            radial-gradient(circle at 80% 85%, rgba(96,165,250,0.3), transparent 60%);
          animation: flameMove 6s ease-in-out infinite;
        }

        .flame-layer.delay {
          animation-delay: 3s;
          opacity: 0.6;
        }

        @keyframes flameMove {
          0% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0); }
        }

        .glass-card {
          background: rgba(10, 15, 25, 0.65);
          border: 1px solid rgba(255,255,255,0.12);
          animation: cardEnter 0.9s ease forwards;
          transform: translateY(40px);
          opacity: 0;
        }

        @keyframes cardEnter {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .divider {
          width: 60px;
          height: 2px;
          margin: 8px auto 16px auto;
          background: linear-gradient(90deg,transparent,#3b82f6,transparent);
        }

        .input {
          width: 100%;
          padding: 0.8rem;
          border-radius: 0.75rem;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          outline: none;
          transition: all 0.25s ease;
        }

        .input:focus {
          border: 1px solid #3b82f6;
          box-shadow: 0 0 12px rgba(59,130,246,0.5);
        }

        .btn-primary {
          width: 100%;
          padding: 0.85rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg,#2563eb,#3b82f6);
          font-weight: 600;
          box-shadow: 0 0 18px rgba(59,130,246,0.45);
          transition: all 0.25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 26px rgba(59,130,246,0.7);
        }

        .btn-primary:active {
          transform: scale(0.96);
        }
      `}</style>
    </main>
  )
    }
