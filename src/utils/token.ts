import { parseToken } from "@/api/login"

export function isTokenExpired() {
  const token = localStorage.getItem('token')
  if (!token) return true

  const payload = parseToken(token)
  if (!payload || !payload.exp) return true

  // 当前时间（秒）
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}