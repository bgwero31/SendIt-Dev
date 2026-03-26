'use client'

export default function AppBackground({ children }) {
  return (
    <div className="app-bg-root">
      {/* Ambient blobs */}
      <div className="bg-blob blob-indigo" />
      <div className="bg-blob blob-purple" />
      <div className="bg-blob blob-green" />

      {/* App content */}
      <div className="app-bg-content">
        {children}
      </div>
    </div>
  )
}
