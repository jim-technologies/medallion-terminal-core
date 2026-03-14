import { createContext, useContext } from 'react'
import type { WidgetConfig } from '../types/template'

export interface WidgetAction {
  targetId: string
  // Fields to merge into the target widget. Omitted fields are kept as-is.
  component?: string
  title?: string
  span?: number
  height?: number
  source?: WidgetConfig['source']
  options?: WidgetConfig['options']
}

export interface DashboardContextValue {
  dispatch: (actions: WidgetAction[]) => void
}

export const DashboardContext = createContext<DashboardContextValue>({
  dispatch: () => {},
})

export function useDashboard(): DashboardContextValue {
  return useContext(DashboardContext)
}
