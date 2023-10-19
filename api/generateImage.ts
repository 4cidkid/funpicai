export default async function generateImage(prompt: string): Promise<{ isOk: boolean, image: string | null, message: string }> {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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", // don't worry about this, is no longer valid lol
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: prompt,
    })
  })
  const data = await response.json() ?? null;

  if (!response.ok) {
    if (data && data.error) {
      if (data.error.code === "content_policy_violation") {
        return { isOk: false, image: null, message: "You prompt contains content that violates openAI content policy, please try again with a different prompt!" }
      }
      else {
        return { isOk: false, image: null, message: "Something went wrong, please try again!" }
      }
    } else {
      return { isOk: false, image: null, message: "Something went wrong, please try again!" }
    }

  } else {
    return { isOk: true, image: data?.data[0]?.url, message: "" }
  }
}


