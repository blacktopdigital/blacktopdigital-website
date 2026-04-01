import fs from 'fs'
import path from 'path'

const CLIENTS_DIR = path.join('C:/Users/highw/BlackTopDigital/clients')

export interface ClientProfile {
  client_id: string
  business_name: string
  owner: string
  status: string
  client_since: string
  contact: { email: string | null; phone: string | null; address: string }
  website: { url: string; platform: string }
  services: string[]
  goals: string[]
  monthly_retainer: number | null
  notes: string
}

export interface ClientWebsite {
  url: string
  platform: string
  last_updated: string
}

export interface ClientGBP {
  current_rating: number | null
  review_count: number | null
  map_pack_ranking: number | null
  last_audit: string | null
  optimizations_done: string[]
}

export interface ClientAds {
  status: string
  monthly_budget: number | null
  campaigns: unknown[]
  target_keywords: string[]
}

export interface Client {
  profile: ClientProfile
  website: ClientWebsite
  gbp: ClientGBP
  ads: ClientAds
}

function readJSON(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

export function getAllClients(): Client[] {
  try {
    const dirs = fs.readdirSync(CLIENTS_DIR)
    return dirs.map(id => getClient(id)).filter(Boolean) as Client[]
  } catch {
    return []
  }
}

export function getClient(id: string): Client | null {
  const base = path.join(CLIENTS_DIR, id)
  const profile = readJSON(path.join(base, 'profile.json'))
  if (!profile) return null
  return {
    profile,
    website: readJSON(path.join(base, 'website.json')) || {},
    gbp: readJSON(path.join(base, 'gbp.json')) || {},
    ads: readJSON(path.join(base, 'ads.json')) || {},
  }
}
