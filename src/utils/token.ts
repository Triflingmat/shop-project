/**
 * 解析 JWT Token，获取 payload 部分
 */
export function parseToken(token: string) {
    try {
        const payload = token.split('.')[1]
        const decoded = atob(payload || '')
        return JSON.parse(decoded)
    } catch {
        return null
    }
}

/**
 * 判断 Token 是否过期
 */
export function isTokenExpired(): boolean {
    const token = localStorage.getItem('token')
    if (!token) return true

    const payload = parseToken(token)
    if (!payload || !payload.exp) return true

    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
}

/**
 * 获取存储的 Token
 */
export function getToken(): string | null {
    return localStorage.getItem('token')
}

/**
 * 设置 Token 到 localStorage
 */
export function setToken(token: string): void {
    localStorage.setItem('token', token)
}

/**
 * 清除 Token
 */
export function removeToken(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
}
