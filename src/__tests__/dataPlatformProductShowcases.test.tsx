import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  DATABRICKS_SAMPLE_CATALOG,
  DATABRICKS_SAMPLE_JOBS,
  DatabricksShowcase,
  databricksJobSummary,
  selectDatabricksCatalogAssets,
  selectDatabricksJobs,
  type DatabricksJob,
} from '../../examples/clones/databricks/DatabricksShowcase'
import {
  SNOWFLAKE_SAMPLE_CATALOG,
  SNOWFLAKE_SAMPLE_QUERIES,
  SnowflakeShowcase,
  selectSnowflakeCatalogObjects,
  snowflakeQuerySummary,
  type SnowflakeCatalogObject,
} from '../../examples/clones/snowflake/SnowflakeShowcase'

describe('SnowflakeShowcase', () => {
  it('filters governed catalog objects and summarizes query activity', () => {
    expect(
      selectSnowflakeCatalogObjects(SNOWFLAKE_SAMPLE_CATALOG, 'media')
        .map(object => object.id),
    ).toEqual(['raw.files.field_media'])
    expect(
      selectSnowflakeCatalogObjects(SNOWFLAKE_SAMPLE_CATALOG, '', 'Dynamic table')
        .map(object => object.id),
    ).toEqual(['analytics.gold.customer_360'])
    expect(snowflakeQuerySummary(SNOWFLAKE_SAMPLE_QUERIES)).toEqual({
      total: 6,
      succeeded: 3,
      running: 1,
      failed: 1,
      averageDurationMs: 6372,
    })
  })

  it('server-renders Workspaces, Horizon Catalog, and query monitoring anatomy', () => {
    const workspace = renderToStaticMarkup(<SnowflakeShowcase />)
    const catalog = renderToStaticMarkup(<SnowflakeShowcase initialSection="catalog" />)
    const monitoring = renderToStaticMarkup(<SnowflakeShowcase initialSection="monitoring" />)

    expect(workspace).toContain('Revenue intelligence')
    expect(workspace).toContain('customer_health.sql')
    expect(workspace).toContain('ANALYTICS_WH')
    expect(workspace).toContain('Explain or improve')
    expect(catalog).toContain('Horizon Catalog')
    expect(catalog).toContain('CUSTOMER_360')
    expect(catalog).toContain('Open in workspace')
    expect(monitoring).toContain('Query History')
    expect(monitoring).toContain('COPY INTO RAW.FILES.FIELD_MEDIA')
  })

  it('accepts host-provided catalog records without leaking sample assets', () => {
    const object: SnowflakeCatalogObject = {
      id: 'host.ops.orders',
      name: 'ORDERS',
      kind: 'Table',
      database: 'HOST',
      schema: 'OPS',
      owner: 'HOST_OWNER',
      rows: 42,
      size: '12 KB',
      status: 'Fresh',
      description: 'A host-provided order table.',
      columns: ['ORDER_ID'],
      tags: ['HOST'],
      updatedAt: 'Now',
    }
    const html = renderToStaticMarkup(
      <SnowflakeShowcase
        catalogObjects={[object]}
        initialCatalogObjectId={object.id}
        initialSection="catalog"
      />,
    )

    expect(html).toContain('A host-provided order table.')
    expect(html).toContain('HOST.OPS.ORDERS')
    expect(html).not.toContain('CUSTOMER_360')
  })
})

describe('DatabricksShowcase', () => {
  it('filters jobs and Unity Catalog assets and summarizes Lakeflow health', () => {
    expect(
      selectDatabricksJobs(DATABRICKS_SAMPLE_JOBS, 'forecast')
        .map(job => job.id),
    ).toEqual(['revenue-forecast'])
    expect(
      selectDatabricksCatalogAssets(DATABRICKS_SAMPLE_CATALOG, '', 'Volume')
        .map(asset => asset.id),
    ).toEqual(['main.media.field_assets'])
    expect(databricksJobSummary(DATABRICKS_SAMPLE_JOBS)).toEqual({
      total: 4,
      healthy: 2,
      running: 1,
      failed: 1,
      averageDurationSeconds: 129,
    })
  })

  it('server-renders notebooks, SQL, Lakeflow Jobs, and Unity Catalog anatomy', () => {
    const notebook = renderToStaticMarkup(<DatabricksShowcase />)
    const sql = renderToStaticMarkup(<DatabricksShowcase initialSection="sql" />)
    const jobs = renderToStaticMarkup(<DatabricksShowcase initialSection="jobs" />)
    const catalog = renderToStaticMarkup(<DatabricksShowcase initialSection="catalog" />)

    expect(notebook).toContain('Customer health intelligence')
    expect(notebook).toContain('Serverless')
    expect(notebook).toContain('Add data quality checks')
    expect(sql).toContain('Account health review')
    expect(sql).toContain('Serverless Starter Warehouse')
    expect(sql).toContain('Ask Assistant')
    expect(jobs).toContain('Jobs &amp; Pipelines')
    expect(jobs).toContain('Customer health refresh')
    expect(jobs).toContain('Task graph')
    expect(catalog).toContain('Unity Catalog')
    expect(catalog).toContain('Catalog Explorer')
    expect(catalog).toContain('customer_360')
  })

  it('accepts host-provided Lakeflow jobs without leaking sample jobs', () => {
    const job: DatabricksJob = {
      id: 'host-job',
      name: 'Host governed refresh',
      owner: 'Host Data',
      trigger: 'On demand',
      status: 'Succeeded',
      durationSeconds: 12,
      lastRun: 'Now',
      tasks: [
        {
          id: 'host-task',
          name: 'Publish host records',
          type: 'Notebook',
          status: 'Succeeded',
          duration: '12s',
        },
      ],
    }
    const html = renderToStaticMarkup(
      <DatabricksShowcase
        initialJobId={job.id}
        initialSection="jobs"
        jobs={[job]}
      />,
    )

    expect(html).toContain('Host governed refresh')
    expect(html).toContain('Publish host records')
    expect(html).not.toContain('Customer health refresh')
  })
})
