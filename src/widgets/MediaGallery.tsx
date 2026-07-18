import { lazy, Suspense } from 'react'
import type { WidgetProps } from '../types/template'
import { Skeleton } from './states'

// Keep the photo/video viewer out of the package entry until it is actually
// mounted. Unlike the registry path (which imports MediaGalleryImpl directly),
// this wrapper also gives consumers of the named component export a complete
// Suspense boundary.
const LazyMediaGallery = lazy(() =>
  import('./MediaGalleryImpl').then(module => ({ default: module.MediaGalleryImpl })),
)

export function MediaGallery(props: WidgetProps) {
  return (
    <Suspense fallback={<Skeleton component="media_gallery" />}>
      <LazyMediaGallery {...props} />
    </Suspense>
  )
}
