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
    fetch(`/api/user?id=${id}`)
      .then((response) => response.json())
      .then(setPost);
  }, [id]);

  if (!post) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            border: "16px solid #f3f3f3",
            borderRadius: "50%",
            borderTop: "16px solid #3498db",
            width: "120px",
            height: "120px",
            animation: "spin 2s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
      }}
    >
      <img src={post.imageUrl} alt="Post Image" />
      <p>{post.description}</p>
      <p>{post.ageRange}</p>
    </div>
  );
}
