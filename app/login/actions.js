'use server';
import { supabase } from '@/database/supabaseClient';
import { cookies } from 'next/headers';

export async function login(formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { data: session, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    return { success: false, message: "Error al iniciar sesión: " + error.message };
  } else {
    console.log("Inicio de sesión exitoso para el usuario:", session.user.email);

    return { success: true, message: "Inicio de sesión exitoso para el usuario: " + session.user.email };
  }
}

export async function signup(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const { data: session, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Error al registrarse:", error.message);
    return { success: false, message: "Error al registrarse: " + error.message };
  } else {
    console.log("Registro exitoso para el usuario:", session.user.email);
    cookies().set('supabase-token', session.access_token, { path: '/', httpOnly: true });
    return { success: true, message: "Registro exitoso para el usuario: " + session.user.email };
  }
}
