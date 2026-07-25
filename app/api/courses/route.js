import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import courses from './data.json'

export async function GET() {
  return NextResponse.json(courses)
}

export async function POST(req) {
  const { title, description, level, link } = await req.json()
  const newCourse = {
    id: uuidv4(),
    title,
    description,
    level,
    link,
  }
  courses.push(newCourse)
  return NextResponse.json(courses)
}
