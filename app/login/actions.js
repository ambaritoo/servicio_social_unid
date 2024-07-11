'use server';
import { supabase } from '@/database/supabaseClient';

export async function login(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const { data: session, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    return { success: false, message: "Error al iniciar sesión: " + error.message };
  } else {
    console.log("Inicio de sesión exitoso para el usuario:", session.user.email);
    // Maneja el almacenamiento de la sesión, redireccionamiento, etc.
    // Por ejemplo, almacena el token en cookies
    cookies().set('supabase-token', session.access_token, { path: '/', httpOnly: true });
    return { success: true, message: "Inicio de sesión exitoso para el usuario: " + session.user.email };
  }
}
