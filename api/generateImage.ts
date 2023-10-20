export default async function generateImage(prompt: string): Promise<{ isOk: boolean, image: string | null, message: string }> {
  const response = await fetch("/api/generate", {
    method: "POST",
    body: JSON.stringify({
      prompt: prompt,
    })
  })
  try {
    let { message, image } = await response.json()
    if (!response.ok) {
      return {
        isOk: false,
        image: null,
        message: message
      }
    } else if (!image) {
      return {
        isOk: false,
        image: null,
        message: "There was an error trying to get the image from the response"
      }
    } else {
      return {
        isOk: true,
        image,
        message: message ?? "Image generated successfully"
      }
    }
  } catch (err) {
    return {
      isOk: false,
      image: null,
      message: "there was an error trying to destructure the response object"
    }
  }

}


