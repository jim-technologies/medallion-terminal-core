import { lazy, Suspense } from 'react'
import type { WidgetProps } from '../types/template'
import { Skeleton } from './states'

// Keep transcript rendering out of the package entry until mounted. The
// registry imports ConversationImpl directly; named-export consumers receive
// the same lazy behavior with a complete Suspense boundary.
const LazyConversation = lazy(() =>
  import('./ConversationImpl').then(module => ({ default: module.ConversationImpl })),
)

export function Conversation(props: WidgetProps) {
  return (
    <Suspense fallback={<Skeleton component="conversation" />}>
      <LazyConversation {...props} />
    </Suspense>
  )
}
