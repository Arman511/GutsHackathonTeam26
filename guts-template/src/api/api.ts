type LoginRequest = { username: string; password: string }
type LoginResponse = { session_token: string; user_id: string }
type RegisterRequest = { name: string, username: string; password: string }

async function request(path: string, opts: RequestInit = {}, content_type: string = 'application/json'): Promise<any> {
    const res = await fetch(path, {
        credentials: 'include',
        headers: { 'Content-Type': content_type, ...(opts.headers || {}) },
        ...opts,
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
    }
    const contentType = res.headers.get('content-type') || ''
    return contentType.includes('application/json') ? res.json() : res.text()
}

async function loggedInRequest(path: string, opts: RequestInit = {}, content_type: string = 'application/json'): Promise<any> {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        throw new Error('No access token found, user is not logged in')
    }
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        ...(opts.headers || {}),
    }
    return request(path, { ...opts, headers }, content_type)
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const encodededData = new URLSearchParams();
    encodededData.append("username", data.username);
    encodededData.append("password", data.password);
    return request('/api/auth/token', { method: 'POST', body: encodededData.toString() }, "application/x-www-form-urlencoded");
}

export async function register(data: RegisterRequest) {
    return request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
}

export async function getMe() {
    return loggedInRequest('/api/users/me', { method: 'GET' })
}

//login pass in user and password returns session token and access toekn ignore token type its always beer
// pass in access option opts: RequestInit = {} is a dictoin ops.headers header.auth equals bearer and auth token
