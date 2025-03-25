import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import {} from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import "@opentelemetry/api";

const geminiProExpModel = google("gemini-1.5-pro", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const VideoGenResponseSchema = z.object({
  emailBody: z.string(),
});

export const POST = async (req) => {
  try {
    const body = await req.json();

    const { userPrompt } = body;

    const emailResponse = await generateObject({
      model: geminiProExpModel,
      system: `
     You are an Email generation specialist. 
      Generate a welcome message using attractive words and a little bit of your own experience.
      This will be strictly in JSON format:

      \`\`\`
      emailBody: "Your response"
      \`\`\`
      `,
      prompt: userPrompt,
      schema: VideoGenResponseSchema,
    });

    return NextResponse.json(
      { message: emailResponse.object.emailBody },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Email not sent" }, { status: 500 });
  }
};
