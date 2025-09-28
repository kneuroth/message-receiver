import { z } from 'zod/v4'

export const fromSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  username: z.string(),
})
export type From = z.infer<typeof fromSchema>

export const chatSchema = z.object({
  id: z.number(),
  type: z.literal('group').or(z.literal('private')),
})
export type Chat = z.infer<typeof chatSchema>

export const messageSchema = z.object({
  message_id: z.number(),
  from: fromSchema,
  chat: chatSchema,
  date: z.number(),
  text: z.string(),
})
export type Message = z.infer<typeof messageSchema>

export const updateSchema = z.looseObject({
  update_id: z.number(),
  message: messageSchema,
})
export type Update = z.infer<typeof updateSchema>
