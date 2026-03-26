'use client'

import AuthGate from "./AuthGate"
import Home from "./Home"

export default function Page() {
  return (
    <AuthGate>
      <Home />
    </AuthGate>
  )
}
