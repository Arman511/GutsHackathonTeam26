import { CreateEventRequest, CreateLocationRequest, LocationRankingRequest, LocationSearchRequest, LoginRequest, LoginResponse, RegisterRequest, CreateKeywordRequest, AttendEventRequest } from "./types"


async function request(path: string, opts: RequestInit = {}, content_type: string = 'application/json'): Promise<any> {
    const res = await fetch(path, {
        credentials: 'include',
        headers: { 'Content-Type': content_type, ...(opts.headers || {}) },
        ...opts,
    })
    if (!res.ok) {
        const text = await res.text()
        if (res.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }
        console.error('API request failed:', { path, status: res.status, statusText: res.statusText, body: text })
        throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
    }
    const contentType = res.headers.get('content-type') || ''
    return contentType.includes('application/json') ? res.json() : res.text()
}

async function loggedInRequest(path: string, opts: RequestInit = {}, content_type: string = 'application/json'): Promise<any> {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        window.location.href = "/login";
    }
    const headers = {
        'Authorization': `bearer ${accessToken}`,
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
    return loggedInRequest('/api/auth/me', { method: 'GET' })
}

//login pass in user and password returns session token and access toekn ignore token type its always beer
// pass in access option opts: RequestInit = {} is a dictoin ops.headers header.auth equals bearer and auth token

export async function createEvent(data: CreateEventRequest) {
    return loggedInRequest('/api/events/create_event', { method: 'POST', body: JSON.stringify(data) })
}

export async function addLocation(data: CreateLocationRequest) {
    return loggedInRequest('/api/locations/add_location', { method: 'POST', body: JSON.stringify(data) })
}

export async function searchLocations(query: LocationSearchRequest) {
    return loggedInRequest(`/api/locations/location_search`, { method: 'POST', body: JSON.stringify(query) })
}

export async function rankLocation(data: LocationRankingRequest) {
    return loggedInRequest('/api/locations/user_location_rank', { method: 'POST', body: JSON.stringify(data) })
}

export async function getAllLocations() {
    return loggedInRequest('/api/locations/all_locations', { method: 'GET' })
}

export async function getLocation(locationId: number) {
    return loggedInRequest(`/api/locations/location/${locationId}`, { method: 'GET' })
}

export async function getLocationsForEvent(eventId: number) {
    return loggedInRequest(`/api/locations/get_locations_for_event/${eventId}`, { method: 'GET' })
}

export async function getAllEvents() {
    return loggedInRequest('/api/events/all_events', { method: 'GET' })
}

export async function getEvent(eventId: number) {
    return loggedInRequest(`/api/events/event/${eventId}`, { method: 'GET' })
}

export async function getAttendingEvents() {
    return loggedInRequest('/api/events/my_attending_events', { method: 'GET' })
}

export async function getCreatedEvents() {
    return loggedInRequest('/api/events/my_created_events', { method: 'GET' })
}

export async function getEventAttendees(eventId: number) {
    return loggedInRequest(`/api/events/event_attendees/${eventId}`, { method: 'GET' })
}

export async function getEventResult(eventId: number) {
    return loggedInRequest(`/api/results/get_result/${eventId}`, { method: 'GET' })
}

export async function getAllKeywords() {
    return loggedInRequest('/api/keywords/all_keywords', { method: 'GET' })
}

export async function getKeyword(keywordId: number) {
    return loggedInRequest(`/api/keywords/keyword/${keywordId}`, { method: 'GET' })
}

export async function createKeyword(data: CreateKeywordRequest) {
    return loggedInRequest('/api/keywords/create_keyword', { method: 'POST', body: JSON.stringify(data) })
}

export async function getUsers() {
    return loggedInRequest('/api/users', { method: 'GET' })
}

export async function healthCheck() {
    return request('/api/health', { method: 'GET' })
}

export async function attendEvent(event_id: number, user_id: AttendEventRequest) {
    return loggedInRequest(`/api/events/attend_event/${event_id}`, { method: 'POST', body: JSON.stringify(user_id) })
}
