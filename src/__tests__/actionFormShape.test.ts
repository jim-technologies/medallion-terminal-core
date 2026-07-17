import { describe, expect, it } from 'vitest'
import {
  actionParams,
  initialActionValues,
  normalizeActionForm,
  validateActionValues,
} from '../widgets/actionFormShape'

describe('action form schema', () => {
  it('normalizes fields and lets template options override sourced defaults', () => {
    const form = normalizeActionForm(
      {
        action_id: 'fallback',
        fields: [{ key: 'side', type: 'select', choices: ['buy', 'sell'] }],
        params: { origin: 'source' },
      },
      {
        action_id: 'place_order',
        submit_label: 'Place',
        confirm: true,
        params: { desk: 'west' },
      },
    )
    expect(form).toMatchObject({
      actionId: 'place_order',
      submitLabel: 'Place',
      confirm: true,
      params: { origin: 'source', desk: 'west' },
      fields: [{
        key: 'side',
        label: 'Side',
        type: 'select',
        choices: [
          { value: 'buy', label: 'buy' },
          { value: 'sell', label: 'sell' },
        ],
      }],
    })
  })

  it('prefills from explicit values, context, defaults, and type fallbacks in order', () => {
    const form = normalizeActionForm(null, {
      action_id: 'x',
      values: { symbol: 'ETH-USD' },
      fields: [
        { key: 'symbol', context_key: 'symbol', default_value: 'SOL-USD' },
        { key: 'price', type: 'number', context_key: 'price' },
        { key: 'confirmed', type: 'boolean' },
        { key: 'tags', type: 'multi_select' },
      ],
    })!
    expect(initialActionValues(form, { symbol: 'BTC-USD', price: '42.5' })).toEqual({
      symbol: 'ETH-USD',
      price: 42.5,
      confirmed: false,
      tags: [],
    })
  })

  it('validates required, numeric bounds, and safe URLs', () => {
    const form = normalizeActionForm(null, {
      action_id: 'x',
      fields: [
        { key: 'name', required: true },
        { key: 'quantity', type: 'number', min: 1, max: 10 },
        { key: 'callback', type: 'url' },
      ],
    })!
    expect(validateActionValues(form.fields, {
      name: '',
      quantity: 11,
      callback: 'javascript:alert(1)',
    })).toEqual({
      name: 'Required',
      quantity: 'Maximum 10',
      callback: 'Enter an http(s) or relative URL',
    })
  })

  it('merges static parameters with submitted field values', () => {
    const form = normalizeActionForm(null, {
      action_id: 'x',
      params: { source: 'terminal', side: 'buy' },
      fields: [{ key: 'side' }, { key: 'quantity', type: 'number' }],
    })!
    expect(actionParams(form, { side: 'sell', quantity: 3 })).toEqual({
      source: 'terminal',
      side: 'sell',
      quantity: 3,
    })
  })
})
