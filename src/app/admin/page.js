'use client'

import { useEffect, useState, useRef } from "react"
import { ref, onValue, update, push } from "firebase/database"
import { db } from "../../lib/firebase"

export default function AdminPage(){

const [users,setUsers] = useState([])
const [cities,setCities] = useState({})
const [selectedUser,setSelectedUser] = useState(null)
const [wallet,setWallet] = useState(null)
const [tasks,setTasks] = useState([])
const [search,setSearch] = useState("")

const [openCity,setOpenCity] = useState(null)
const [openUsers,setOpenUsers] = useState(false)
const [openRunners,setOpenRunners] = useState(false)
const [openTasks,setOpenTasks] = useState(false)

const profileRef = useRef(null)

/* LOAD USERS */

useEffect(()=>{

const usersRef = ref(db,"users")

onValue(usersRef,(snap)=>{

const data = snap.val()
if(!data) return

const arr = Object.entries(data).map(([id,val])=>({
id,
...val
}))

setUsers(arr)

const grouped = {}

arr.forEach(u=>{
const city = u.city || "Unknown"
if(!grouped[city]) grouped[city] = []
grouped[city].push(u)
})

setCities(grouped)

})

},[])

/* LOAD TASKS */

useEffect(()=>{

const tasksRef = ref(db,"tasks")

onValue(tasksRef,(snap)=>{

const data = snap.val()
if(!data) return

const list = []

Object.keys(data).forEach(city=>{

Object.entries(data[city]).forEach(([id,val])=>{
list.push({
id,
city,
...val
})
})

})

setTasks(list)

})

},[])

/* OPEN USER */

function openUser(user){

setSelectedUser(user)

const walletRef = ref(db,`wallets/${user.id}`)

onValue(walletRef,(snap)=>{
setWallet(snap.val())
})

setTimeout(()=>{
profileRef.current?.scrollIntoView({behavior:"smooth"})
},200)

}

/* ROLE TOGGLE */

function toggleRole(user){

const newRole = user.role === "runner" ? "user" : "runner"

update(ref(db,`users/${user.id}`),{
role:newRole
})

}

/* BLOCK USER */

function blockUser(user){

update(ref(db,`users/${user.id}`),{
blocked:true
})

}

/* UNBLOCK USER */

function unblockUser(user){

update(ref(db,`users/${user.id}`),{
blocked:false
})

}

/* ADD WALLET CREDIT */

function addCredits(user,amount){

const walletRef = ref(db,`wallets/${user.id}`)
const newBalance = (wallet?.balance || 0) + amount

update(walletRef,{
balance:newBalance
})

push(ref(db,`wallets/${user.id}/transactions`),{
amount:amount,
type:"credit",
title:"Admin credit",
source:"admin",
at:Date.now()
})

}

/* FILTER USERS */

const filteredUsers = users.filter(u=>{
return (
u.name?.toLowerCase().includes(search.toLowerCase()) ||
u.phone?.includes(search)
)
})

return(

<div className="p-6 space-y-6">

<h1 className="text-3xl font-bold">
SendIt Admin Control Center
</h1>

{/* SEARCH */}

<input
placeholder="Search user name or phone..."
value={search}
onChange={e=>setSearch(e.target.value)}
className="border p-2 rounded w-full"
/>

{/* CITY TREE */}

<div className="space-y-3">

{Object.keys(cities).map(city=>(

<div key={city} className="border rounded">

<button
onClick={()=>setOpenCity(openCity === city ? null : city)}
className="w-full bg-blue-600 text-white px-4 py-3 text-left"
>
{city}
</button>

{openCity === city && (

<div className="p-4 space-y-5 bg-gray-50">

{/* USERS */}

<div>

<button
onClick={()=>setOpenUsers(!openUsers)}
className="font-bold"
>
Users
</button>

{openUsers && (

<div className="pl-4 mt-2 space-y-2">

{cities[city]
.filter(u=>u.role !== "runner")
.filter(u=>filteredUsers.includes(u))
.map(u=>(
<div key={u.id}>

<button
onClick={()=>openUser(u)}
className="text-blue-600 underline"
>
{u.name || u.phone}
</button>

</div>
))}

</div>

)}

</div>

{/* RUNNERS */}

<div>

<button
onClick={()=>setOpenRunners(!openRunners)}
className="font-bold"
>
Runners
</button>

{openRunners && (

<div className="pl-4 mt-2 space-y-2">

{cities[city]
.filter(u=>u.role === "runner")
.filter(u=>filteredUsers.includes(u))
.map(u=>(
<div key={u.id}>

<button
onClick={()=>openUser(u)}
className="text-blue-600 underline"
>
{u.name || u.phone}
</button>

</div>
))}

</div>

)}

</div>

{/* TASKS */}

<div>

<button
onClick={()=>setOpenTasks(!openTasks)}
className="font-bold"
>
Tasks
</button>

{openTasks && (

<div className="grid md:grid-cols-2 gap-3 mt-3">

{tasks
.filter(t=>t.city === city)
.map(task=>(

<div
key={task.id}
className="border rounded p-2 bg-white text-sm"
>

<h3 className="font-semibold">
{task.title}
</h3>

<p>Status: {task.status}</p>
<p>Price: ${task.finalPrice}</p>
<p>Runner: {task.runnerName}</p>
<p>Owner: {task.ownerPhone}</p>

</div>

))}

</div>

)}

</div>

</div>

)}

</div>

))}

</div>

{/* USER PROFILE */}

{selectedUser && (

<div ref={profileRef} className="border rounded-lg p-5">

<h2 className="text-xl font-bold">
User Profile
</h2>

<p>Name: {selectedUser.name}</p>
<p>Phone: {selectedUser.phone}</p>
<p>ID: {selectedUser.nationalId}</p>
<p>City: {selectedUser.city}</p>
<p>Role: {selectedUser.role}</p>

<h3 className="mt-3 font-bold">
Wallet Balance
</h3>

<p className="text-lg font-semibold">
${wallet?.balance || 0}
</p>

<div className="flex gap-2 mt-3">

<button
onClick={()=>toggleRole(selectedUser)}
className="bg-green-600 text-white px-3 py-1 rounded text-sm"
>
Toggle Role
</button>

<button
onClick={()=>blockUser(selectedUser)}
className="bg-red-600 text-white px-3 py-1 rounded text-sm"
>
Block
</button>

<button
onClick={()=>unblockUser(selectedUser)}
className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
>
Unblock
</button>

</div>

<div className="flex gap-2 mt-3">

<button
onClick={()=>addCredits(selectedUser,5)}
className="bg-green-600 text-white px-2 py-1 rounded text-sm"
>
+5
</button>

<button
onClick={()=>addCredits(selectedUser,10)}
className="bg-green-600 text-white px-2 py-1 rounded text-sm"
>
+10
</button>

<button
onClick={()=>addCredits(selectedUser,20)}
className="bg-green-600 text-white px-2 py-1 rounded text-sm"
>
+20
</button>

</div>

</div>

)}

</div>

)

  }
