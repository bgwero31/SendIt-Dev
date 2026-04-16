const IMGBB_API_KEY = "30df4aa05f1af3b3b58ee8a74639e5cf"

export async function uploadToImgbb(file) {
  if (!file) throw new Error("No file selected")

  const formData = new FormData()
  formData.append("image", file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  )

  const data = await res.json()

  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || "ImgBB upload failed")
  }

  return {
    url: data.data.url,
    displayUrl: data.data.display_url,
    deleteUrl: data.data.delete_url,
    thumbUrl: data.data.thumb?.url || data.data.url,
    mediumUrl: data.data.medium?.url || data.data.url,
    title: data.data.title || "",
    size: data.data.size || 0,
  }
}
