"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type State = {
    error?: string　| undefined;
    success: boolean;
    };
    

export async function addPostAction(prevState:State ,formData: FormData): Promise<State> {
    try {
      // Get the user ID from the session
      const { userId } = auth();
      // If user is not logged in, return
      if (!userId) {
        return { error: "You must be logged in to post", success: false };
      }
      const postText = formData.get("post") as string;
      const postTextSchema = z
      .string()
      .min(1, { message: "Post cannot be empty" })
      .max(280, { message: "Post cannot be longer than 280 characters" });
  
      const validatedPostText = postTextSchema.parse(postText);
      await prisma.post.create({
        data: {
          content: validatedPostText,
          userId: userId,
        },
      });

      revalidatePath("/");

      return {
        error: undefined,
        success: true,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          error: error.errors.map((err) => err.message).join(", "),
          success: false,
        };
      } else if (error instanceof Error) {
        return {
          error: error.message,
          success: false,
        };
      } else {
        return {
          error: "An unknown error occurred",
          success: false,
        };
      }
    }
  }