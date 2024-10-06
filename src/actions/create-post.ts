'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { Post } from "@prisma/client";
import { title } from "process";
import { z } from "zod";


interface CreatePostState{
    errors: {
        title?: string[],
        content?: string[]
        _form?: string[]
    }
}

const createPostSchema = z.object({
    title: z.string().min(5).regex(/[a-z-]/, {message: "Must consist only letters, spaces and -"}),
    content: z.string().min(10)
})


export async function createPost(formState: CreatePostState, formData: FormData): Promise<CreatePostState> {   
    const session = await auth();

    if (!session || !session.user){
        return {
            errors: {
                _form: ["You Must Sign In to Create a Post"],
            }
        }
    }

    const result = createPostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
    })

    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }
    let post: Post;

    try {
        post = await db.post.create({
            data: {
                title: result.data.title,
                content: result.data.content,
                userId: '',
                topicId: ''
            }
        })

    } catch (error: any){

    }
    return formState;

}

// revalidatePath /, /posts/[postId]