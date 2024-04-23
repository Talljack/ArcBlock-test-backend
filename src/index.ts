import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import {
  getUserInfo,
  updateUserInfo,
} from './crud'

const app = new Hono()

app.use(logger())
app.use(prettyJSON())
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST'],
  credentials: true,
}))

app.get('/api/user', zValidator(
  'query',
  z.object({
    id: z.string(),
  })), async (c) => {
  const { id } = c.req.query()
  const userData = await getUserInfo(id)
  return c.json({
    success: true,
    data: userData,
  })
})

app.post('/api/user', zValidator(
  'form',
  z.object({
    id: z.string()?.optional(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    avatar: z.string(),
    bio: z.string(),
  })), async (c) => {
  const { id, name, phone, email, avatar, bio } = c.req.valid('form')
  await updateUserInfo({ id: id ?? name, name, phone, email, avatar, bio })
  return c.json({ success: true })
})

export default {
  fetch: app.fetch,
  port: 3000,
}
