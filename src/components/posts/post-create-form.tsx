"use client";

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import FormButton from "../common/form-button";
import { useFormState } from "react-dom";
import * as actions from "@/actions";

export default function PostCreateForm() {
  const [formState, action] = useFormState(actions.createPost, { errors: {} });

  return (
    <Popover>
      <PopoverTrigger>
        <Button color="primary">Create a Post</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Post</h3>
            <Input
              name="title"
              label="Title"
              placeholder="Title"
              labelPlacement="outside"
            />
            <Textarea
              name="content"
              label="Content"
              placeholder="Content"
              labelPlacement="outside"
            />
            <FormButton>
              <Button type="submit">Create Post</Button>
            </FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
