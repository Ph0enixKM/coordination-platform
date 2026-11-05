"use client";

import { useParams } from "next/navigation";
import PostEditor from "../../components/PostEditor/PostEditor";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();

  return <PostEditor id={Number(id)} />;
}
