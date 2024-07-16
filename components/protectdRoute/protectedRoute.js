// components/ProtectedRoute.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
      const checkUser = async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          router.replace('/login')
        } else {
          setLoading(false)
        }
      }
      checkUser()
    }, [router, supabase])

    if (loading) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }
}

export default ProtectedRoute
