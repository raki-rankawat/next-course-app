import { NextResponse } from 'next/server'
import courses from '../data.json'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const filteredCourse = courses.filter(course =>
    course.title.toLowerCase().includes(query.toLowerCase()),
  )
  return NextResponse.json(filteredCourse)
}
