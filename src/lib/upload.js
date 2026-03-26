export const uploadToIMGBB = async (file) => {
  const formData = new FormData()
  formData.append("image", file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=30df4aa05f1af3b3b58ee8a74639e5cf`,
    {
      method: "POST",
      body: formData
    }
  )

  const data = await res.json()

  return data.data.url
}
