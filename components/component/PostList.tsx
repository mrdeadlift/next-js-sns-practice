// components/PostList.tsx

import { auth } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/postDataFetcher";
import Post from "./Post";

export default async function PostList() {

  const { userId } = auth();

  // If user is not logged in, return
  if (!userId) {
    return ;
  }

  const posts = await fetchPosts(userId);

  return (
    <div className="space-y-4">
      {posts.length ? (posts.map((post) => (
        <Post key={post.id} post={post} />
      )
      )) : (
        <p>No posts yet</p>
      )}
    </div>
  );
}
