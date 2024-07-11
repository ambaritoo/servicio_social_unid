import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  console.log('Intentando iniciar sesión con:', email)

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('Error al iniciar sesión:', error.message)
    return NextResponse.json({ success: false, message: `Error al iniciar sesión: ${error.message}` }, { status: 400 })
  }

  console.log('Inicio de sesión exitoso para:', data.user.email)

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  })
}
