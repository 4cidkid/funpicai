
export default async function getToken(apiKey: string): Promise<{ isOk: boolean, token: string | null, message: string | null }> {
    const response = await fetch("/api/set-key", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apiKey
        })
    })
    let data;
    try {
        data = await response.json()
    } catch (err) {
        return {
            isOk: false,
            token: null,
            message: "An error ocurred parsing the response"
        }
    }
    const { message, token } = data;
    if (!response.ok) {
        return {
            isOk: false,
            message,
            token: null
        }
    } else {
        return {
            isOk: true,
            token,
            message: null
        }
    }

}