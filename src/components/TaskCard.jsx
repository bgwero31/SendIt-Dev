'use client'

import { useEffect, useState } from "react"
import {
  ref,
  onValue,
  push,
  update,
  remove,
  runTransaction,
  get
} from "firebase/database"

import { db, auth } from "../lib/firebase"
import { set } from "firebase/database"

/* ===== DISTANCE CALCULATOR ===== */
function getDistance(lat1, lon1, lat2, lon2){
  const R = 6371
  const dLat = (lat2-lat1) * Math.PI/180
  const dLon = (lon2-lon1) * Math.PI/180

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

export default function TaskCard({
  id,
  title,
  offerPrice,
  finalPrice,
  status,
  ownerId,
  ownerPhone,
  runnerId,
  runnerName,
  runnerPhone,
  biddingRunnerId,
  biddingRunnerName,
  city,
  createdAt,
  pickupLat,
  pickupLng
}) {

  const user = auth.currentUser
  if (!user) return null

  const uid = user.uid
  const isOwner = uid === ownerId
  const isBiddingRunner = uid === biddingRunnerId
  const [busy,setBusy] = useState(false)
  const [bidAmount,setBidAmount] = useState(offerPrice || 0)
  const [bids,setBids] = useState([])

  const taskRef = ref(db, `tasks/${city}/${id}`)
  const bidsRef = ref(db,`bids/${id}`)
  const chatUrl = `/chat/${id}`

/* ===== RUNNER LOCATION ===== */

const [myLocation,setMyLocation] = useState(null)

useEffect(()=>{
  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      setMyLocation({
        lat:pos.coords.latitude,
        lng:pos.coords.longitude
      })
    },
    (err)=>{},
    { enableHighAccuracy:true }
  )
},[])

/* ===== DISTANCE CALCULATION ===== */

const [distance,setDistance] = useState(null)

useEffect(()=>{
  if(!myLocation) return
  if(pickupLat === undefined || pickupLng === undefined) return

  const d = getDistance(
    myLocation.lat,
    myLocation.lng,
    pickupLat,
    pickupLng
  )

  setDistance(d)
},[myLocation,pickupLat,pickupLng])

/* ================= LISTEN TO BIDS ================= */

useEffect(()=>{
  if(!isOwner || status !== "bidding") return

  return onValue(bidsRef,snap=>{
    const data = snap.val() || {}
    setBids(Object.entries(data).map(([bidId,bid])=>({
      bidId,
      ...bid
    })))
  })
},[isOwner,status])

/* ================= PLACE BID ================= */

const placeBid = async()=>{
  if(busy || !bidAmount || bidAmount <= 0) return
  setBusy(true)

  const bid = {
    runnerId:uid,
    runnerName:user.displayName || user.email || "Runner",
    runnerPhone:runnerPhone || "",
    amount:Number(bidAmount),
    createdAt:Date.now()
  }

  await push(bidsRef,bid)

  await update(taskRef,{
    status: "bidding",
    latestBid: bid,
    biddingRunnerId: uid,
    biddingRunnerName: user.displayName || user.email || "Runner"
  })

  // 🔔 NOTIFY OWNER
  try {
    const ownerSnap = await get(ref(db, `users/${ownerId}`))
    const ownerSignalId = ownerSnap.val()?.oneSignalId

    if (ownerSignalId) {
      await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic YOUR_REST_API_KEY"
        },
        body: JSON.stringify({
          app_id: "cea0d2bd-0c2f-4126-85dc-b404c3482341",
          include_player_ids: [ownerSignalId],
          headings: { en: "New Offer 💰" },
          contents: { en: `${user.displayName || user.email || "Runner"} placed a bid` },
          data: { type: "task", taskId: id }
        })
      })
    }
  } catch(e){
    console.log("Notify bid error", e)
  }

  setBusy(false)
}

/* ================= ACCEPT TASK ================= */

const acceptTask = async () => {
  if (busy) return
  setBusy(true)

  try {
    const userSnap = await get(ref(db, `users/${uid}`))
    const myPhone = userSnap.val()?.phone || user.phoneNumber || ""

    const result = await runTransaction(taskRef, (task) => {
      if (!task) return task
      if (task.status !== "waiting_for_runner") return

      task.status = "accepted"
      task.runnerId = uid
      task.runnerName = user.displayName || user.email || "Runner"
      task.runnerPhone = myPhone
      task.finalPrice = task.finalPrice ?? task.offerPrice
      task.acceptedAt = Date.now()

      return task
    })

    if (!result.committed) {
      setBusy(false)
      return
    }

    const chatRef = ref(db, `chats/${id}`)

    await set(chatRef,{
      taskId: id,
      city,
      ownerId,
      runnerId: uid,
      ownerName: "Sender",
      runnerName: user.displayName || user.email || "Runner",
      members:{ [ownerId]: true, [uid]: true },
      createdAt: Date.now(),
      lastMessage:"",
      lastAt: Date.now()
    })

    // 🔔 notify owner
    try {
      const ownerSnap2 = await get(ref(db, `users/${ownerId}`))
      const ownerSignalId = ownerSnap2.val()?.oneSignalId

      if (ownerSignalId) {
        await fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic YOUR_REST_API_KEY"
          },
          body: JSON.stringify({
            app_id: "cea0d2bd-0c2f-4126-85dc-b404c3482341",
            include_player_ids: [ownerSignalId],
            headings: { en: "Task Accepted ✅" },
            contents: { en: "A runner accepted your task" },
            data: { type: "chat", taskId: id }
          })
        })
      }
    } catch(e){
      console.log("Notify accept error", e)
    }

    window.location.href = `/chat/${id}`

  } catch(err) {
    console.error(err)
  }

  setBusy(false)
}

