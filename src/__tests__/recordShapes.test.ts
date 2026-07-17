import { describe, expect, it } from 'vitest'
import {
  applyRecordView,
  changedRecordValues,
  findRecordView,
  initialRecordValues,
  isRecordFieldEditable,
  normalizeRecordSet,
  recordChoiceColor,
  recordMatchesFilter,
  recordDateKey,
  recordTitle,
  recordValueLabel,
} from '../widgets/recordShapes'

const PAYLOAD = {
  workspace_id: 'ops',
  table_id: 'work_items',
  table_name: 'Work items',
  primary_field: 'name',
  fields: [
    { key: 'name', label: 'Name', type: 'RECORD_FIELD_TYPE_TEXT', required: true },
    {
      key: 'stage',
      label: 'Stage',
      type: 9,
      choices: [
        { value: 'active', label: 'Active', color: 'blue' },
        { value: 'done', label: 'Done', color: 'green' },
      ],
    },
    { key: 'value', label: 'Value', type: 'RECORD_FIELD_TYPE_CURRENCY' },
    { key: 'customer', label: 'Customer', type: 'RECORD_FIELD_TYPE_LINK', linked_table_id: 'customers' },
    { key: 'margin', label: 'Margin', type: 'RECORD_FIELD_TYPE_FORMULA' },
  ],
  records: [
    {
      id: 'work-1',
      revision: '4',
      values: {
        name: 'Northstar rollout',
        stage: 'active',
        value: 42000,
        customer: { id: 'customer-7', label: 'Northstar' },
        margin: 0.31,
      },
      context: { customer_id: 'customer-7' },
    },
    {
      id: 'work-2',
      revision: '2',
      values: {
        name: 'Harbor renewal',
        stage: 'done',
        value: 18000,
        customer: { id: 'customer-3', label: 'Harbor' },
        margin: 0.24,
      },
    },
    {
      id: 'work-3',
      values: {
        name: 'Beacon discovery',
        stage: 'active',
        value: 12500,
        customer: null,
        margin: 0.19,
      },
    },
  ],
  views: [
    {
      id: 'active_value',
      name: 'Active by value',
      type: 'RECORD_VIEW_TYPE_GRID',
      visible_fields: ['name', 'customer', 'stage', 'value'],
      filters: [{ field: 'stage', operator: 'eq', value: 'active' }],
      sorts: [{ field: 'value', descending: true }],
    },
    {
      id: 'delivery',
      name: 'Delivery',
      type: 'RECORD_VIEW_TYPE_BOARD',
      group_by: 'stage',
    },
  ],
  active_view_id: 'active_value',
  total: '3',
  next_page_token: 'next-3',
  capabilities: {
    create: true,
    update: true,
    delete: false,
    create_action_id: 'work_create',
    update_action_id: 'work_update',
  },
}

describe('record-set normalization', () => {
  it('accepts proto snake_case, enum names, and numeric enum values', () => {
    const set = normalizeRecordSet(PAYLOAD)
    expect(set).not.toBeNull()
    expect(set).toMatchObject({
      workspaceId: 'ops',
      tableId: 'work_items',
      tableName: 'Work items',
      primaryField: 'name',
      activeViewId: 'active_value',
      total: 3,
      nextPageToken: 'next-3',
      capabilities: {
        create: true,
        update: true,
        delete: false,
        createActionId: 'work_create',
        updateActionId: 'work_update',
        deleteActionId: 'record_delete',
      },
    })
    expect(set?.fields.find(field => field.key === 'stage')?.type).toBe('single_select')
    expect(set?.fields.find(field => field.key === 'customer')?.linkedTableId).toBe('customers')
    expect(set?.records[0]).toMatchObject({
      id: 'work-1',
      revision: '4',
      context: { customer_id: 'customer-7' },
    })
  })

  it('forces computed fields read-only and keeps ordinary fields editable', () => {
    const set = normalizeRecordSet(PAYLOAD)!
    expect(isRecordFieldEditable(set.fields.find(field => field.key === 'margin')!)).toBe(false)
    expect(isRecordFieldEditable(set.fields.find(field => field.key === 'name')!)).toBe(true)
  })

  it('derives a useful schema for convenient row-shaped input', () => {
    const set = normalizeRecordSet({
      table_id: 'simple',
      rows: [
        { id: 'a', name: 'Alpha', amount: 12, active: true, tags: ['new'] },
      ],
    })!
    expect(set.fields.map(field => [field.key, field.type])).toEqual([
      ['name', 'text'],
      ['amount', 'number'],
      ['active', 'boolean'],
      ['tags', 'multi_select'],
    ])
    expect(set.primaryField).toBe('name')
  })
})

