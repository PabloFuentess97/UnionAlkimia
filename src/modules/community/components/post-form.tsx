"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { createPost } from "../actions/post-actions"
import type { PostWithAuthor } from "../actions/post-actions"

interface PostFormProps {
  onSuccess?: (post: PostWithAuthor) => void
}

export function PostForm({ onSuccess }: PostFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const result = await createPost({ content })
    if (result.success) {
      setContent("")
      onSuccess?.(result.data as unknown as PostWithAuthor)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comparte algo con la comunidad..."
        rows={3}
        className="w-full resize-none rounded-lg border-0 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  )
}
