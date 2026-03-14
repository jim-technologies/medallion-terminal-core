import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[MedallionTerminal] Widget error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-full text-red-400/80 text-sm p-4 text-center">
          <div>
            <div className="font-medium mb-1">Widget Error</div>
            <div className="text-zinc-500 text-xs">{this.state.error.message}</div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
