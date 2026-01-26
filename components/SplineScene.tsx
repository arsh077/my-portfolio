import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline').catch(() => ({
  default: () => <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900"></div>
})))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <span className="loader"></span>
      </div>
    }>
      <Spline
        scene={scene}
        className={className}
        onError={() => console.log('Spline scene failed to load')}
      />
    </Suspense>
  )
}