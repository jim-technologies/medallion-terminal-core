import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CLONE_DEMO_IDENTITY } from '../../examples/clones/demoIdentity'
import {
  AIRTABLE_SAMPLE_PROJECTS,
  AirtableShowcase,
  selectAirtableProjects,
  type AirtableProjectRecord,
} from '../../examples/clones/sme-suite/AirtableShowcase'
import {
  HUBSPOT_SAMPLE_CONTACTS,
  HUBSPOT_SAMPLE_DEALS,
  HubSpotShowcase,
  hubSpotWeightedPipeline,
  selectHubSpotContacts,
  type HubSpotContact,
} from '../../examples/clones/sme-suite/HubSpotShowcase'
import {
  QUICKBOOKS_SAMPLE_CASH_FLOW,
  QUICKBOOKS_SAMPLE_TRANSACTIONS,
  QuickBooksShowcase,
  quickBooksCashBalance,
  selectQuickBooksTransactions,
} from '../../examples/clones/sme-suite/QuickBooksShowcase'
import {
  formatSmeCurrency,
  formatSmePercent,
  smeCloneInitials,
} from '../../examples/clones/sme-suite/SmeClonePrimitives'

describe('SME clone showcase primitives', () => {
  it('formats presentation values without product-specific data helpers', () => {
    expect(smeCloneInitials(CLONE_DEMO_IDENTITY.company)).toBe('JT')
    expect(formatSmeCurrency(86_400)).toBe('$86,400')
    expect(formatSmeCurrency(174_620, { compact: true })).toBe('$174.6K')
    expect(formatSmePercent(0.725, 1)).toBe('72.5%')
  })
})

describe('AirtableShowcase', () => {
  it('filters neutral project records by status and searchable fields', () => {
    expect(
      selectAirtableProjects(AIRTABLE_SAMPLE_PROJECTS, '', 'Blocked').map(record => record.id),
    ).toEqual(['partner-kit'])
    expect(
      selectAirtableProjects(AIRTABLE_SAMPLE_PROJECTS, 'customer').map(record => record.id),
    ).toEqual(['customer-preview'])
  })

  it('server-renders grid, board, and record-review anatomy', () => {
    const grid = renderToStaticMarkup(<AirtableShowcase />)
    const board = renderToStaticMarkup(<AirtableShowcase initialView="board" />)
    const review = renderToStaticMarkup(
      <AirtableShowcase initialView="record" initialSelectedId="launch-brief" />,
    )

    expect(grid).toContain('All launch work')
    expect(grid).toContain('Finalize launch brief')
    expect(grid).toContain('Add record')
    expect(board).toContain('Work by status')
    expect(board).toContain('Total budget')
    expect(review).toContain('Project details')
    expect(review).toContain('Comments')
    expect(review).toContain('View revision history')
  })

  it('accepts host-provided records', () => {
    const record: AirtableProjectRecord = {
      id: 'customer-onboarding',
      name: 'Customer onboarding',
      status: 'In progress',
      owner: 'Taylor Lane',
      ownerColor: '#335f86',
      priority: 'High',
      dueDate: 'Aug 4',
      budget: 12_000,
      progress: 0.5,
      workstream: 'Customer',
      summary: 'Configure the customer workspace and complete training.',
      lastModified: 'Now',
    }
    const html = renderToStaticMarkup(<AirtableShowcase records={[record]} />)

    expect(html).toContain('Customer onboarding')
    expect(html).not.toContain('Finalize launch brief')
  })
})

describe('HubSpotShowcase', () => {
  it('filters contacts and computes weighted pipeline value', () => {
    expect(
      selectHubSpotContacts(HUBSPOT_SAMPLE_CONTACTS, '', 'Qualified').map(contact => contact.id),
    ).toEqual(['amelia-stone', 'sarah-kim'])
    expect(
      selectHubSpotContacts(HUBSPOT_SAMPLE_CONTACTS, 'logistics').map(contact => contact.id),
    ).toEqual(['nina-patel'])
    expect(hubSpotWeightedPipeline(HUBSPOT_SAMPLE_DEALS)).toBe(279_660)
  })

  it('server-renders contact, customer-record, and pipeline anatomy', () => {
    const contacts = renderToStaticMarkup(<HubSpotShowcase />)
    const record = renderToStaticMarkup(
      <HubSpotShowcase initialSection="record" initialSelectedContactId="amelia-stone" />,
    )
    const pipeline = renderToStaticMarkup(<HubSpotShowcase initialSection="pipeline" />)

    expect(contacts).toContain('Create contact')
    expect(contacts).toContain('Northwind Health')
    expect(record).toContain('About this contact')
    expect(record).toContain('Breeze summary')
    expect(record).toContain('Operating brief.pdf')
    expect(pipeline).toContain('Sales pipeline')
    expect(pipeline).toContain('Contract sent')
  })

  it('accepts host-provided contacts', () => {
    const contact: HubSpotContact = {
      id: 'customer-contact',
      name: 'Taylor Lane',
      email: 'taylor@example.test',
      company: 'Example Manufacturing',
      role: 'Operations Director',
      owner: 'Jordan Lee',
      ownerColor: '#335f86',
      status: 'Open',
      lastActivity: 'Now',
      lifecycle: 'Opportunity',
      city: 'Reno, NV',
      phone: '+1 775 555 0100',
      annualRevenue: 5_000_000,
    }
    const html = renderToStaticMarkup(<HubSpotShowcase contacts={[contact]} deals={[]} />)

    expect(html).toContain('Example Manufacturing')
    expect(html).not.toContain('Northwind Health')
  })
})

describe('QuickBooksShowcase', () => {
  it('filters bank activity and derives the latest cash balance', () => {
    expect(
      selectQuickBooksTransactions(QUICKBOOKS_SAMPLE_TRANSACTIONS, 'For review')
        .map(transaction => transaction.id),
    ).toEqual(['txn-1', 'txn-2', 'txn-3', 'txn-4'])
    expect(
      selectQuickBooksTransactions(QUICKBOOKS_SAMPLE_TRANSACTIONS, 'For review', 'invoice')
        .map(transaction => transaction.id),
    ).toEqual(['txn-2'])
    expect(quickBooksCashBalance(QUICKBOOKS_SAMPLE_CASH_FLOW)).toBe(174_620)
  })

  it('server-renders business health, forecast, and transaction-review anatomy', () => {
    const overview = renderToStaticMarkup(<QuickBooksShowcase />)
    const cashFlow = renderToStaticMarkup(<QuickBooksShowcase initialSection="cash-flow" />)
    const transactions = renderToStaticMarkup(
      <QuickBooksShowcase initialSection="transactions" />,
    )

    expect(overview).toContain('Good morning, Jordan')
    expect(overview).toContain('Profit and loss')
    expect(overview).toContain('Open invoices')
    expect(cashFlow).toContain('Cash balance forecast')
    expect(cashFlow).toContain('Projected in 90 days')
    expect(transactions).toContain('Bank transactions')
    expect(transactions).toContain('Suggested')
    expect(transactions).toContain('Match invoice 1048')
  })
})
