// File: api/ideas.js (Vercel API route)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all ideas for swiping
        const { data: ideas, error } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        res.status(200).json(ideas)
        break

      case 'POST':
        // Submit new idea
        const { data: newIdea, error: insertError } = await supabase
          .from('ideas')
          .insert([{
            pitch: req.body.pitch,
            problem: req.body.problem,
            target: req.body.target,
            relevance: req.body.relevance,
            llm: req.body.llm,
            tam: req.body.tam,
            validation: req.body.validation,
            feature: req.body.feature
          }])
          .select()
        
        if (insertError) throw insertError
        res.status(201).json(newIdea[0])
        break

      default:
        res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}