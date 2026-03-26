'use client'

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { useState, useEffect } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "../lib/firebase"

const containerStyle = {
  width: "100%",
  height: "100vh"
}

export default function RunnerMap({ runnerId }) {

  const [pos, setPos] = useState(null)

  useEffect(() => {

    if (!runnerId) return

    const locRef = ref(db, `runnerLocations/${runnerId}`)

    return onValue(locRef, snap => {

      const data = snap.val()
      if (!data) return

      setPos({
        lat: data.lat,
        lng: data.lng
      })

    })

  }, [runnerId])

  return (

    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pos || { lat: -20.1486, lng: 30.0633 }}
        zoom={15}
        options={{
          disableDefaultUI: true
        }}
      >

        {pos && <Marker position={pos} />}

      </GoogleMap>

    </LoadScript>

  )

      }
