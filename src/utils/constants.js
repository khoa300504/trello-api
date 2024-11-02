import { env } from '~/config/environment'

//Domains has permission to access server resource
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173'
  'https://trello-web-liart-eight.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT