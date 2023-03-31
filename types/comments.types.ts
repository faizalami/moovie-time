
export interface AuthorDetails {
  name: string
  username: string
  avatar_path?: string
  rating?: number
}

export interface Result {
  author: string
  author_details: AuthorDetails
  content: string
  created_at: string
  id: string
  updated_at: string
  url: string
}

export interface Comments {
  id: number
  page: number
  results: Result[]
  total_pages: number
  total_results: number
}
