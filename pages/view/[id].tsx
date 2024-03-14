"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  imageUrl: string;
  description: string;
  ageRange: string;
};

export default function View() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // Fetch the post data from API
    fetch(`/api/user/${id}`)
      .then((response) => response.json())
      .then((data: Post) => setPost(data));
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img src={post.imageUrl} alt="Post Image" />
      <p>{post.description}</p>
      <p>{post.ageRange}</p>
    </div>
  );
}
