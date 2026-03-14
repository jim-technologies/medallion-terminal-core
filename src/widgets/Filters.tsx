import { useState, useMemo, useCallback } from 'react'
import type { FilterConfig } from '../types/template'

export type FilterValues = Record<string, unknown>

interface FiltersProps {
  filters: FilterConfig[]
  data: unknown
  onChange: (values: FilterValues) => void
}

export function Filters({ filters, data, onChange }: FiltersProps) {
  const [values, setValues] = useState<FilterValues>({})

  const resolved = useMemo(
    () => filters.map(f => resolveFilter(f, data)),
    [filters, data],
  )

  const handleChange = useCallback((key: string, value: unknown) => {
    const next = { ...values, [key]: value }
    // Remove empty/null filters
    if (value === '' || value === null || value === undefined) {
      delete next[key]
    }
    setValues(next)
    onChange(next)
  }, [values, onChange])

  if (resolved.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-1">
      {resolved.map(f => (
        <FilterControl
          key={f.key}
          filter={f}
          value={values[f.key]}
          onChange={v => handleChange(f.key, v)}
        />
      ))}
    </div>
  )
}

// --- Individual filter controls ---

interface ResolvedFilter {
  key: string
  label: string
  type: 'select' | 'range' | 'text'
  options?: string[]
  min?: number
  max?: number
}

function FilterControl({ filter, value, onChange }: {
  filter: ResolvedFilter
  value: unknown
  onChange: (v: unknown) => void
}) {
  const baseClass = 'bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 outline-none focus:border-zinc-500'

  if (filter.type === 'select') {
    return (
      <label className="flex items-center gap-1.5 text-xs text-zinc-400">
        {filter.label}
        <select
          className={baseClass}
          value={String(value ?? '')}
          onChange={e => onChange(e.target.value || undefined)}
        >
          <option value="">All</option>
          {filter.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>
    )
  }

  if (filter.type === 'range') {
    return (
      <label className="flex items-center gap-1.5 text-xs text-zinc-400">
        {filter.label}
        <input
          type="number"
          className={`${baseClass} w-20`}
          placeholder="min"
          value={String((value as { min?: number })?.min ?? '')}
          onChange={e => {
            const v = e.target.value ? Number(e.target.value) : undefined
            onChange({ ...(value as object), min: v })
          }}
        />
        <span className="text-zinc-600">-</span>
        <input
          type="number"
          className={`${baseClass} w-20`}
          placeholder="max"
          value={String((value as { max?: number })?.max ?? '')}
          onChange={e => {
            const v = e.target.value ? Number(e.target.value) : undefined
            onChange({ ...(value as object), max: v })
          }}
        />
      </label>
    )
  }

  // text
  return (
    <label className="flex items-center gap-1.5 text-xs text-zinc-400">
      {filter.label}
      <input
        type="text"
        className={`${baseClass} w-32`}
        placeholder={`Filter ${filter.label}...`}
        value={String(value ?? '')}
        onChange={e => onChange(e.target.value || undefined)}
      />
    </label>
  )
}

// --- Auto-inference ---

function resolveFilter(config: FilterConfig, data: unknown): ResolvedFilter {
  const label = config.label || config.key
  const type = config.type || 'auto'

  // Explicit options = select
  if (config.options) {
    return { key: config.key, label, type: 'select', options: config.options.map(String) }
  }

  if (type !== 'auto') {
    if (type === 'select') {
      return { key: config.key, label, type: 'select', options: inferOptions(config.key, data) }
    }
    return { key: config.key, label, type }
  }

  // Auto-infer from data
  const sample = getFieldValues(config.key, data)
  if (sample.length === 0) return { key: config.key, label, type: 'text' }

  // All numbers → range
  if (sample.every(v => typeof v === 'number')) {
    return {
      key: config.key, label, type: 'range',
      min: Math.min(...sample as number[]),
      max: Math.max(...sample as number[]),
    }
  }

  // Few unique strings → select
  const unique = [...new Set(sample.map(String))]
  if (unique.length <= 20) {
    return { key: config.key, label, type: 'select', options: unique.sort() }
  }

  // Fallback → text search
  return { key: config.key, label, type: 'text' }
}

function inferOptions(key: string, data: unknown): string[] {
  const values = getFieldValues(key, data)
  return [...new Set(values.map(String))].sort()
}

function getFieldValues(key: string, data: unknown): unknown[] {
  if (!Array.isArray(data)) return []
  return data
    .map(row => (row as Record<string, unknown>)?.[key])
    .filter(v => v != null)
}

// --- Apply filters to data ---

export function applyFilters(data: unknown, filters: FilterConfig[], values: FilterValues): unknown {
  if (!Array.isArray(data) || Object.keys(values).length === 0) return data

  return data.filter(row => {
    const r = row as Record<string, unknown>
    for (const f of filters) {
      const val = values[f.key]
      if (val === undefined || val === null) continue

      const cellVal = r[f.key]

      // Select filter
      if (typeof val === 'string') {
        if (String(cellVal) !== val) return false
      }

      // Range filter
      if (typeof val === 'object' && val !== null && ('min' in val || 'max' in val)) {
        const num = Number(cellVal)
        const range = val as { min?: number; max?: number }
        if (range.min != null && num < range.min) return false
        if (range.max != null && num > range.max) return false
      }
    }
    return true
  })
}
