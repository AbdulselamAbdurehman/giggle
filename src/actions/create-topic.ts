'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import {paths} from "@/path";
import { revalidatePath } from "next/cache";

const createTopicSchema = z.object({
    name: z.string().min(3).regex(/[a-z-]/, {message: "Must be lowercases letters or dashes without spaces"})
    , description: z.string().min(10)
})

interface CreateTopicFormState {
    errors: {
        name?: string[],
        description?: string[],
        _form?: string[]

    }
}
export async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {

    await new Promise(resolve => setTimeout(resolve, 2500));

    const session = await auth();
    if (!session || !session.user) {
        return { errors: { _form: ["You must be logged in to create a topic."] } };  // Ensure to return here
    }


    const result = createTopicSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    })

    if (!result.success){
        return {errors: result.error.flatten().fieldErrors}
    }

   let topic: Topic;
    
    try {
        topic = await db.topic.create({data: {
            slug: result.data.name,
            description: result.data.description,
        }})

    }catch (err: any){
        if (err instanceof Error){
            return {
                errors: {
                    _form: [err.message]
                }
            }
        } else {
            return {
                errors: {
                    _form: ["Something went wrong."]
                }
            }
        }
    }
    revalidatePath(paths.home())
    redirect(paths.topicShow(topic.slug))
}

// revalidatePath /
