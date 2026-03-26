'use client'

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "../../lib/firebase"

const CITIES = ["Zvishavane", "Harare"]

export default function Leaderboard() {
  const [city, setCity] = useState("Zvishavane")
  const [runners, setRunners] = useState([])

  useEffect(() => {
    return onValue(ref(db, `runnerStats/${city}`), snap => {
      const data = snap.val() || {}

      const list = Object.entries(data)
        .map(([uid, r]) => ({ uid, ...r }))
        .sort((a, b) => b.completed - a.completed)

      setRunners(list)
    })
  }, [city])

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Runner Leaderboard</h1>

      <select
        value={city}
        onChange={e => setCity(e.target.value)}
        className="border p-2 rounded"
      >
        {CITIES.map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {runners.map((r, i) => (
        <div key={r.uid} className="bg-white p-4 rounded-xl flex justify-between">
          <p>#{i + 1}</p>
          <p>{r.completed} jobs</p>
          <p>{r.earnings} CR</p>
        </div>
      ))}
    </main>
  )
            }
