import { z } from 'zod/v4'

export const From = z.object({
  id: z.number(),
  first_name: z.string(),
  username: z.string(),
})

export type From = z.infer<typeof From>

export const Chat = z.object({
  id: z.number(),
  type: z.literal('group').or(z.literal('private')),
})

export type Chat = z.infer<typeof Chat>

export const Message = z.object({
  message_id: z.number(),
  from: From,
  chat: Chat,
  date: z.number(),
  text: z.string(),
})

export type Message = z.infer<typeof Message>

export const Update = z.looseObject({
  update_id: z.number(),
  message: Message,
})

export type Update = z.infer<typeof Update>
