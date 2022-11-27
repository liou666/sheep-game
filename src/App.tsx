import { Suspense } from 'react'
import Footer from '@/components/Footer'
import routes from '~react-pages'

export default function App() {
  return (
    <main
      font-sans p='x-4 y-10'
      text='center gray-700 dark:gray-200'
    >
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
      <Footer />
    </main>
  )
}
