"use client"

import { MessageSquare, Pin } from "lucide-react"
import Link from "next/link"
import type { PostWithAuthor } from "../actions/post-actions"

interface PostCardProps {
  post: PostWithAuthor
}

export function PostCard({ post }: PostCardProps) {
  const timeAgo = getTimeAgo(new Date(post.createdAt))

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-primary">
            {post.author.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{post.author.name}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {post.isPinned && <Pin className="h-3 w-3 text-primary" />}
          </div>
          <p className="mt-2 text-sm whitespace-pre-wrap">{post.content}</p>
          <div className="mt-3">
            <Link
              href={`/comunidad/${post.id}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {post._count.comments} comentarios
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return "ahora"
  if (diffMin < 60) return `hace ${diffMin}min`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}
