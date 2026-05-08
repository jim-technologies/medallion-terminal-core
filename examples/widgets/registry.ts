// Domain-pack registry — call this once at app startup.
//
// Pattern for shipping custom widgets without forking the framework:
//
//   // your-app/src/main.tsx
//   import { Dashboard } from 'medallion-terminal-core'
//   import './path-to-this-file/registry'   // side-effect: registers
//
// Each widget then becomes available to any template via its
// `component` name, with the same DataSource + ctx + options
// plumbing as a built-in widget.

import { registerWidget } from '../../src/core/WidgetRegistry'
import { Kelly } from './Kelly'

registerWidget('kelly', Kelly)