/* ================= OWNER ACCEPT BID ================= */

const acceptBid = async (bid) => {
  if (busy) return
  setBusy(true)

  try {

    await update(taskRef,{
      status:"accepted",
      runnerId:bid.runnerId,
      runnerName:bid.runnerName || "Runner",
      runnerPhone:bid.runnerPhone || "",
      finalPrice:bid.amount,
      acceptedAt:Date.now()
    })

    const chatRef = ref(db,`chats/${id}`)

    await set(chatRef,{
      taskId:id,
      city,
      ownerId,
      runnerId:bid.runnerId,
      ownerName:"Sender",
      runnerName:bid.runnerName || "Runner",
      members:{
        [ownerId]:true,
        [bid.runnerId]:true
      },
      createdAt:Date.now(),
      lastMessage:"",
      lastAt:Date.now()
    })

    // 🔔 notify runner
    try {
      const runnerSnap = await get(ref(db, `users/${bid.runnerId}`))
      const runnerSignalId = runnerSnap.val()?.oneSignalId

      if (runnerSignalId) {
        await fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic YOUR_REST_API_KEY"
          },
          body: JSON.stringify({
            app_id: "cea0d2bd-0c2f-4126-85dc-b404c3482341",
            include_player_ids: [runnerSignalId],
            headings: { en: "Offer Accepted ✅" },
            contents: { en: "Your offer was accepted. Start the task now!" },
            data: { type: "chat", taskId: id }
          })
        })
      }
    } catch(e){
      console.log("Notify runner error", e)
    }

    await remove(bidsRef)
    window.location.href = `/chat/${id}`

  } catch(err){
    console.error(err)
  }

  setBusy(false)
}

  /* ================= AUTO OPEN CHAT ================= */

  useEffect(()=>{

    const unsub = onValue(taskRef,snap=>{

      const task = snap.val()
if(
  task?.status === "accepted" &&
  (task.runnerId === uid || task.ownerId === uid)
){
  window.location.href = chatUrl
}

    })

    return ()=>unsub()

  },[])


  /* ================= UI ================= */

return (

  <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-5 space-y-4 overflow-hidden">

    {/* faded SendIt background */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="text-6xl font-bold tracking-widest text-indigo-300/20">
        SendIt
      </span>
    </div>

    {/* content layer */}
    <div className="relative z-10 space-y-4">

      <div className="flex justify-between items-start">

        <div>
          <p className="font-semibold text-lg break-words">{title}</p>


{distance !== null && (
  <p className="text-xs text-indigo-600 font-semibold">
    {distance.toFixed(2)} km away
  </p>
)}

          
          <p className="text-xs text-gray-500">
            Posted {new Date(createdAt).toLocaleString()}
          </p>

          <p className="text-xs text-gray-600 mt-1">
            Phone: {ownerPhone}
          </p>
        </div>

        <span className="text-indigo-600 font-bold text-lg">
          ${finalPrice ?? offerPrice}
        </span>

      </div>


      {status === "waiting_for_runner" && (
        <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-200/40 text-yellow-800 backdrop-blur-md border border-yellow-200/40">
          Waiting for runner
        </span>
      )}

      {status === "bidding" && isBiddingRunner && (
        <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-200/40 text-blue-800 backdrop-blur-md border border-blue-200/40">
          Negotiating
        </span>
      )}

      {status === "bidding" && !isBiddingRunner && !isOwner && (
        <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-200/40 text-yellow-800 backdrop-blur-md border border-yellow-200/40">
          Waiting for runner
        </span>
      )}


      {!isOwner && status === "waiting_for_runner" && (

        <div className="space-y-3">

          <input
            type="number"
            min="1"
            value={bidAmount}
            onChange={e=>setBidAmount(e.target.value)}
            className="w-full border border-white/40 bg-white/40 backdrop-blur-md rounded-xl p-3"
            placeholder="Your price"
          />

          <div className="flex gap-3">

            <button
              onClick={placeBid}
              disabled={busy}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md"
            >
              Place Bid
            </button>

            <button
              onClick={acceptTask}
              disabled={busy}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md"
            >
              Accept
            </button>

          </div>

        </div>

      )}


      {!isOwner && status === "bidding" && (
        <p className="text-center text-sm text-gray-600">
          Waiting for owner response…
        </p>
      )}


      {isOwner && status === "bidding" && bids.map(bid=>(
        <div
          key={bid.bidId}
          className="flex items-center justify-between border border-white/30 bg-white/30 backdrop-blur-md rounded-xl p-3"
        >

          <div>
            <p className="font-medium">{bid.runnerName}</p>

            <p className="text-xs text-gray-500">
              Offered ${bid.amount}
            </p>
          </div>

          <button
            onClick={()=>acceptBid(bid)}
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Accept
          </button>

        </div>
      ))}


      {status === "accepted" && (
        <button
          onClick={()=>window.location.href = chatUrl}
          className="w-full bg-indigo-700 text-white py-3 rounded-xl font-semibold"
        >
              Open Chat  
    </button>  
  )}  

</div>  

  </div>     

)
}
