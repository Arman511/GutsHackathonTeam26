export type CreateEventRequest = {
    event_name: string
    event_date: string
    description: string
    price_range: string
    outdoor: boolean
    group_activity: boolean
    vegetarian: boolean
    drinks: boolean
    food: boolean
    accessible: boolean
    formal_attire: boolean
}
export type LocationRankingRequest = { location_id: number; ranking: number }

export type AttendEventRequest = { user_id: number }

export type CreateLocationRequest = {
    location: string
    open_time: string
    close_time: string
    description: string
    address: string
    google_rating: number
    price_range: string
    outdoor: boolean
    group_activity: boolean
    vegetarian: boolean
    drinks: boolean
    food: boolean
    pet_friendly: boolean
    accessible: boolean
    formal_attire: boolean
    reservation_needed: boolean
    image_url: string
}

export type LocationSearchRequest = {
    // keywords: string[]
    location?: string | null
    open_time?: string | null
    close_time?: string | null
    description?: string | null
    address?: string | null
    google_rating?: number | null
    price_range?: string | null
    outdoor?: boolean | null
    group_activity?: boolean | null
    vegetarian?: boolean | null
    drinks?: boolean | null
    food?: boolean | null
    accessible?: boolean | null
    formal_attire?: boolean | null
    reservation_needed?: boolean | null
}

export type LoginRequest = { username: string; password: string }
export type LoginResponse = { access_token: string; token_type: string }
export type RegisterRequest = { name: string; username: string; password: string }
export type CreateKeywordRequest = { keyword: string }
export type AddUsersToEventRequest = { user_ids: number[] }
