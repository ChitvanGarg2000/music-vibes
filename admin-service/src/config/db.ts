import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import { console } from 'inspector'

dotenv.config()

console.log(process.env.DB_CONNECTION_STRING)

export const sql = neon(process.env.DB_CONNECTION_STRING as string)