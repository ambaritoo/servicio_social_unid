import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()

  // Crear un cliente de Supabase configurado para usar cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refrescar sesión si está expirada - requerido para Server Components
  await supabase.auth.getUser()

  return res
}

// Asegúrate de que el middleware solo se llame para las rutas relevantes.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
