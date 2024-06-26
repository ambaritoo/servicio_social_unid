'use server'

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
    const supabase = createClient()
  
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  }