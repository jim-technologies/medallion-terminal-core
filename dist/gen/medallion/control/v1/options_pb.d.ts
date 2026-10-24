import type { GenEnum, GenExtension, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { FieldOptions as FieldOptions$1, MessageOptions, MethodOptions } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file medallion/control/v1/options.proto.
 */
export declare const file_medallion_control_v1_options: GenFile;
/**
 * Declares a message as the spec (or view) of a control-plane kind.
 *
 * @generated from message medallion.control.v1.KindOptions
 */
export type KindOptions = Message<"medallion.control.v1.KindOptions"> & {
    /**
     * API group, e.g. "os.example".
     *
     * @generated from field: string group = 1;
     */
    group: string;
    /**
     * Version segment, e.g. "v1".
     *
     * @generated from field: string version = 2;
     */
    version: string;
    /**
     * Kind name, e.g. "Feed".
     *
     * @generated from field: string kind = 3;
     */
    kind: string;
    /**
     * Plural used in references and lists, e.g. "feeds".
     *
     * @generated from field: string plural = 4;
     */
    plural: string;
    /**
     * Fully-qualified typed status message carried in Status.detail.
     *
     * @generated from field: string status_type = 5;
     */
    statusType: string;
    /**
     * Workspace or platform scope.
     *
     * @generated from field: medallion.control.v1.Scope scope = 6;
     */
    scope: Scope;
    /**
     * Who owns desired state.
     *
     * @generated from field: medallion.control.v1.SpecSource spec_source = 7;
     */
    specSource: SpecSource;
    /**
     * What controllers may do on drift.
     *
     * @generated from field: medallion.control.v1.ReconcilePolicy reconcile = 8;
     */
    reconcile: ReconcilePolicy;
    /**
     * Placement in the panel tree; `{field}` reads a spec field, e.g.
     * "Platform/Data/Feeds/{domain}/{name}". Paths are placement, never
     * identity: ResourceRef is identity.
     *
     * @generated from field: string tree_path = 9;
     */
    treePath: string;
    /**
     * Shared traits the host renders generically.
     *
     * @generated from field: repeated medallion.control.v1.Trait traits = 10;
     */
    traits: Trait[];
    /**
     * Host glyph name.
     *
     * @generated from field: string icon = 11;
     */
    icon: string;
    /**
     * Workflow id template of the existing workflow runs this kind owns, e.g.
     * "pull:{name}"; empty when the kind has no runs.
     *
     * @generated from field: string run_workflow_id = 12;
     */
    runWorkflowId: string;
    /**
     * Fully-qualified spec message when it is a shared control message (for
     * example medallion.control.v1.OperationSpec); empty means the message
     * carrying this option is the spec.
     *
     * @generated from field: string spec_type = 13;
     */
    specType: string;
};
/**
 * Declares a message as the spec (or view) of a control-plane kind.
 *
 * @generated from message medallion.control.v1.KindOptions
 */
export type KindOptionsJson = {
    /**
     * API group, e.g. "os.example".
     *
     * @generated from field: string group = 1;
     */
    group?: string;
    /**
     * Version segment, e.g. "v1".
     *
     * @generated from field: string version = 2;
     */
    version?: string;
    /**
     * Kind name, e.g. "Feed".
     *
     * @generated from field: string kind = 3;
     */
    kind?: string;
    /**
     * Plural used in references and lists, e.g. "feeds".
     *
     * @generated from field: string plural = 4;
     */
    plural?: string;
    /**
     * Fully-qualified typed status message carried in Status.detail.
     *
     * @generated from field: string status_type = 5;
     */
    statusType?: string;
    /**
     * Workspace or platform scope.
     *
     * @generated from field: medallion.control.v1.Scope scope = 6;
     */
    scope?: ScopeJson;
    /**
     * Who owns desired state.
     *
     * @generated from field: medallion.control.v1.SpecSource spec_source = 7;
     */
    specSource?: SpecSourceJson;
    /**
     * What controllers may do on drift.
     *
     * @generated from field: medallion.control.v1.ReconcilePolicy reconcile = 8;
     */
    reconcile?: ReconcilePolicyJson;
    /**
     * Placement in the panel tree; `{field}` reads a spec field, e.g.
     * "Platform/Data/Feeds/{domain}/{name}". Paths are placement, never
     * identity: ResourceRef is identity.
     *
     * @generated from field: string tree_path = 9;
     */
    treePath?: string;
    /**
     * Shared traits the host renders generically.
     *
     * @generated from field: repeated medallion.control.v1.Trait traits = 10;
     */
    traits?: TraitJson[];
    /**
     * Host glyph name.
     *
     * @generated from field: string icon = 11;
     */
    icon?: string;
    /**
     * Workflow id template of the existing workflow runs this kind owns, e.g.
     * "pull:{name}"; empty when the kind has no runs.
     *
     * @generated from field: string run_workflow_id = 12;
     */
    runWorkflowId?: string;
    /**
     * Fully-qualified spec message when it is a shared control message (for
     * example medallion.control.v1.OperationSpec); empty means the message
     * carrying this option is the spec.
     *
     * @generated from field: string spec_type = 13;
     */
    specType?: string;
};
/**
 * Describes the message medallion.control.v1.KindOptions.
 * Use `create(KindOptionsSchema)` to create a new message.
 */
export declare const KindOptionsSchema: GenMessage<KindOptions, {
    jsonType: KindOptionsJson;
}>;
/**
 * A UTC window during which an operation must not apply.
 *
 * @generated from message medallion.control.v1.Window
 */
export type Window = Message<"medallion.control.v1.Window"> & {
    /**
     * Inclusive start, "HH:MM" UTC.
     *
     * @generated from field: string start_utc = 1;
     */
    startUtc: string;
    /**
     * Exclusive end, "HH:MM" UTC; earlier than start wraps past midnight.
     *
     * @generated from field: string end_utc = 2;
     */
    endUtc: string;
    /**
     * Why, shown in the plan, e.g. "nightly flush".
     *
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * A UTC window during which an operation must not apply.
 *
 * @generated from message medallion.control.v1.Window
 */
export type WindowJson = {
    /**
     * Inclusive start, "HH:MM" UTC.
     *
     * @generated from field: string start_utc = 1;
     */
    startUtc?: string;
    /**
     * Exclusive end, "HH:MM" UTC; earlier than start wraps past midnight.
     *
     * @generated from field: string end_utc = 2;
     */
    endUtc?: string;
    /**
     * Why, shown in the plan, e.g. "nightly flush".
     *
     * @generated from field: string reason = 3;
     */
    reason?: string;
};
/**
 * Describes the message medallion.control.v1.Window.
 * Use `create(WindowSchema)` to create a new message.
 */
export declare const WindowSchema: GenMessage<Window, {
    jsonType: WindowJson;
}>;
/**
 * Declares an RPC as a control-plane operation type.
 *
 * @generated from message medallion.control.v1.OperationOptions
 */
export type OperationOptions = Message<"medallion.control.v1.OperationOptions"> & {
    /**
     * Target kind as "<group>/<version>/<Kind>", e.g. "os.example/v1/Namespace".
     *
     * @generated from field: string target_kind = 1;
     */
    targetKind: string;
    /**
     * Request field filled from the target object's name; empty for none.
     *
     * @generated from field: string target_field = 2;
     */
    targetField: string;
    /**
     * Short imperative label, e.g. "Maintain".
     *
     * @generated from field: string label = 3;
     */
    label: string;
    /**
     * Risk class.
     *
     * @generated from field: medallion.control.v1.Risk risk = 4;
     */
    risk: Risk;
    /**
     * Request field that selects plan-only behavior; a control-managed bool.
     *
     * @generated from field: string dry_run_field = 5;
     */
    dryRunField: string;
    /**
     * How that field reads.
     *
     * @generated from field: medallion.control.v1.DryRunPolarity dry_run_polarity = 6;
     */
    dryRunPolarity: DryRunPolarity;
    /**
     * Read-only plan RPC on the same service when the request has no dry-run
     * field.
     *
     * @generated from field: string plan_method = 7;
     */
    planMethod: string;
    /**
     * Confirmation rule.
     *
     * @generated from field: medallion.control.v1.Approval approval = 8;
     */
    approval: Approval;
    /**
     * Where apply runs.
     *
     * @generated from field: medallion.control.v1.Runner runner = 9;
     */
    runner: Runner;
    /**
     * CronJob whose pod template the apply Job clones.
     *
     * @generated from field: string job_template = 10;
     */
    jobTemplate: string;
    /**
     * Claim key serializing conflicting writers, e.g. "lake-writer".
     *
     * @generated from field: string concurrency_key = 11;
     */
    concurrencyKey: string;
    /**
     * Fully-qualified operations that must not run at the same time.
     *
     * @generated from field: repeated string excludes = 12;
     */
    excludes: string[];
    /**
     * Windows during which apply is refused.
     *
     * @generated from field: repeated medallion.control.v1.Window deny_windows = 13;
     */
    denyWindows: Window[];
    /**
     * Minutes an unapproved plan stays valid; zero means thirty.
     *
     * @generated from field: uint32 plan_ttl_minutes = 14;
     */
    planTtlMinutes: number;
    /**
     * Seconds before the apply step is considered hung.
     *
     * @generated from field: uint32 timeout_seconds = 15;
     */
    timeoutSeconds: number;
    /**
     * How a running apply can be stopped.
     *
     * @generated from field: medallion.control.v1.CancelMode cancel = 16;
     */
    cancel: CancelMode;
    /**
     * Whether hosts may request it. A declared operation that is not offered
     * is still listed with its reason and shown disabled.
     *
     * @generated from field: bool offered = 17;
     */
    offered: boolean;
    /**
     * Why it is not offered, or why it is RISK_NEVER; required for both.
     *
     * @generated from field: string not_offered_reason = 18;
     */
    notOfferedReason: string;
    /**
     * Exact workstation command for RUNNER_HOST_ONLY, shown instead of a
     * button.
     *
     * @generated from field: string host_command = 19;
     */
    hostCommand: string;
};
/**
 * Declares an RPC as a control-plane operation type.
 *
 * @generated from message medallion.control.v1.OperationOptions
 */
export type OperationOptionsJson = {
    /**
     * Target kind as "<group>/<version>/<Kind>", e.g. "os.example/v1/Namespace".
     *
     * @generated from field: string target_kind = 1;
     */
    targetKind?: string;
    /**
     * Request field filled from the target object's name; empty for none.
     *
     * @generated from field: string target_field = 2;
     */
    targetField?: string;
    /**
     * Short imperative label, e.g. "Maintain".
     *
     * @generated from field: string label = 3;
     */
    label?: string;
    /**
     * Risk class.
     *
     * @generated from field: medallion.control.v1.Risk risk = 4;
     */
    risk?: RiskJson;
    /**
     * Request field that selects plan-only behavior; a control-managed bool.
     *
     * @generated from field: string dry_run_field = 5;
     */
    dryRunField?: string;
    /**
     * How that field reads.
     *
     * @generated from field: medallion.control.v1.DryRunPolarity dry_run_polarity = 6;
     */
    dryRunPolarity?: DryRunPolarityJson;
    /**
     * Read-only plan RPC on the same service when the request has no dry-run
     * field.
     *
     * @generated from field: string plan_method = 7;
     */
    planMethod?: string;
    /**
     * Confirmation rule.
     *
     * @generated from field: medallion.control.v1.Approval approval = 8;
     */
    approval?: ApprovalJson;
    /**
     * Where apply runs.
     *
     * @generated from field: medallion.control.v1.Runner runner = 9;
     */
    runner?: RunnerJson;
    /**
     * CronJob whose pod template the apply Job clones.
     *
     * @generated from field: string job_template = 10;
     */
    jobTemplate?: string;
    /**
     * Claim key serializing conflicting writers, e.g. "lake-writer".
     *
     * @generated from field: string concurrency_key = 11;
     */
    concurrencyKey?: string;
    /**
     * Fully-qualified operations that must not run at the same time.
     *
     * @generated from field: repeated string excludes = 12;
     */
    excludes?: string[];
    /**
     * Windows during which apply is refused.
     *
     * @generated from field: repeated medallion.control.v1.Window deny_windows = 13;
     */
    denyWindows?: WindowJson[];
    /**
     * Minutes an unapproved plan stays valid; zero means thirty.
     *
     * @generated from field: uint32 plan_ttl_minutes = 14;
     */
    planTtlMinutes?: number;
    /**
     * Seconds before the apply step is considered hung.
     *
     * @generated from field: uint32 timeout_seconds = 15;
     */
    timeoutSeconds?: number;
    /**
     * How a running apply can be stopped.
     *
     * @generated from field: medallion.control.v1.CancelMode cancel = 16;
     */
    cancel?: CancelModeJson;
    /**
     * Whether hosts may request it. A declared operation that is not offered
     * is still listed with its reason and shown disabled.
     *
     * @generated from field: bool offered = 17;
     */
    offered?: boolean;
    /**
     * Why it is not offered, or why it is RISK_NEVER; required for both.
     *
     * @generated from field: string not_offered_reason = 18;
     */
    notOfferedReason?: string;
    /**
     * Exact workstation command for RUNNER_HOST_ONLY, shown instead of a
     * button.
     *
     * @generated from field: string host_command = 19;
     */
    hostCommand?: string;
};
/**
 * Describes the message medallion.control.v1.OperationOptions.
 * Use `create(OperationOptionsSchema)` to create a new message.
 */
export declare const OperationOptionsSchema: GenMessage<OperationOptions, {
    jsonType: OperationOptionsJson;
}>;
/**
 * Per-field presentation and safety rules.
 *
 * @generated from message medallion.control.v1.FieldOptions
 */
export type FieldOptions = Message<"medallion.control.v1.FieldOptions"> & {
    /**
     * Never rendered, returned or offered; an operation touching it is refused.
     *
     * @generated from field: bool secret = 1;
     */
    secret: boolean;
    /**
     * Fixed after create.
     *
     * @generated from field: bool immutable = 2;
     */
    immutable: boolean;
    /**
     * Set by the control plane and hidden from forms: the dry-run field and
     * the target field.
     *
     * @generated from field: bool control_managed = 3;
     */
    controlManaged: boolean;
    /**
     * Kind the value names, as "<group>/<version>/<Kind>"; hosts render a link.
     *
     * @generated from field: string ref_kind = 4;
     */
    refKind: string;
    /**
     * Grid column header; empty keeps the field out of grids.
     *
     * @generated from field: string column = 5;
     */
    column: string;
    /**
     * How the value renders.
     *
     * @generated from field: medallion.control.v1.DisplayFormat format = 6;
     */
    format: DisplayFormat;
};
/**
 * Per-field presentation and safety rules.
 *
 * @generated from message medallion.control.v1.FieldOptions
 */
export type FieldOptionsJson = {
    /**
     * Never rendered, returned or offered; an operation touching it is refused.
     *
     * @generated from field: bool secret = 1;
     */
    secret?: boolean;
    /**
     * Fixed after create.
     *
     * @generated from field: bool immutable = 2;
     */
    immutable?: boolean;
    /**
     * Set by the control plane and hidden from forms: the dry-run field and
     * the target field.
     *
     * @generated from field: bool control_managed = 3;
     */
    controlManaged?: boolean;
    /**
     * Kind the value names, as "<group>/<version>/<Kind>"; hosts render a link.
     *
     * @generated from field: string ref_kind = 4;
     */
    refKind?: string;
    /**
     * Grid column header; empty keeps the field out of grids.
     *
     * @generated from field: string column = 5;
     */
    column?: string;
    /**
     * How the value renders.
     *
     * @generated from field: medallion.control.v1.DisplayFormat format = 6;
     */
    format?: DisplayFormatJson;
};
/**
 * Describes the message medallion.control.v1.FieldOptions.
 * Use `create(FieldOptionsSchema)` to create a new message.
 */
export declare const FieldOptionsSchema: GenMessage<FieldOptions, {
    jsonType: FieldOptionsJson;
}>;
/**
 * Who owns a kind's desired state.
 *
 * @generated from enum medallion.control.v1.SpecSource
 */
export declare enum SpecSource {
    /**
     * Unset; refused by the declaration check.
     *
     * @generated from enum value: SPEC_SOURCE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Desired state is written through ControlService.Apply.
     *
     * @generated from enum value: SPEC_SOURCE_CONTROL_PLANE = 1;
     */
    CONTROL_PLANE = 1,
    /**
     * Desired state lives in version control (configuration files, chart
     * values); the panel shows it read-only and links to its source path.
     *
     * @generated from enum value: SPEC_SOURCE_GIT = 2;
     */
    GIT = 2,
    /**
     * The kind is observation-only (a run, a Job); there is no spec.
     *
     * @generated from enum value: SPEC_SOURCE_NONE = 3;
     */
    NONE = 3
}
/**
 * Who owns a kind's desired state.
 *
 * @generated from enum medallion.control.v1.SpecSource
 */
export type SpecSourceJson = "SPEC_SOURCE_UNSPECIFIED" | "SPEC_SOURCE_CONTROL_PLANE" | "SPEC_SOURCE_GIT" | "SPEC_SOURCE_NONE";
/**
 * Describes the enum medallion.control.v1.SpecSource.
 */
export declare const SpecSourceSchema: GenEnum<SpecSource, SpecSourceJson>;
/**
 * What a controller may do when spec and status disagree.
 *
 * @generated from enum medallion.control.v1.ReconcilePolicy
 */
export declare enum ReconcilePolicy {
    /**
     * Unset; refused by the declaration check.
     *
     * @generated from enum value: RECONCILE_POLICY_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Status is observed; drift is reported as a condition, never acted on.
     *
     * @generated from enum value: RECONCILE_POLICY_OBSERVE = 1;
     */
    OBSERVE = 1,
    /**
     * The controller converges without approval; fail-safe directions only.
     *
     * @generated from enum value: RECONCILE_POLICY_AUTO = 2;
     */
    AUTO = 2,
    /**
     * The controller plans first, then waits for an approval bound to the plan
     * digest before it applies.
     *
     * @generated from enum value: RECONCILE_POLICY_PLAN_THEN_APPROVE = 3;
     */
    PLAN_THEN_APPROVE = 3
}
/**
 * What a controller may do when spec and status disagree.
 *
 * @generated from enum medallion.control.v1.ReconcilePolicy
 */
export type ReconcilePolicyJson = "RECONCILE_POLICY_UNSPECIFIED" | "RECONCILE_POLICY_OBSERVE" | "RECONCILE_POLICY_AUTO" | "RECONCILE_POLICY_PLAN_THEN_APPROVE";
/**
 * Describes the enum medallion.control.v1.ReconcilePolicy.
 */
export declare const ReconcilePolicySchema: GenEnum<ReconcilePolicy, ReconcilePolicyJson>;
/**
 * Where a kind's objects are visible.
 *
 * @generated from enum medallion.control.v1.Scope
 */
export declare enum Scope {
    /**
     * Unset; refused by the declaration check.
     *
     * @generated from enum value: SCOPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Objects belong to one workspace.
     *
     * @generated from enum value: SCOPE_WORKSPACE = 1;
     */
    WORKSPACE = 1,
    /**
     * Platform objects, visible only to platform operators.
     *
     * @generated from enum value: SCOPE_PLATFORM = 2;
     */
    PLATFORM = 2
}
/**
 * Where a kind's objects are visible.
 *
 * @generated from enum medallion.control.v1.Scope
 */
export type ScopeJson = "SCOPE_UNSPECIFIED" | "SCOPE_WORKSPACE" | "SCOPE_PLATFORM";
/**
 * Describes the enum medallion.control.v1.Scope.
 */
export declare const ScopeSchema: GenEnum<Scope, ScopeJson>;
/**
 * Behavior shared across kinds, rendered generically by hosts.
 *
 * @generated from enum medallion.control.v1.Trait
 */
export declare enum Trait {
    /**
     * Unset.
     *
     * @generated from enum value: TRAIT_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Offers a run-style operation.
     *
     * @generated from enum value: TRAIT_RUNNABLE = 1;
     */
    RUNNABLE = 1,
    /**
     * Has workflow runs below it (KindOptions.run_workflow_id).
     *
     * @generated from enum value: TRAIT_HAS_RUNS = 2;
     */
    HAS_RUNS = 2,
    /**
     * Status carries health conditions.
     *
     * @generated from enum value: TRAIT_HAS_HEALTH = 3;
     */
    HAS_HEALTH = 3,
    /**
     * Has upstream and downstream lineage links.
     *
     * @generated from enum value: TRAIT_HAS_LINEAGE = 4;
     */
    HAS_LINEAGE = 4,
    /**
     * A deployed workload with a release revision.
     *
     * @generated from enum value: TRAIT_DEPLOYABLE = 5;
     */
    DEPLOYABLE = 5,
    /**
     * Can be halted by a kill switch.
     *
     * @generated from enum value: TRAIT_KILLABLE = 6;
     */
    KILLABLE = 6
}
/**
 * Behavior shared across kinds, rendered generically by hosts.
 *
 * @generated from enum medallion.control.v1.Trait
 */
export type TraitJson = "TRAIT_UNSPECIFIED" | "TRAIT_RUNNABLE" | "TRAIT_HAS_RUNS" | "TRAIT_HAS_HEALTH" | "TRAIT_HAS_LINEAGE" | "TRAIT_DEPLOYABLE" | "TRAIT_KILLABLE";
/**
 * Describes the enum medallion.control.v1.Trait.
 */
export declare const TraitSchema: GenEnum<Trait, TraitJson>;
/**
 * How risky an operation is.
 *
 * @generated from enum medallion.control.v1.Risk
 */
export declare enum Risk {
    /**
     * Unset; refused by the declaration check.
     *
     * @generated from enum value: RISK_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * No side effects.
     *
     * @generated from enum value: RISK_READ = 1;
     */
    READ = 1,
    /**
     * Bounded, idempotent side effects; one confirmation.
     *
     * @generated from enum value: RISK_SAFE = 2;
     */
    SAFE = 2,
    /**
     * Plan first, then an approval bound to the plan digest, then apply.
     *
     * @generated from enum value: RISK_GATED = 3;
     */
    GATED = 3,
    /**
     * Never offered and never discovered (secret-bearing or host-only).
     *
     * @generated from enum value: RISK_NEVER = 4;
     */
    NEVER = 4
}
/**
 * How risky an operation is.
 *
 * @generated from enum medallion.control.v1.Risk
 */
export type RiskJson = "RISK_UNSPECIFIED" | "RISK_READ" | "RISK_SAFE" | "RISK_GATED" | "RISK_NEVER";
/**
 * Describes the enum medallion.control.v1.Risk.
 */
export declare const RiskSchema: GenEnum<Risk, RiskJson>;
/**
 * How the request field that selects plan-only behavior reads.
 *
 * @generated from enum medallion.control.v1.DryRunPolarity
 */
export declare enum DryRunPolarity {
    /**
     * Unset.
     *
     * @generated from enum value: DRY_RUN_POLARITY_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * `apply` or `execute` style: false, the default, is the read-only plan.
     *
     * @generated from enum value: DRY_RUN_POLARITY_WRITES_WHEN_TRUE = 1;
     */
    WRITES_WHEN_TRUE = 1,
    /**
     * `dry_run` style: true is the read-only plan, so the default keeps the
     * field's existing writing behavior for every caller that never sets it.
     *
     * @generated from enum value: DRY_RUN_POLARITY_PLANS_WHEN_TRUE = 2;
     */
    PLANS_WHEN_TRUE = 2
}
/**
 * How the request field that selects plan-only behavior reads.
 *
 * @generated from enum medallion.control.v1.DryRunPolarity
 */
export type DryRunPolarityJson = "DRY_RUN_POLARITY_UNSPECIFIED" | "DRY_RUN_POLARITY_WRITES_WHEN_TRUE" | "DRY_RUN_POLARITY_PLANS_WHEN_TRUE";
/**
 * Describes the enum medallion.control.v1.DryRunPolarity.
 */
export declare const DryRunPolaritySchema: GenEnum<DryRunPolarity, DryRunPolarityJson>;
/**
 * Who must confirm before an operation applies.
 *
 * @generated from enum medallion.control.v1.Approval
 */
export declare enum Approval {
    /**
     * Unset.
     *
     * @generated from enum value: APPROVAL_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * No confirmation (reads only).
     *
     * @generated from enum value: APPROVAL_NONE = 1;
     */
    NONE = 1,
    /**
     * The requester confirms once with a reason.
     *
     * @generated from enum value: APPROVAL_CONFIRM = 2;
     */
    CONFIRM = 2,
    /**
     * A human user, never a service account or an agent, approves the plan
     * digest.
     *
     * @generated from enum value: APPROVAL_HUMAN = 3;
     */
    HUMAN = 3,
    /**
     * A human user other than the requester approves the plan digest.
     *
     * @generated from enum value: APPROVAL_SECOND_HUMAN = 4;
     */
    SECOND_HUMAN = 4
}
/**
 * Who must confirm before an operation applies.
 *
 * @generated from enum medallion.control.v1.Approval
 */
export type ApprovalJson = "APPROVAL_UNSPECIFIED" | "APPROVAL_NONE" | "APPROVAL_CONFIRM" | "APPROVAL_HUMAN" | "APPROVAL_SECOND_HUMAN";
/**
 * Describes the enum medallion.control.v1.Approval.
 */
export declare const ApprovalSchema: GenEnum<Approval, ApprovalJson>;
/**
 * Where the apply step executes.
 *
 * @generated from enum medallion.control.v1.Runner
 */
export declare enum Runner {
    /**
     * Unset.
     *
     * @generated from enum value: RUNNER_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Inside the owner's controller process; light, bounded work only.
     *
     * @generated from enum value: RUNNER_IN_PROCESS = 1;
     */
    IN_PROCESS = 1,
    /**
     * A Kubernetes Job cloned from an allowlisted CronJob template.
     *
     * @generated from enum value: RUNNER_KUBERNETES_JOB = 2;
     */
    KUBERNETES_JOB = 2,
    /**
     * Workstation only; the panel shows state and the exact command.
     *
     * @generated from enum value: RUNNER_HOST_ONLY = 3;
     */
    HOST_ONLY = 3
}
/**
 * Where the apply step executes.
 *
 * @generated from enum medallion.control.v1.Runner
 */
export type RunnerJson = "RUNNER_UNSPECIFIED" | "RUNNER_IN_PROCESS" | "RUNNER_KUBERNETES_JOB" | "RUNNER_HOST_ONLY";
/**
 * Describes the enum medallion.control.v1.Runner.
 */
export declare const RunnerSchema: GenEnum<Runner, RunnerJson>;
/**
 * How a running operation can be stopped.
 *
 * @generated from enum medallion.control.v1.CancelMode
 */
export declare enum CancelMode {
    /**
     * Unset; treated as CANCEL_MODE_COOPERATIVE.
     *
     * @generated from enum value: CANCEL_MODE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Cannot be cancelled once applying.
     *
     * @generated from enum value: CANCEL_MODE_NONE = 1;
     */
    NONE = 1,
    /**
     * Stops at the next activity boundary.
     *
     * @generated from enum value: CANCEL_MODE_COOPERATIVE = 2;
     */
    COOPERATIVE = 2,
    /**
     * The apply Job may be deleted mid-activity.
     *
     * @generated from enum value: CANCEL_MODE_KILL_JOB = 3;
     */
    KILL_JOB = 3
}
/**
 * How a running operation can be stopped.
 *
 * @generated from enum medallion.control.v1.CancelMode
 */
export type CancelModeJson = "CANCEL_MODE_UNSPECIFIED" | "CANCEL_MODE_NONE" | "CANCEL_MODE_COOPERATIVE" | "CANCEL_MODE_KILL_JOB";
/**
 * Describes the enum medallion.control.v1.CancelMode.
 */
export declare const CancelModeSchema: GenEnum<CancelMode, CancelModeJson>;
/**
 * How a host renders a value.
 *
 * @generated from enum medallion.control.v1.DisplayFormat
 */
export declare enum DisplayFormat {
    /**
     * Plain text.
     *
     * @generated from enum value: DISPLAY_FORMAT_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * A timestamp rendered as its age, e.g. "3 h ago".
     *
     * @generated from enum value: DISPLAY_FORMAT_AGE = 1;
     */
    AGE = 1,
    /**
     * A duration, e.g. "4 m 12 s".
     *
     * @generated from enum value: DISPLAY_FORMAT_DURATION = 2;
     */
    DURATION = 2,
    /**
     * An integer count with grouping.
     *
     * @generated from enum value: DISPLAY_FORMAT_COUNT = 3;
     */
    COUNT = 3,
    /**
     * A byte size, e.g. "12.4 GiB".
     *
     * @generated from enum value: DISPLAY_FORMAT_BYTES = 4;
     */
    BYTES = 4,
    /**
     * A phase rendered as a status badge.
     *
     * @generated from enum value: DISPLAY_FORMAT_STATUS = 5;
     */
    STATUS = 5,
    /**
     * A UTC timestamp, e.g. "2026-10-16 05:33Z".
     *
     * @generated from enum value: DISPLAY_FORMAT_TIMESTAMP = 6;
     */
    TIMESTAMP = 6
}
/**
 * How a host renders a value.
 *
 * @generated from enum medallion.control.v1.DisplayFormat
 */
export type DisplayFormatJson = "DISPLAY_FORMAT_UNSPECIFIED" | "DISPLAY_FORMAT_AGE" | "DISPLAY_FORMAT_DURATION" | "DISPLAY_FORMAT_COUNT" | "DISPLAY_FORMAT_BYTES" | "DISPLAY_FORMAT_STATUS" | "DISPLAY_FORMAT_TIMESTAMP";
/**
 * Describes the enum medallion.control.v1.DisplayFormat.
 */
export declare const DisplayFormatSchema: GenEnum<DisplayFormat, DisplayFormatJson>;
/**
 * Kind declaration.
 *
 * @generated from extension: medallion.control.v1.KindOptions kind = 52100;
 */
export declare const kind: GenExtension<MessageOptions, KindOptions>;
/**
 * Operation declaration.
 *
 * @generated from extension: medallion.control.v1.OperationOptions operation = 52101;
 */
export declare const operation: GenExtension<MethodOptions, OperationOptions>;
/**
 * Field rules.
 *
 * @generated from extension: medallion.control.v1.FieldOptions field = 52102;
 */
export declare const field: GenExtension<FieldOptions$1, FieldOptions>;
