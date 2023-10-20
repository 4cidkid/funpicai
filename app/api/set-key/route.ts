import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest, response: NextResponse) {
    let apiKey: string;
    try {
        apiKey = await request.json()
    } catch (err) {
        return NextResponse.json({
            message: "Error getting api key"
        }, {
            status: 500
        })
    }
    if (!apiKey) {
        return NextResponse.json({
            message: "Missing API key"
        }, { status: 400 })
    }

    const key = String(process.env.SECRET_KEY)
    let token;
    try {
        token = jwt.sign({ apiKey: apiKey }, key, { expiresIn: 21600 })
    } catch (err) {
        return NextResponse.json({
            message: "Error generating token"
        }, {
            status: 500
        })
    }
    return NextResponse.json({
        token,
        message: "Api Key added successfully"
    }, {
        status: 200
    })
}