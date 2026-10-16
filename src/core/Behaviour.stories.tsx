import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Input, Select, TextArea } from '../components'
import type { Template } from '../types/template'
import { MultiDashboard } from './MultiDashboard'

export default { title: 'Core/Behaviour', parameters: { layout: 'fullscreen' } } satisfies Meta

const template: Template = {
  title: 'Keyboard workspace',
  widgets: [
    { id: 'rows', component: 'table', span: 8, title: 'Rows', source: { inline: [
      { Name: 'First', Amount: 1 }, { Name: 'Second', Amount: 2 }, { Name: 'Third', Amount: 3 },
    ] } },
    { id: 'summary', component: 'metric', span: 4, title: 'Summary', source: { inline: { value: 3 } } },
  ],
}

export const KeyboardOwnership: StoryObj = {
  render: () => {
    const [active, setActive] = useState(0)
    return (
      <>
        <div className="grid gap-3 p-4">
          <Input aria-label="Draft name" defaultValue="A draft" />
          <TextArea aria-label="Draft notes" defaultValue="Draft notes" />
          <Select aria-label="Draft choice" defaultValue="first"><option value="first">First</option><option value="second">Second</option></Select>
          <div contentEditable role="textbox" aria-label="Draft editor" suppressContentEditableWarning>A draft</div>
        </div>
        <MultiDashboard tabs={[{ label: 'First workspace', template }, { label: 'Second workspace', template: { ...template, title: 'Second workspace' } }]} activeIndex={active} onSelect={setActive} />
      </>
    )
  },
}
