import type { IconName } from '../components/Icon'
import { typeColorFor, type TypeColor } from '../components/TypeGlyph'

/**
 * An object type as the ontology components show it: a label with an
 * identity icon and colour slot. When the type declares no presentation,
 * the icon is the generic `object` glyph and the slot is derived from its
 * id, so a type keeps its colour across reloads.
 */
export interface ObjectTypeRef {
  /** Stable type id; drives the fallback colour slot. */
  id?: string
  /** Human-readable type name, such as "Customer". */
  label: string
  /** Type icon; `object` when unset. */
  icon?: IconName
  /** Identity slot; `typeColorFor(id ?? label)` when unset. */
  color?: TypeColor
}

/** A reference to one object, enough to show and open it. */
export interface ObjectRef {
  /** Stable object id. */
  id: string
  /** Display title. */
  title: string
  /** The object's type, for its glyph. */
  type?: ObjectTypeRef
  /** Link to the object's page. */
  href?: string
}

/** Resolved icon and colour slot of a type. */
export function typePresentation(type: ObjectTypeRef): { icon: IconName; color: TypeColor } {
  return {
    icon: type.icon ?? 'object',
    color: type.color ?? typeColorFor(type.id ?? type.label),
  }
}

/** True for a value shaped like an `ObjectRef` (an id and a title). */
export function isObjectRef(value: unknown): value is ObjectRef {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const candidate = value as Partial<ObjectRef>
  return typeof candidate.id === 'string' && typeof candidate.title === 'string'
}
