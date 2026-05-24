"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { communityPostSchema } from "@/lib/validators"
import type { ActionResult } from "@/types"
import type { CommunityPost, CommunityComment, User } from "@prisma/client"

export type PostWithAuthor = CommunityPost & {
  author: Pick<User, "id" | "name" | "avatar">
  _count: { comments: number }
}

export type CommentWithAuthor = CommunityComment & {
  author: Pick<User, "id" | "name" | "avatar">
}

export async function getPosts(cursor?: string): Promise<{
  posts: PostWithAuthor[]
  nextCursor: string | null
}> {
  const session = await auth()
  if (!session?.user?.organizationId) return { posts: [], nextCursor: null }

  const take = 20
  const posts = await prisma.communityPost.findMany({
    where: {
      organizationId: session.user.organizationId,
      deletedAt: null,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      _count: { select: { comments: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = posts.length > take
  const data = hasMore ? posts.slice(0, take) : posts

  return {
    posts: data as PostWithAuthor[],
    nextCursor: hasMore ? data[data.length - 1].id : null,
  }
}

export async function createPost(input: unknown): Promise<ActionResult<CommunityPost>> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const parsed = communityPostSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const post = await prisma.communityPost.create({
    data: {
      organizationId: session.user.organizationId,
      authorId: session.user.id,
      content: parsed.data.content,
      mediaUrls: parsed.data.mediaUrls,
    },
  })

  return { success: true, data: post }
}

export async function deletePost(postId: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const post = await prisma.communityPost.findFirst({
    where: { id: postId, organizationId: session.user.organizationId },
  })

  if (!post) {
    return { success: false, error: "Post no encontrado" }
  }

  const isAdmin = session.user.role === "ORG_ADMIN" || session.user.role === "SUPER_ADMIN"
  if (post.authorId !== session.user.id && !isAdmin) {
    return { success: false, error: "Sin permisos" }
  }

  await prisma.communityPost.update({
    where: { id: postId },
    data: { deletedAt: new Date() },
  })

  return { success: true, data: null }
}

export async function getPostComments(postId: string): Promise<CommentWithAuthor[]> {
  return prisma.communityComment.findMany({
    where: { postId, deletedAt: null },
    include: { author: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "asc" },
  }) as Promise<CommentWithAuthor[]>
}

export async function createComment(
  postId: string,
  content: string
): Promise<ActionResult<CommunityComment>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" }
  }

  if (!content.trim()) {
    return { success: false, error: "El comentario no puede estar vacío" }
  }

  const comment = await prisma.communityComment.create({
    data: {
      postId,
      authorId: session.user.id,
      content: content.trim(),
    },
  })

  return { success: true, data: comment }
}
