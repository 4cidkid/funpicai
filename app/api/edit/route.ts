import { NextRequest, NextResponse } from "next/server";
import processImage from "@/utils/processImage";
import resizeImage from "@/utils/resizeImage";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest, response: NextResponse) {
    let data;
    try {
        data = await request.formData()
    } catch (err) {
        return NextResponse.json({
            message: "Error getting data from form"
        }, {
            status: 500
        })
    }
    const mask = data.get("mask")
    const originalImage = data.get("image");
    const prompt = data.get("prompt")
    const apiKey = String(data.get("token"))
    let apiKeyDecoded: JwtPayload;
    try {
        apiKeyDecoded = jwt.verify(apiKey, String(process.env.SECRET_KEY)) as JwtPayload
    } catch (err) {
        console.error(err)
        return NextResponse.json({
            message: "Error decoding token"
        }, {
            status: 500
        })
    }
    const apiKeyFromToken = apiKeyDecoded.apiKey.apiKey;
    if (!prompt || !apiKeyFromToken || !mask || !originalImage) {
        return NextResponse.json({
            message: "There was an error trying to get all the necessary information"
        }, {
            status: 400
        });
    }
    if (mask instanceof File && originalImage instanceof File) {
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


    } else {
        return NextResponse.json({
            message: "Form data is incorrect"
        }, {
            status: 400
        })
    }

}