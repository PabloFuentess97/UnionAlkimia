"use client"

import { useState, useEffect } from "react"
import { getPosts, type PostWithAuthor } from "../actions/post-actions"
import { PostCard } from "./post-card"
import { PostForm } from "./post-form"

export function PostFeed() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts().then(({ posts }) => {
      setPosts(posts)
      setLoading(false)
    })
  }, [])

  function handleNewPost(post: PostWithAuthor) {
    setPosts((prev) => [post, ...prev])
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PostForm onSuccess={handleNewPost} />

      {posts.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          Sé el primero en publicar en la comunidad.
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
