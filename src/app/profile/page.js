'use client'

import { useEffect, useState } from "react"
import { ref, onValue, update } from "firebase/database"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

import { db, auth } from "../../lib/firebase"
import Navbar from "../../components/Navbar"

const IMGBB_API_KEY = "30df4aa05f1af3b3b58ee8a74639e5cf"
const WHATSAPP_APPROVAL = "https://wa.me/263774309795"

export default function Profile() {

const router = useRouter()

const [loading,setLoading] = useState(true)
const [saving,setSaving] = useState(false)
const [uploading,setUploading] = useState(false)
const [editing,setEditing] = useState(false)

const [name,setName] = useState("")
const [nationalId,setNationalId] = useState("")
const [idLocked,setIdLocked] = useState(false)

const [role,setRole] = useState("user")
const [verified,setVerified] = useState(false)
const [photo,setPhoto] = useState(null)

const [phone,setPhone] = useState("")
const [city,setCity] = useState("")

const [completedJobs,setCompletedJobs] = useState(0)
const [successRate,setSuccessRate] = useState(0)
const [memberSince,setMemberSince] = useState(0)

const [menuOpen,setMenuOpen] = useState(false)

/* AUTH CHECK */

useEffect(()=>{
if(!auth.currentUser) router.replace("/login")
},[router])

/* LOAD PROFILE */

useEffect(()=>{

if(!auth.currentUser) return

const uid = auth.currentUser.uid
const userRef = ref(db,`users/${uid}`)

return onValue(userRef,snap=>{

const data = snap.val() || {}

setName(data.name || "")
setRole(data.role || "user")
setVerified(!!data.verified)
setPhoto(data.photo || null)
setPhone(data.phone || "")
setCity(data.city || "")
setCompletedJobs(data.completedJobs || 0)
setSuccessRate(data.successRate || 0)
setMemberSince(data.createdAt || 0)

if(data.nationalId){
setNationalId(data.nationalId)
setIdLocked(true)
}

setLoading(false)

})

},[])

/* SAVE PROFILE */

const saveProfile = async()=>{

if(!name.trim()){
alert("Name is required")
return
}

setSaving(true)

const uid = auth.currentUser.uid

const payload = {
name:name.trim(),
phone:phone.trim(),
role: verified ? role : "user",
updatedAt:Date.now()
}

if(!idLocked && nationalId.trim()){
payload.nationalId = nationalId.trim()
}

await update(ref(db,`users/${uid}`),payload)

setIdLocked(true)
setSaving(false)
setEditing(false)

}

/* ROLE TOGGLE */

const toggleRole = async()=>{

if(!verified) return

const newRole = role === "runner" ? "user" : "runner"

setRole(newRole)

await update(ref(db,`users/${auth.currentUser.uid}`),{
role:newRole
})

}

/* PHOTO UPLOAD */

const uploadPhoto = async(file)=>{

if(!file) return

setUploading(true)

const form = new FormData()
form.append("image",file)

const res = await fetch(
`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
{method:"POST",body:form}
)

const json = await res.json()
const url = json?.data?.url

if(url){

await update(ref(db,`users/${auth.currentUser.uid}`),{
photo:url
})

setPhoto(url)

}

setUploading(false)

}

/* LOGOUT */

const logout = async()=>{
await signOut(auth)
router.replace("/login")
}

if(loading){

return(
<main className="min-h-screen flex items-center justify-center">
Loading...
</main>
)

}

const isAdmin = role === "admin"

const memberYear = memberSince
? new Date(memberSince).getFullYear()
: ""

const maskedId = nationalId
? nationalId.slice(0,3) + "******" + nationalId.slice(-2)
: ""

return(

<main className="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#11183a] pb-32">

{/* HEADER */}

<div className="px-6 pt-6 flex items-center justify-between">

<h1 className="text-2xl font-bold text-gray-800">
Profile
</h1>

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="text-xl"
>
☰
</button>

</div>

{/* SIMPLE DROPDOWN MENU */}

{menuOpen && (
<div className="mx-6 mt-2 bg-white rounded-xl shadow p-3 text-sm space-y-2">

<button
onClick={()=>router.push("/wallet")}
className="block w-full text-left"
>
Wallet
</button>

<button
onClick={()=>router.push("/settings")}
className="block w-full text-left"
>
Settings
</button>

{/* ADDED ADMIN PANEL BUTTON */}

{isAdmin && (
<button
onClick={()=>router.push("/admin")}
className="block w-full text-left font-semibold text-indigo-600"
>
Admin Panel
</button>
)}

<button
onClick={logout}
className="block w-full text-left text-red-600"
>
Log out
</button>

</div>
)}

{/* PROFILE GLASS CARD */}

<div className="glass-card mx-6 mt-6 p-6 relative overflow-hidden">

<div className="absolute inset-0 flex items-center justify-center text-[100px] font-black text-gray-200/20 select-none">
SendIt
</div>

<div className="relative z-10">

<label className="block w-24 h-24 mx-auto cursor-pointer relative">

<img
src={photo || "/avatar.png"}
className="w-full h-full rounded-full object-cover shadow"
/>

<input
hidden
type="file"
accept="image/*"
onChange={e=>uploadPhoto(e.target.files[0])}
/>

{uploading &&(
<div className="absolute inset-0 flex items-center justify-center text-xs text-white bg-black/40 rounded-full">
Uploading...
</div>
)}

</label>

<div className="text-center mt-4">

<input
value={name}
onChange={e=>{
setName(e.target.value)
setEditing(true)
}}
className="text-xl font-semibold text-center bg-transparent border-b border-gray-300 outline-none"
placeholder="Your name"
/>

{verified &&(
<p className="text-xs text-green-600 mt-1">
✔ Identity verified
</p>
)}

</div>

<p className="text-center text-xs text-gray-500 mt-1">
📍 {city}
</p>

{/* ROLE TOGGLE */}

<div className="flex justify-center mt-3">

<button
onClick={toggleRole}
disabled={!verified}
className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
${role==="runner"
? "bg-indigo-600 text-white"
: "bg-gray-200 text-gray-700"}
${!verified && "opacity-40 cursor-not-allowed"}
`}
>
{role==="runner" ? "Runner Mode" : "Sender Mode"}
</button>

</div>

{/* STATS */}

<div className="grid grid-cols-3 gap-3 mt-5 text-center">

<div className="bg-white/70 rounded-xl p-3">
<p className="font-bold">{completedJobs}</p>
<p className="text-xs text-gray-500">Completed</p>
</div>

<div className="bg-white/70 rounded-xl p-3">
<p className="font-bold">{successRate}%</p>
<p className="text-xs text-gray-500">Success</p>
</div>

<div className="bg-white/70 rounded-xl p-3">
<p className="font-bold">{memberYear}</p>
<p className="text-xs text-gray-500">Member</p>
</div>

</div>

{/* DETAILS */}

<div className="mt-6 space-y-3 text-sm">

<div className="flex justify-between">
<span className="text-gray-500">Phone</span>
<span>{phone}</span>
</div>

<div className="flex justify-between">
<span className="text-gray-500">National ID</span>
<span>{maskedId}</span>
</div>

<div className="flex justify-between">
<span className="text-gray-500">Email</span>
<span>{auth.currentUser.email}</span>
</div>

</div>

{editing &&(

<div className="flex justify-end mt-4">

<button
onClick={saveProfile}
disabled={saving}
className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
>
{saving ? "Saving..." : "Save"}
</button>

</div>

)}

</div>

</div>

{/* RUNNER REQUEST */}

{!verified && !isAdmin &&(

<div className="glass-card mx-6 mt-6 p-5">

<p className="font-semibold">
Become a runner
</p>

<p className="text-sm text-gray-500 mt-1">
Runner accounts require manual approval
</p>

<a
href={WHATSAPP_APPROVAL}
target="_blank"
onClick={async()=>{
await update(ref(db,`users/${auth.currentUser.uid}`),{
requestedRunner:true
})
}}
className="block text-center mt-4 bg-green-600 text-white py-2 rounded-xl"
>
Contact admin on WhatsApp
</a>

</div>

)}

<Navbar/>

</main>

)

}
