
// File: api/leaderboard.js (Get top ideas)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { data: ideas, error } = await supabase
      .from('ideas')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)
    
    if (error) throw error
    res.status(200).json(ideas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}