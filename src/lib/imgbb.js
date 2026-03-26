export async function uploadToImgBB(file) {
  const form = new FormData()
  form.append("image", file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=30df4aa05f1af3b3b58ee8a74639e5cf`,
    {
      method: "POST",
      body: form
    }
  )

  const data = await res.json()
  if (!data.success) throw new Error("Upload failed")

  return data.data.url
}
