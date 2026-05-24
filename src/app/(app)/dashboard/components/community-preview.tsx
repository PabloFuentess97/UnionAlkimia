import Link from "next/link"
import type { CommunityPost, User } from "@prisma/client"

type PostWithAuthor = CommunityPost & {
  author: Pick<User, "name" | "avatar">
}

export function CommunityPreview({ posts }: { posts: PostWithAuthor[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Comunidad</h2>
        <p className="text-sm text-muted-foreground">
          Aun no hay publicaciones.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Comunidad</h2>
        <Link href="/comunidad" className="text-xs text-primary hover:underline">
          Ver todo
        </Link>
      </div>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {post.author.name?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm line-clamp-2">{post.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {post.author.name} &middot;{" "}
                {new Date(post.createdAt).toLocaleDateString("es", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
