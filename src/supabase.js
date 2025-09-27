import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('test').select('*').limit(1)
        if (error) {
            console.log('Supabase connected but no tables yet:', error.message)
        } else {
            console.log('Supabase connected successfully!')
        }
        return true
    } catch (err) {
        console.error('Failed to connect to Supabase:', err)
        return false
    }
}