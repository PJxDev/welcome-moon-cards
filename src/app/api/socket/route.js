

import { NextResponse } from 'next/server'

import io from 'socket.io-client'
const socket = io('http://localhost:3000')

export async function POST(req, res) {
  try {
    const bodyData = await req.json()
    socket.emit(bodyData.code, bodyData.data)
    

    return NextResponse.json({ data: 'Success' }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error }, { status: 200 })
  }
}
