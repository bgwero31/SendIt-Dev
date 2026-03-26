'use client'

export default function SuccessToast({ show, text }) {

  if (!show) return null

  return (
    <div className="
      fixed top-6 left-1/2 -translate-x-1/2
      bg-black text-white
      px-5 py-3 rounded-xl shadow-xl
      text-sm z-50
      animate-fadeIn
    ">
      {text || "Success 🎉"}
    </div>
  )
}
