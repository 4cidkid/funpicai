
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest, response: NextRequest) {
    let data;
    try {
        data = await request.json()
    } catch (err) {
        return NextResponse.json({
            message: "Error getting prompt"
        }, {
            status: 500
        })
    }
    const { prompt, token } = data;
    const apiKey = token;
    if (!prompt) {
        return NextResponse.json({
            message: "Prompt was not provided"
        }, {
            status: 400
        })
    }
    if (!apiKey) {
        return NextResponse.json({
            message: "You have to setup your api key"
        }, {
            status: 401
        })
    }
    let apiKeyDecoded: JwtPayload;
    try {
        apiKeyDecoded = jwt.verify(apiKey, String(process.env.SECRET_KEY)) as JwtPayload
    } catch (err) {
        return NextResponse.json({
            message: "Error decoding token"
        }, {
            status: 500
        })
    }
    if (apiKeyDecoded && apiKeyDecoded.apiKey) {
        console.log(apiKeyDecoded)
        const res = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKeyDecoded.apiKey.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        })
        let data;
        try {
            data = await res.json()
        } catch (err) {
            return NextResponse.json({
                message: "There was an error trying to fetch the openAI server"
            }, {
                status: 500
            })
        }
        if (!res.ok) {
            if (data && data.error && (data.error.code === "invalid_api_key" || data.error.code === "content_policy_violation")) {
                if (data.error.code === "invalid_api_key") {
                    return NextResponse.json({
                        message: "Your api key is invalid"
                    }, {
                        status: 400
                    })
                }
                if (data.error.code === "content_policy_violation") {
                    return NextResponse.json({
                        message: "You prompt contains content that violates openAI content policy, please try again with a different prompt!"
                    }, {
                        status: 400
                    })
                }
            } else {
                console.log(data)
                return NextResponse.json({
                    message: "Something went wrong, please try again!"
                }, {
                    status: 500
                })
            }
        }
        return NextResponse.json({
            message: "201 CREATED",
            image: data?.data[0]?.url
        })
    } else {
        return NextResponse.json({
            message: "token was not generated correctly"
        }, {
            status: 500
        })
    }
}