describe('record saved views and display helpers', () => {
  it('applies portable filters and stable multi-field sorting', () => {
    const set = normalizeRecordSet(PAYLOAD)!
    const view = findRecordView(set, 'grid', 'active_value')!
    expect(applyRecordView(set.records, view).map(record => record.id)).toEqual([
      'work-1',
      'work-3',
    ])
  })

  it('supports common filter operators for scalars, links, and lists', () => {
    const record = normalizeRecordSet(PAYLOAD)!.records[0]
    expect(recordMatchesFilter(record, { field: 'value', operator: 'gte', value: 40000 })).toBe(true)
    expect(recordMatchesFilter(record, { field: 'customer', operator: 'eq', value: 'customer-7' })).toBe(true)
    expect(recordMatchesFilter(record, { field: 'customer', operator: 'not_empty', value: null })).toBe(true)
    expect(recordMatchesFilter(
      { ...record, values: { ...record.values, tags: ['priority', 'renewal'] } },
      { field: 'tags', operator: 'contains', value: 'priority' },
    )).toBe(true)
  })

  it('renders linked values and primary titles without leaking storage shape', () => {
    const set = normalizeRecordSet(PAYLOAD)!
    expect(recordTitle(set, set.records[0])).toBe('Northstar rollout')
    expect(recordValueLabel(set.records[0].values.customer)).toBe('Northstar')
    expect(recordValueLabel([{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }])).toBe('A, B')
  })

  it('resolves select colors from scalar and object-shaped values', () => {
    const stage = normalizeRecordSet(PAYLOAD)!.fields.find(field => field.key === 'stage')
    expect(recordChoiceColor(stage, 'done')).toBe('green')
    expect(recordChoiceColor(stage, { value: 'active', label: 'Active' })).toBe('blue')
    expect(recordChoiceColor(stage, 'missing')).toBeUndefined()
  })
})

describe('record form value projection', () => {
  const set = normalizeRecordSet({
    table_id: 'sparse',
    fields: [
      { key: 'name', type: 'RECORD_FIELD_TYPE_TEXT', required: true },
      { key: 'stage', type: 'RECORD_FIELD_TYPE_SINGLE_SELECT', default_value: 'planned' },
      { key: 'note', type: 'RECORD_FIELD_TYPE_LONG_TEXT', default_value: 'starter' },
    ],
    records: [{
      id: 'sparse-1',
      values: { name: 'Sparse record', note: null },
    }],
  })!

  it('applies defaults only for create mode', () => {
    expect(initialRecordValues(set.fields)).toEqual({
      name: null,
      stage: 'planned',
      note: 'starter',
    })
  })

  it('preserves absent and explicitly-null values while editing', () => {
    const values = initialRecordValues(set.fields, set.records[0])
    expect(values).toEqual({
      name: 'Sparse record',
      stage: undefined,
      note: null,
    })
    expect(changedRecordValues(set.fields, values, set.records[0])).toEqual({})
  })

  it('submits only fields the editor actually changed', () => {
    const values = {
      ...initialRecordValues(set.fields, set.records[0]),
      stage: 'planned',
    }
    expect(changedRecordValues(set.fields, values, set.records[0])).toEqual({
      stage: 'planned',
    })
  })
})

describe('record calendar dates', () => {
  it('keys generated calendar cells and preserves date-only values', () => {
    expect(recordDateKey(new Date(2026, 6, 18, 12, 0, 0))).toBe('2026-07-18')
    expect(recordDateKey('2026-07-18')).toBe('2026-07-18')
    expect(recordDateKey('not-a-date')).toBeNull()
  })
})
