import { NextRequest, NextResponse } from "next/server";
import processImage from "@/utils/processImage";
import resizeImage from "@/utils/resizeImage";
import jwt, { JwtPayload } from "jsonwebtoken";
import { EditData } from "@/types/types";
export async function POST(request: NextRequest, response: NextResponse) {
    let data: EditData;
    try {
        data = await request.formData() as unknown as EditData;
    } catch (err) {
        return NextResponse.json({
            message: "Error getting data from form"
        }, {
            status: 500
        })
    }
    if (!data) {
        return NextResponse.json({
            message: "Error getting data from form"
        }, {
            status: 500
        })
    }
    let mask: File | null = data.get("mask") as File | null;
    let originalImage: File | null = data.get("image") as File | null;
    const prompt: string | null = data.get("prompt") as string | null;
    const apiKey: string | null = data.get("token") as string | null;
    if (!mask || !originalImage || !prompt || !apiKey) {
        console.log("Error getting data from form", data)
        return NextResponse.json({
            message: "There was an error trying to get all the necessary information"
        }, {
            status: 400
        });
    }
    let apiKeyDecoded: JwtPayload;
    try {
        apiKeyDecoded = jwt.verify(apiKey.toString(), String(process.env.SECRET_KEY)) as JwtPayload
    } catch (err) {
        console.error(err)
        return NextResponse.json({
            message: "Error decoding token"
        }, {
            status: 500
        })
    }
    const apiKeyFromToken = apiKeyDecoded.apiKey.apiKey;
    if (!apiKeyFromToken) {
        return NextResponse.json({
            message: "There was an error trying to get all the necessary information"
        }, {
            status: 400
        });
    }

    try {
        const widthAndHeight = 1080;
        const resizeMask = await resizeImage(mask, widthAndHeight, widthAndHeight);
        const resizeOriginalImageBuffer = await resizeImage(originalImage, widthAndHeight, widthAndHeight)
        const maskProcessedBlob = await processImage(resizeMask)
        const originalImageBlob = new Blob([resizeOriginalImageBuffer], { type: 'image/png' });
        const formData = new FormData()
        formData.append("prompt", prompt)
        formData.append("mask", maskProcessedBlob)
        formData.append("image", originalImageBlob)

        const response = await fetch("https://api.openai.com/v1/images/edits", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKeyFromToken}`,
            },
            body: formData
        })
        const editedImage = await response.json()
        if (!response.ok) {
            const message: string = editedImage.error.code?.toLowerCase() === 'invalid_api_key' ? "Invalid API key" : "There was an error processing the image"
            return NextResponse.json({
                message: message
            }, {
                status: 500
            })
        }
        return NextResponse.json({
            message: "Image successfully edited",
            image: editedImage.data[0].url
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({
            message: "An error ocurred proccesing the image"
        }, {
            status: 500
        })
    }

}