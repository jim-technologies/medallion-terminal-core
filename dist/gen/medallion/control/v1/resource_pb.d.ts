import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { Any, AnyJson, Timestamp, TimestampJson } from "@bufbuild/protobuf/wkt";
import type { Approval, ApprovalJson, DisplayFormat, DisplayFormatJson, Risk, RiskJson } from "./options_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file medallion/control/v1/resource.proto.
 */
export declare const file_medallion_control_v1_resource: GenFile;
/**
 * A stable pointer to any control-plane object.
 *
 * @generated from message medallion.control.v1.ResourceRef
 */
export type ResourceRef = Message<"medallion.control.v1.ResourceRef"> & {
    /**
     * Workspace the object belongs to.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * API group, e.g. "os.example".
     *
     * @generated from field: string group = 2;
     */
    group: string;
    /**
     * Plural, e.g. "operations".
     *
     * @generated from field: string plural = 3;
     */
    plural: string;
    /**
     * Object name, unique within workspace, group and plural.
     *
     * @generated from field: string name = 4;
     */
    name: string;
};
/**
 * A stable pointer to any control-plane object.
 *
 * @generated from message medallion.control.v1.ResourceRef
 */
export type ResourceRefJson = {
    /**
     * Workspace the object belongs to.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId?: string;
    /**
     * API group, e.g. "os.example".
     *
     * @generated from field: string group = 2;
     */
    group?: string;
    /**
     * Plural, e.g. "operations".
     *
     * @generated from field: string plural = 3;
     */
    plural?: string;
    /**
     * Object name, unique within workspace, group and plural.
     *
     * @generated from field: string name = 4;
     */
    name?: string;
};
/**
 * Describes the message medallion.control.v1.ResourceRef.
 * Use `create(ResourceRefSchema)` to create a new message.
 */
export declare const ResourceRefSchema: GenMessage<ResourceRef, {
    jsonType: ResourceRefJson;
}>;
/**
 * Where the observed facts came from and how fresh they are.
 *
 * @generated from message medallion.control.v1.Provenance
 */
export type Provenance = Message<"medallion.control.v1.Provenance"> & {
    /**
     * Owning provider, e.g. "os".
     *
     * @generated from field: string provider = 1;
     */
    provider: string;
    /**
     * Source of the spec for SPEC_SOURCE_GIT kinds, e.g.
     * "deploy:files/config.yaml#feeds.tape".
     *
     * @generated from field: string spec_source_path = 2;
     */
    specSourcePath: string;
    /**
     * When status was observed.
     *
     * @generated from field: google.protobuf.Timestamp observed_at = 3;
     */
    observedAt?: Timestamp | undefined;
};
/**
 * Where the observed facts came from and how fresh they are.
 *
 * @generated from message medallion.control.v1.Provenance
 */
export type ProvenanceJson = {
    /**
     * Owning provider, e.g. "os".
     *
     * @generated from field: string provider = 1;
     */
    provider?: string;
    /**
     * Source of the spec for SPEC_SOURCE_GIT kinds, e.g.
     * "deploy:files/config.yaml#feeds.tape".
     *
     * @generated from field: string spec_source_path = 2;
     */
    specSourcePath?: string;
    /**
     * When status was observed.
     *
     * @generated from field: google.protobuf.Timestamp observed_at = 3;
     */
    observedAt?: TimestampJson;
};
/**
 * Describes the message medallion.control.v1.Provenance.
 * Use `create(ProvenanceSchema)` to create a new message.
 */
export declare const ProvenanceSchema: GenMessage<Provenance, {
    jsonType: ProvenanceJson;
}>;
/**
 * Identity, versioning and placement of an object.
 *
 * @generated from message medallion.control.v1.ObjectMeta
 */
export type ObjectMeta = Message<"medallion.control.v1.ObjectMeta"> & {
    /**
     * Pointer to this object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRef | undefined;
    /**
     * Opaque, never reused.
     *
     * @generated from field: string uid = 2;
     */
    uid: string;
    /**
     * Increments on every spec change; an Operation has exactly one.
     *
     * @generated from field: int64 generation = 3;
     */
    generation: bigint;
    /**
     * Selector labels.
     *
     * @generated from field: map<string, string> labels = 4;
     */
    labels: {
        [key: string]: string;
    };
    /**
     * Owners, for grouping and cascading views.
     *
     * @generated from field: repeated medallion.control.v1.ResourceRef owner_refs = 5;
     */
    ownerRefs: ResourceRef[];
    /**
     * Rendered tree path, e.g. "Platform/Data/Feeds/markets/tape".
     *
     * @generated from field: string tree_path = 6;
     */
    treePath: string;
    /**
     * Source and freshness.
     *
     * @generated from field: medallion.control.v1.Provenance provenance = 7;
     */
    provenance?: Provenance | undefined;
    /**
     * Creation time.
     *
     * @generated from field: google.protobuf.Timestamp created_at = 8;
     */
    createdAt?: Timestamp | undefined;
    /**
     * Who asked for the current generation: "user:<id>" or
     * "service_account:<id>".
     *
     * @generated from field: string requested_by = 9;
     */
    requestedBy: string;
};
/**
 * Identity, versioning and placement of an object.
 *
 * @generated from message medallion.control.v1.ObjectMeta
 */
export type ObjectMetaJson = {
    /**
     * Pointer to this object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRefJson;
    /**
     * Opaque, never reused.
     *
     * @generated from field: string uid = 2;
     */
    uid?: string;
    /**
     * Increments on every spec change; an Operation has exactly one.
     *
     * @generated from field: int64 generation = 3;
     */
    generation?: string;
    /**
     * Selector labels.
     *
     * @generated from field: map<string, string> labels = 4;
     */
    labels?: {
        [key: string]: string;
    };
    /**
     * Owners, for grouping and cascading views.
     *
     * @generated from field: repeated medallion.control.v1.ResourceRef owner_refs = 5;
     */
    ownerRefs?: ResourceRefJson[];
    /**
     * Rendered tree path, e.g. "Platform/Data/Feeds/markets/tape".
     *
     * @generated from field: string tree_path = 6;
     */
    treePath?: string;
    /**
     * Source and freshness.
     *
     * @generated from field: medallion.control.v1.Provenance provenance = 7;
     */
    provenance?: ProvenanceJson;
    /**
     * Creation time.
     *
     * @generated from field: google.protobuf.Timestamp created_at = 8;
     */
    createdAt?: TimestampJson;
    /**
     * Who asked for the current generation: "user:<id>" or
     * "service_account:<id>".
     *
     * @generated from field: string requested_by = 9;
     */
    requestedBy?: string;
};
/**
 * Describes the message medallion.control.v1.ObjectMeta.
 * Use `create(ObjectMetaSchema)` to create a new message.
 */
export declare const ObjectMetaSchema: GenMessage<ObjectMeta, {
    jsonType: ObjectMetaJson;
}>;
/**
 * A Kubernetes-style condition.
 *
 * @generated from message medallion.control.v1.Condition
 */
export type Condition = Message<"medallion.control.v1.Condition"> & {
    /**
     * e.g. "Ready", "Fresh", "Planned", "Blocked".
     *
     * @generated from field: string type = 1;
     */
    type: string;
    /**
     * Value.
     *
     * @generated from field: medallion.control.v1.Condition.Truth status = 2;
     */
    status: Condition_Truth;
    /**
     * CamelCase machine reason, e.g. "DenyWindow".
     *
     * @generated from field: string reason = 3;
     */
    reason: string;
    /**
     * One terse sentence.
     *
     * @generated from field: string message = 4;
     */
    message: string;
    /**
     * When status last changed.
     *
     * @generated from field: google.protobuf.Timestamp last_transition_time = 5;
     */
    lastTransitionTime?: Timestamp | undefined;
    /**
     * Generation this condition describes.
     *
     * @generated from field: int64 observed_generation = 6;
     */
    observedGeneration: bigint;
};
/**
 * A Kubernetes-style condition.
 *
 * @generated from message medallion.control.v1.Condition
 */
export type ConditionJson = {
    /**
     * e.g. "Ready", "Fresh", "Planned", "Blocked".
     *
     * @generated from field: string type = 1;
     */
    type?: string;
    /**
     * Value.
     *
     * @generated from field: medallion.control.v1.Condition.Truth status = 2;
     */
    status?: Condition_TruthJson;
    /**
     * CamelCase machine reason, e.g. "DenyWindow".
     *
     * @generated from field: string reason = 3;
     */
    reason?: string;
    /**
     * One terse sentence.
     *
     * @generated from field: string message = 4;
     */
    message?: string;
    /**
     * When status last changed.
     *
     * @generated from field: google.protobuf.Timestamp last_transition_time = 5;
     */
    lastTransitionTime?: TimestampJson;
    /**
     * Generation this condition describes.
     *
     * @generated from field: int64 observed_generation = 6;
     */
    observedGeneration?: string;
};
/**
 * Describes the message medallion.control.v1.Condition.
 * Use `create(ConditionSchema)` to create a new message.
 */
export declare const ConditionSchema: GenMessage<Condition, {
    jsonType: ConditionJson;
}>;
/**
 * Truth value of a condition.
 *
 * @generated from enum medallion.control.v1.Condition.Truth
 */
export declare enum Condition_Truth {
    /**
     * Unknown.
     *
     * @generated from enum value: TRUTH_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Holds.
     *
     * @generated from enum value: TRUTH_TRUE = 1;
     */
    TRUE = 1,
    /**
     * Does not hold.
     *
     * @generated from enum value: TRUTH_FALSE = 2;
     */
    FALSE = 2
}
/**
 * Truth value of a condition.
 *
 * @generated from enum medallion.control.v1.Condition.Truth
 */
export type Condition_TruthJson = "TRUTH_UNSPECIFIED" | "TRUTH_TRUE" | "TRUTH_FALSE";
/**
 * Describes the enum medallion.control.v1.Condition.Truth.
 */
export declare const Condition_TruthSchema: GenEnum<Condition_Truth, Condition_TruthJson>;
/**
 * The workflow run that carried a generation or an observation.
 *
 * @generated from message medallion.control.v1.RunRef
 */
export type RunRef = Message<"medallion.control.v1.RunRef"> & {
    /**
     * Store namespace.
     *
     * @generated from field: string namespace = 1;
     */
    namespace: string;
    /**
     * Workflow id, e.g. "op:maintain-bronze-20261017".
     *
     * @generated from field: string workflow_id = 2;
     */
    workflowId: string;
    /**
     * Run id, e.g. "g000001".
     *
     * @generated from field: string run_id = 3;
     */
    runId: string;
};
/**
 * The workflow run that carried a generation or an observation.
 *
 * @generated from message medallion.control.v1.RunRef
 */
export type RunRefJson = {
    /**
     * Store namespace.
     *
     * @generated from field: string namespace = 1;
     */
    namespace?: string;
    /**
     * Workflow id, e.g. "op:maintain-bronze-20261017".
     *
     * @generated from field: string workflow_id = 2;
     */
    workflowId?: string;
    /**
     * Run id, e.g. "g000001".
     *
     * @generated from field: string run_id = 3;
     */
    runId?: string;
};
/**
 * Describes the message medallion.control.v1.RunRef.
 * Use `create(RunRefSchema)` to create a new message.
 */
export declare const RunRefSchema: GenMessage<RunRef, {
    jsonType: RunRefJson;
}>;
/**
 * Observed state common to every kind.
 *
 * @generated from message medallion.control.v1.Status
 */
export type Status = Message<"medallion.control.v1.Status"> & {
    /**
     * Last generation the controller finished acting on.
     *
     * @generated from field: int64 observed_generation = 1;
     */
    observedGeneration: bigint;
    /**
     * Short phase for lists, e.g. "Failing", "AwaitingApproval".
     *
     * @generated from field: string phase = 2;
     */
    phase: string;
    /**
     * Conditions.
     *
     * @generated from field: repeated medallion.control.v1.Condition conditions = 3;
     */
    conditions: Condition[];
    /**
     * Run for the current generation or the latest observation.
     *
     * @generated from field: medallion.control.v1.RunRef run = 4;
     */
    run?: RunRef | undefined;
    /**
     * Kind-specific typed status (KindOptions.status_type).
     *
     * @generated from field: google.protobuf.Any detail = 5;
     */
    detail?: Any | undefined;
};
/**
 * Observed state common to every kind.
 *
 * @generated from message medallion.control.v1.Status
 */
export type StatusJson = {
    /**
     * Last generation the controller finished acting on.
     *
     * @generated from field: int64 observed_generation = 1;
     */
    observedGeneration?: string;
    /**
     * Short phase for lists, e.g. "Failing", "AwaitingApproval".
     *
     * @generated from field: string phase = 2;
     */
    phase?: string;
    /**
     * Conditions.
     *
     * @generated from field: repeated medallion.control.v1.Condition conditions = 3;
     */
    conditions?: ConditionJson[];
    /**
     * Run for the current generation or the latest observation.
     *
     * @generated from field: medallion.control.v1.RunRef run = 4;
     */
    run?: RunRefJson;
    /**
     * Kind-specific typed status (KindOptions.status_type).
     *
     * @generated from field: google.protobuf.Any detail = 5;
     */
    detail?: AnyJson;
};
/**
 * Describes the message medallion.control.v1.Status.
 * Use `create(StatusSchema)` to create a new message.
 */
export declare const StatusSchema: GenMessage<Status, {
    jsonType: StatusJson;
}>;
/**
 * One labelled value of a server-side display projection.
 *
 * @generated from message medallion.control.v1.Property
 */
export type Property = Message<"medallion.control.v1.Property"> & {
    /**
     * Label, e.g. "Last success".
     *
     * @generated from field: string label = 1;
     */
    label: string;
    /**
     * Value as text; RFC 3339 for AGE and TIMESTAMP, seconds for DURATION.
     *
     * @generated from field: string value = 2;
     */
    value: string;
    /**
     * How the value renders.
     *
     * @generated from field: medallion.control.v1.DisplayFormat format = 3;
     */
    format: DisplayFormat;
    /**
     * Emphasis.
     *
     * @generated from field: medallion.control.v1.Tone tone = 4;
     */
    tone: Tone;
};
/**
 * One labelled value of a server-side display projection.
 *
 * @generated from message medallion.control.v1.Property
 */
export type PropertyJson = {
    /**
     * Label, e.g. "Last success".
     *
     * @generated from field: string label = 1;
     */
    label?: string;
    /**
     * Value as text; RFC 3339 for AGE and TIMESTAMP, seconds for DURATION.
     *
     * @generated from field: string value = 2;
     */
    value?: string;
    /**
     * How the value renders.
     *
     * @generated from field: medallion.control.v1.DisplayFormat format = 3;
     */
    format?: DisplayFormatJson;
    /**
     * Emphasis.
     *
     * @generated from field: medallion.control.v1.Tone tone = 4;
     */
    tone?: ToneJson;
};
/**
 * Describes the message medallion.control.v1.Property.
 * Use `create(PropertySchema)` to create a new message.
 */
export declare const PropertySchema: GenMessage<Property, {
    jsonType: PropertyJson;
}>;
/**
 * An operation offered on one object, already evaluated for this caller.
 *
 * @generated from message medallion.control.v1.ActionOffer
 */
export type ActionOffer = Message<"medallion.control.v1.ActionOffer"> & {
    /**
     * Fully-qualified operation method.
     *
     * @generated from field: string operation = 1;
     */
    operation: string;
    /**
     * Label.
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * Risk class.
     *
     * @generated from field: medallion.control.v1.Risk risk = 3;
     */
    risk: Risk;
    /**
     * Confirmation rule.
     *
     * @generated from field: medallion.control.v1.Approval approval = 4;
     */
    approval: Approval;
    /**
     * Whether the caller may request it now.
     *
     * @generated from field: bool enabled = 5;
     */
    enabled: boolean;
    /**
     * Why not, when not enabled.
     *
     * @generated from field: string disabled_reason = 6;
     */
    disabledReason: string;
    /**
     * Request fields this object fills, by proto field name, as ProtoJSON
     * scalars: the operation's target field, e.g. {"namespace": "bronze"}.
     *
     * @generated from field: map<string, string> request_defaults = 7;
     */
    requestDefaults: {
        [key: string]: string;
    };
};
/**
 * An operation offered on one object, already evaluated for this caller.
 *
 * @generated from message medallion.control.v1.ActionOffer
 */
export type ActionOfferJson = {
    /**
     * Fully-qualified operation method.
     *
     * @generated from field: string operation = 1;
     */
    operation?: string;
    /**
     * Label.
     *
     * @generated from field: string label = 2;
     */
    label?: string;
    /**
     * Risk class.
     *
     * @generated from field: medallion.control.v1.Risk risk = 3;
     */
    risk?: RiskJson;
    /**
     * Confirmation rule.
     *
     * @generated from field: medallion.control.v1.Approval approval = 4;
     */
    approval?: ApprovalJson;
    /**
     * Whether the caller may request it now.
     *
     * @generated from field: bool enabled = 5;
     */
    enabled?: boolean;
    /**
     * Why not, when not enabled.
     *
     * @generated from field: string disabled_reason = 6;
     */
    disabledReason?: string;
    /**
     * Request fields this object fills, by proto field name, as ProtoJSON
     * scalars: the operation's target field, e.g. {"namespace": "bronze"}.
     *
     * @generated from field: map<string, string> request_defaults = 7;
     */
    requestDefaults?: {
        [key: string]: string;
    };
};
/**
 * Describes the message medallion.control.v1.ActionOffer.
 * Use `create(ActionOfferSchema)` to create a new message.
 */
export declare const ActionOfferSchema: GenMessage<ActionOffer, {
    jsonType: ActionOfferJson;
}>;
/**
 * A typed edge to another object.
 *
 * @generated from message medallion.control.v1.Link
 */
export type Link = Message<"medallion.control.v1.Link"> & {
    /**
     * Edge type, e.g. "scheduled_by", "run_of", "writes".
     *
     * @generated from field: string type = 1;
     */
    type: string;
    /**
     * Target object.
     *
     * @generated from field: medallion.control.v1.ResourceRef target = 2;
     */
    target?: ResourceRef | undefined;
    /**
     * Target tree path, for navigation.
     *
     * @generated from field: string target_path = 3;
     */
    targetPath: string;
};
/**
 * A typed edge to another object.
 *
 * @generated from message medallion.control.v1.Link
 */
export type LinkJson = {
    /**
     * Edge type, e.g. "scheduled_by", "run_of", "writes".
     *
     * @generated from field: string type = 1;
     */
    type?: string;
    /**
     * Target object.
     *
     * @generated from field: medallion.control.v1.ResourceRef target = 2;
     */
    target?: ResourceRefJson;
    /**
     * Target tree path, for navigation.
     *
     * @generated from field: string target_path = 3;
     */
    targetPath?: string;
};
/**
 * Describes the message medallion.control.v1.Link.
 * Use `create(LinkSchema)` to create a new message.
 */
export declare const LinkSchema: GenMessage<Link, {
    jsonType: LinkJson;
}>;
/**
 * One object: identity, typed desired state, observed state and its display
 * projection. Hosts never decode `spec` or `status.detail`; they render
 * `properties`, `actions` and `links`, and show the raw message as JSON.
 *
 * @generated from message medallion.control.v1.Resource
 */
export type Resource = Message<"medallion.control.v1.Resource"> & {
    /**
     * "<group>/<version>".
     *
     * @generated from field: string api_version = 1;
     */
    apiVersion: string;
    /**
     * Kind name.
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * Metadata.
     *
     * @generated from field: medallion.control.v1.ObjectMeta metadata = 3;
     */
    metadata?: ObjectMeta | undefined;
    /**
     * Typed spec; empty for SPEC_SOURCE_NONE kinds.
     *
     * @generated from field: google.protobuf.Any spec = 4;
     */
    spec?: Any | undefined;
    /**
     * Observed state.
     *
     * @generated from field: medallion.control.v1.Status status = 5;
     */
    status?: Status | undefined;
    /**
     * Display projection of spec and status, in order.
     *
     * @generated from field: repeated medallion.control.v1.Property properties = 6;
     */
    properties: Property[];
    /**
     * Operations on this object.
     *
     * @generated from field: repeated medallion.control.v1.ActionOffer actions = 7;
     */
    actions: ActionOffer[];
    /**
     * Edges to other objects.
     *
     * @generated from field: repeated medallion.control.v1.Link links = 8;
     */
    links: Link[];
};
/**
 * One object: identity, typed desired state, observed state and its display
 * projection. Hosts never decode `spec` or `status.detail`; they render
 * `properties`, `actions` and `links`, and show the raw message as JSON.
 *
 * @generated from message medallion.control.v1.Resource
 */
export type ResourceJson = {
    /**
     * "<group>/<version>".
     *
     * @generated from field: string api_version = 1;
     */
    apiVersion?: string;
    /**
     * Kind name.
     *
     * @generated from field: string kind = 2;
     */
    kind?: string;
    /**
     * Metadata.
     *
     * @generated from field: medallion.control.v1.ObjectMeta metadata = 3;
     */
    metadata?: ObjectMetaJson;
    /**
     * Typed spec; empty for SPEC_SOURCE_NONE kinds.
     *
     * @generated from field: google.protobuf.Any spec = 4;
     */
    spec?: AnyJson;
    /**
     * Observed state.
     *
     * @generated from field: medallion.control.v1.Status status = 5;
     */
    status?: StatusJson;
    /**
     * Display projection of spec and status, in order.
     *
     * @generated from field: repeated medallion.control.v1.Property properties = 6;
     */
    properties?: PropertyJson[];
    /**
     * Operations on this object.
     *
     * @generated from field: repeated medallion.control.v1.ActionOffer actions = 7;
     */
    actions?: ActionOfferJson[];
    /**
     * Edges to other objects.
     *
     * @generated from field: repeated medallion.control.v1.Link links = 8;
     */
    links?: LinkJson[];
};
/**
 * Describes the message medallion.control.v1.Resource.
 * Use `create(ResourceSchema)` to create a new message.
 */
export declare const ResourceSchema: GenMessage<Resource, {
    jsonType: ResourceJson;
}>;
/**
 * A dry-run result bound to exact bytes.
 *
 * @generated from message medallion.control.v1.Plan
 */
export type Plan = Message<"medallion.control.v1.Plan"> & {
    /**
     * SHA-256 over the operation, the target, the deterministic apply request,
     * the digest of the dry-run response and the provider descriptor digest.
     *
     * @generated from field: string digest = 1;
     */
    digest: string;
    /**
     * Operation method.
     *
     * @generated from field: string operation = 2;
     */
    operation: string;
    /**
     * The typed request that will be applied (plan-only field set to execute).
     *
     * @generated from field: google.protobuf.Any apply_request = 3;
     */
    applyRequest?: Any | undefined;
    /**
     * The typed dry-run response.
     *
     * @generated from field: google.protobuf.Any dry_run_response = 4;
     */
    dryRunResponse?: Any | undefined;
    /**
     * Objects the apply would touch.
     *
     * @generated from field: repeated medallion.control.v1.ResourceRef impact = 5;
     */
    impact: ResourceRef[];
    /**
     * Windows, exclusions, freezes and claims that block apply right now.
     *
     * @generated from field: repeated medallion.control.v1.Condition blockers = 6;
     */
    blockers: Condition[];
    /**
     * When computed.
     *
     * @generated from field: google.protobuf.Timestamp planned_at = 7;
     */
    plannedAt?: Timestamp | undefined;
    /**
     * After this an approval is refused and a new operation is required.
     *
     * @generated from field: google.protobuf.Timestamp expires_at = 8;
     */
    expiresAt?: Timestamp | undefined;
    /**
     * Display projection of the dry-run response.
     *
     * @generated from field: repeated medallion.control.v1.Property summary = 9;
     */
    summary: Property[];
};
/**
 * A dry-run result bound to exact bytes.
 *
 * @generated from message medallion.control.v1.Plan
 */
export type PlanJson = {
    /**
     * SHA-256 over the operation, the target, the deterministic apply request,
     * the digest of the dry-run response and the provider descriptor digest.
     *
     * @generated from field: string digest = 1;
     */
    digest?: string;
    /**
     * Operation method.
     *
     * @generated from field: string operation = 2;
     */
    operation?: string;
    /**
     * The typed request that will be applied (plan-only field set to execute).
     *
     * @generated from field: google.protobuf.Any apply_request = 3;
     */
    applyRequest?: AnyJson;
    /**
     * The typed dry-run response.
     *
     * @generated from field: google.protobuf.Any dry_run_response = 4;
     */
    dryRunResponse?: AnyJson;
    /**
     * Objects the apply would touch.
     *
     * @generated from field: repeated medallion.control.v1.ResourceRef impact = 5;
     */
    impact?: ResourceRefJson[];
    /**
     * Windows, exclusions, freezes and claims that block apply right now.
     *
     * @generated from field: repeated medallion.control.v1.Condition blockers = 6;
     */
    blockers?: ConditionJson[];
    /**
     * When computed.
     *
     * @generated from field: google.protobuf.Timestamp planned_at = 7;
     */
    plannedAt?: TimestampJson;
    /**
     * After this an approval is refused and a new operation is required.
     *
     * @generated from field: google.protobuf.Timestamp expires_at = 8;
     */
    expiresAt?: TimestampJson;
    /**
     * Display projection of the dry-run response.
     *
     * @generated from field: repeated medallion.control.v1.Property summary = 9;
     */
    summary?: PropertyJson[];
};
/**
 * Describes the message medallion.control.v1.Plan.
 * Use `create(PlanSchema)` to create a new message.
 */
export declare const PlanSchema: GenMessage<Plan, {
    jsonType: PlanJson;
}>;
/**
 * Spec of the built-in Operation kind: immutable after create, one
 * generation, lifecycle in OperationStatus.
 *
 * @generated from message medallion.control.v1.OperationSpec
 */
export type OperationSpec = Message<"medallion.control.v1.OperationSpec"> & {
    /**
     * Operation method, declared with (medallion.control.v1.operation).
     *
     * @generated from field: string operation = 1;
     */
    operation: string;
    /**
     * Typed request for that method; the plan-only field is control-managed.
     *
     * @generated from field: google.protobuf.Any request = 2;
     */
    request?: Any | undefined;
    /**
     * Why this is being done; required.
     *
     * @generated from field: string reason = 3;
     */
    reason: string;
    /**
     * Do not apply before this time.
     *
     * @generated from field: google.protobuf.Timestamp not_before = 4;
     */
    notBefore?: Timestamp | undefined;
};
/**
 * Spec of the built-in Operation kind: immutable after create, one
 * generation, lifecycle in OperationStatus.
 *
 * @generated from message medallion.control.v1.OperationSpec
 */
export type OperationSpecJson = {
    /**
     * Operation method, declared with (medallion.control.v1.operation).
     *
     * @generated from field: string operation = 1;
     */
    operation?: string;
    /**
     * Typed request for that method; the plan-only field is control-managed.
     *
     * @generated from field: google.protobuf.Any request = 2;
     */
    request?: AnyJson;
    /**
     * Why this is being done; required.
     *
     * @generated from field: string reason = 3;
     */
    reason?: string;
    /**
     * Do not apply before this time.
     *
     * @generated from field: google.protobuf.Timestamp not_before = 4;
     */
    notBefore?: TimestampJson;
};
/**
 * Describes the message medallion.control.v1.OperationSpec.
 * Use `create(OperationSpecSchema)` to create a new message.
 */
export declare const OperationSpecSchema: GenMessage<OperationSpec, {
    jsonType: OperationSpecJson;
}>;
/**
 * Typed status detail of the Operation kind.
 *
 * @generated from message medallion.control.v1.OperationStatus
 */
export type OperationStatus = Message<"medallion.control.v1.OperationStatus"> & {
    /**
     * Phase.
     *
     * @generated from field: medallion.control.v1.OperationPhase phase = 1;
     */
    phase: OperationPhase;
    /**
     * Plan.
     *
     * @generated from field: medallion.control.v1.Plan plan = 2;
     */
    plan?: Plan | undefined;
    /**
     * Approval decision, once given.
     *
     * @generated from field: medallion.control.v1.ApprovalRecord approval = 3;
     */
    approval?: ApprovalRecord | undefined;
    /**
     * Cancel request, once made.
     *
     * @generated from field: medallion.control.v1.CancelRecord cancel = 4;
     */
    cancel?: CancelRecord | undefined;
    /**
     * Runner Job name, for RUNNER_KUBERNETES_JOB.
     *
     * @generated from field: string job_name = 5;
     */
    jobName: string;
    /**
     * Typed apply response.
     *
     * @generated from field: google.protobuf.Any result = 6;
     */
    result?: Any | undefined;
};
/**
 * Typed status detail of the Operation kind.
 *
 * @generated from message medallion.control.v1.OperationStatus
 */
export type OperationStatusJson = {
    /**
     * Phase.
     *
     * @generated from field: medallion.control.v1.OperationPhase phase = 1;
     */
    phase?: OperationPhaseJson;
    /**
     * Plan.
     *
     * @generated from field: medallion.control.v1.Plan plan = 2;
     */
    plan?: PlanJson;
    /**
     * Approval decision, once given.
     *
     * @generated from field: medallion.control.v1.ApprovalRecord approval = 3;
     */
    approval?: ApprovalRecordJson;
    /**
     * Cancel request, once made.
     *
     * @generated from field: medallion.control.v1.CancelRecord cancel = 4;
     */
    cancel?: CancelRecordJson;
    /**
     * Runner Job name, for RUNNER_KUBERNETES_JOB.
     *
     * @generated from field: string job_name = 5;
     */
    jobName?: string;
    /**
     * Typed apply response.
     *
     * @generated from field: google.protobuf.Any result = 6;
     */
    result?: AnyJson;
};
/**
 * Describes the message medallion.control.v1.OperationStatus.
 * Use `create(OperationStatusSchema)` to create a new message.
 */
export declare const OperationStatusSchema: GenMessage<OperationStatus, {
    jsonType: OperationStatusJson;
}>;
/**
 * An approval decision, delivered once into the operation's run.
 *
 * @generated from message medallion.control.v1.ApprovalRecord
 */
export type ApprovalRecord = Message<"medallion.control.v1.ApprovalRecord"> & {
    /**
     * Equals Plan.digest.
     *
     * @generated from field: string plan_digest = 1;
     */
    planDigest: string;
    /**
     * True approves, false rejects.
     *
     * @generated from field: bool approved = 2;
     */
    approved: boolean;
    /**
     * Human principal, "user:<id>".
     *
     * @generated from field: string approver = 3;
     */
    approver: string;
    /**
     * Required free text.
     *
     * @generated from field: string reason = 4;
     */
    reason: string;
    /**
     * When decided.
     *
     * @generated from field: google.protobuf.Timestamp decided_at = 5;
     */
    decidedAt?: Timestamp | undefined;
};
/**
 * An approval decision, delivered once into the operation's run.
 *
 * @generated from message medallion.control.v1.ApprovalRecord
 */
export type ApprovalRecordJson = {
    /**
     * Equals Plan.digest.
     *
     * @generated from field: string plan_digest = 1;
     */
    planDigest?: string;
    /**
     * True approves, false rejects.
     *
     * @generated from field: bool approved = 2;
     */
    approved?: boolean;
    /**
     * Human principal, "user:<id>".
     *
     * @generated from field: string approver = 3;
     */
    approver?: string;
    /**
     * Required free text.
     *
     * @generated from field: string reason = 4;
     */
    reason?: string;
    /**
     * When decided.
     *
     * @generated from field: google.protobuf.Timestamp decided_at = 5;
     */
    decidedAt?: TimestampJson;
};
/**
 * Describes the message medallion.control.v1.ApprovalRecord.
 * Use `create(ApprovalRecordSchema)` to create a new message.
 */
export declare const ApprovalRecordSchema: GenMessage<ApprovalRecord, {
    jsonType: ApprovalRecordJson;
}>;
/**
 * A request to stop a run at its next activity boundary, delivered once.
 *
 * @generated from message medallion.control.v1.CancelRecord
 */
export type CancelRecord = Message<"medallion.control.v1.CancelRecord"> & {
    /**
     * Principal.
     *
     * @generated from field: string requested_by = 1;
     */
    requestedBy: string;
    /**
     * Required free text.
     *
     * @generated from field: string reason = 2;
     */
    reason: string;
    /**
     * When requested.
     *
     * @generated from field: google.protobuf.Timestamp requested_at = 3;
     */
    requestedAt?: Timestamp | undefined;
};
/**
 * A request to stop a run at its next activity boundary, delivered once.
 *
 * @generated from message medallion.control.v1.CancelRecord
 */
export type CancelRecordJson = {
    /**
     * Principal.
     *
     * @generated from field: string requested_by = 1;
     */
    requestedBy?: string;
    /**
     * Required free text.
     *
     * @generated from field: string reason = 2;
     */
    reason?: string;
    /**
     * When requested.
     *
     * @generated from field: google.protobuf.Timestamp requested_at = 3;
     */
    requestedAt?: TimestampJson;
};
/**
 * Describes the message medallion.control.v1.CancelRecord.
 * Use `create(CancelRecordSchema)` to create a new message.
 */
export declare const CancelRecordSchema: GenMessage<CancelRecord, {
    jsonType: CancelRecordJson;
}>;
/**
 * Spec of the built-in Freeze kind, a singleton. Engaging applies at once;
 * releasing is planned and needs a human approval of its digest.
 *
 * @generated from message medallion.control.v1.FreezeSpec
 */
export type FreezeSpec = Message<"medallion.control.v1.FreezeSpec"> & {
    /**
     * Whether changes are frozen.
     *
     * @generated from field: bool engaged = 1;
     */
    engaged: boolean;
    /**
     * What is frozen.
     *
     * @generated from field: medallion.control.v1.FreezeScope scope = 2;
     */
    scope: FreezeScope;
    /**
     * Why; required.
     *
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * Spec of the built-in Freeze kind, a singleton. Engaging applies at once;
 * releasing is planned and needs a human approval of its digest.
 *
 * @generated from message medallion.control.v1.FreezeSpec
 */
export type FreezeSpecJson = {
    /**
     * Whether changes are frozen.
     *
     * @generated from field: bool engaged = 1;
     */
    engaged?: boolean;
    /**
     * What is frozen.
     *
     * @generated from field: medallion.control.v1.FreezeScope scope = 2;
     */
    scope?: FreezeScopeJson;
    /**
     * Why; required.
     *
     * @generated from field: string reason = 3;
     */
    reason?: string;
};
/**
 * Describes the message medallion.control.v1.FreezeSpec.
 * Use `create(FreezeSpecSchema)` to create a new message.
 */
export declare const FreezeSpecSchema: GenMessage<FreezeSpec, {
    jsonType: FreezeSpecJson;
}>;
/**
 * The form projection of one request or spec field, so hosts build forms
 * without the owner's full descriptor set.
 *
 * @generated from message medallion.control.v1.FieldSpec
 */
export type FieldSpec = Message<"medallion.control.v1.FieldSpec"> & {
    /**
     * Proto field name.
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * ProtoJSON name.
     *
     * @generated from field: string json_name = 2;
     */
    jsonName: string;
    /**
     * Scalar type ("string", "bool", "uint32", "double", ...), "enum",
     * "message" or a well-known type such as "google.protobuf.Timestamp".
     *
     * @generated from field: string type = 3;
     */
    type: string;
    /**
     * Enum value names, for "enum".
     *
     * @generated from field: repeated string enum_values = 4;
     */
    enumValues: string[];
    /**
     * Whether the field is repeated.
     *
     * @generated from field: bool repeated = 5;
     */
    repeated: boolean;
    /**
     * The field's proto comment.
     *
     * @generated from field: string doc = 6;
     */
    doc: string;
    /**
     * Whether a value is required.
     *
     * @generated from field: bool required = 7;
     */
    required: boolean;
    /**
     * Message type, for "message".
     *
     * @generated from field: string message_type = 8;
     */
    messageType: string;
};
/**
 * The form projection of one request or spec field, so hosts build forms
 * without the owner's full descriptor set.
 *
 * @generated from message medallion.control.v1.FieldSpec
 */
export type FieldSpecJson = {
    /**
     * Proto field name.
     *
     * @generated from field: string name = 1;
     */
    name?: string;
    /**
     * ProtoJSON name.
     *
     * @generated from field: string json_name = 2;
     */
    jsonName?: string;
    /**
     * Scalar type ("string", "bool", "uint32", "double", ...), "enum",
     * "message" or a well-known type such as "google.protobuf.Timestamp".
     *
     * @generated from field: string type = 3;
     */
    type?: string;
    /**
     * Enum value names, for "enum".
     *
     * @generated from field: repeated string enum_values = 4;
     */
    enumValues?: string[];
    /**
     * Whether the field is repeated.
     *
     * @generated from field: bool repeated = 5;
     */
    repeated?: boolean;
    /**
     * The field's proto comment.
     *
     * @generated from field: string doc = 6;
     */
    doc?: string;
    /**
     * Whether a value is required.
     *
     * @generated from field: bool required = 7;
     */
    required?: boolean;
    /**
     * Message type, for "message".
     *
     * @generated from field: string message_type = 8;
     */
    messageType?: string;
};
/**
 * Describes the message medallion.control.v1.FieldSpec.
 * Use `create(FieldSpecSchema)` to create a new message.
 */
export declare const FieldSpecSchema: GenMessage<FieldSpec, {
    jsonType: FieldSpecJson;
}>;
/**
 * Emphasis a host gives a property value.
 *
 * @generated from enum medallion.control.v1.Tone
 */
export declare enum Tone {
    /**
     * No emphasis.
     *
     * @generated from enum value: TONE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Healthy or done.
     *
     * @generated from enum value: TONE_POSITIVE = 1;
     */
    POSITIVE = 1,
    /**
     * Needs attention.
     *
     * @generated from enum value: TONE_WARNING = 2;
     */
    WARNING = 2,
    /**
     * Failing.
     *
     * @generated from enum value: TONE_CRITICAL = 3;
     */
    CRITICAL = 3
}
/**
 * Emphasis a host gives a property value.
 *
 * @generated from enum medallion.control.v1.Tone
 */
export type ToneJson = "TONE_UNSPECIFIED" | "TONE_POSITIVE" | "TONE_WARNING" | "TONE_CRITICAL";
/**
 * Describes the enum medallion.control.v1.Tone.
 */
export declare const ToneSchema: GenEnum<Tone, ToneJson>;
/**
 * Operation lifecycle phase.
 *
 * @generated from enum medallion.control.v1.OperationPhase
 */
export declare enum OperationPhase {
    /**
     * Unset.
     *
     * @generated from enum value: OPERATION_PHASE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Dry-run in progress.
     *
     * @generated from enum value: OPERATION_PHASE_PLANNING = 1;
     */
    PLANNING = 1,
    /**
     * Plan ready; waiting for an approval bound to its digest.
     *
     * @generated from enum value: OPERATION_PHASE_AWAITING_APPROVAL = 2;
     */
    AWAITING_APPROVAL = 2,
    /**
     * Approved; waiting for its runner, a window or a claim.
     *
     * @generated from enum value: OPERATION_PHASE_QUEUED = 3;
     */
    QUEUED = 3,
    /**
     * Apply executing.
     *
     * @generated from enum value: OPERATION_PHASE_RUNNING = 4;
     */
    RUNNING = 4,
    /**
     * Apply finished successfully.
     *
     * @generated from enum value: OPERATION_PHASE_SUCCEEDED = 5;
     */
    SUCCEEDED = 5,
    /**
     * Apply failed; the evidence is in the run.
     *
     * @generated from enum value: OPERATION_PHASE_FAILED = 6;
     */
    FAILED = 6,
    /**
     * The evidence of the outcome was lost (its runner vanished before its
     * result was read); never retried automatically.
     *
     * @generated from enum value: OPERATION_PHASE_INDETERMINATE = 7;
     */
    INDETERMINATE = 7,
    /**
     * The approver declined, or approval was refused.
     *
     * @generated from enum value: OPERATION_PHASE_REJECTED = 8;
     */
    REJECTED = 8,
    /**
     * Cancelled before or between activities.
     *
     * @generated from enum value: OPERATION_PHASE_CANCELLED = 9;
     */
    CANCELLED = 9,
    /**
     * The plan expired before approval.
     *
     * @generated from enum value: OPERATION_PHASE_EXPIRED = 10;
     */
    EXPIRED = 10
}
/**
 * Operation lifecycle phase.
 *
 * @generated from enum medallion.control.v1.OperationPhase
 */
export type OperationPhaseJson = "OPERATION_PHASE_UNSPECIFIED" | "OPERATION_PHASE_PLANNING" | "OPERATION_PHASE_AWAITING_APPROVAL" | "OPERATION_PHASE_QUEUED" | "OPERATION_PHASE_RUNNING" | "OPERATION_PHASE_SUCCEEDED" | "OPERATION_PHASE_FAILED" | "OPERATION_PHASE_INDETERMINATE" | "OPERATION_PHASE_REJECTED" | "OPERATION_PHASE_CANCELLED" | "OPERATION_PHASE_EXPIRED";
/**
 * Describes the enum medallion.control.v1.OperationPhase.
 */
export declare const OperationPhaseSchema: GenEnum<OperationPhase, OperationPhaseJson>;
/**
 * What a freeze holds.
 *
 * @generated from enum medallion.control.v1.FreezeScope
 */
export declare enum FreezeScope {
    /**
     * Unset; treated as FREEZE_SCOPE_LAKE_WRITES.
     *
     * @generated from enum value: FREEZE_SCOPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Operations that write the owner's durable data.
     *
     * @generated from enum value: FREEZE_SCOPE_LAKE_WRITES = 1;
     */
    LAKE_WRITES = 1,
    /**
     * Every operation that is not a read.
     *
     * @generated from enum value: FREEZE_SCOPE_PANEL = 2;
     */
    PANEL = 2
}
/**
 * What a freeze holds.
 *
 * @generated from enum medallion.control.v1.FreezeScope
 */
export type FreezeScopeJson = "FREEZE_SCOPE_UNSPECIFIED" | "FREEZE_SCOPE_LAKE_WRITES" | "FREEZE_SCOPE_PANEL";
/**
 * Describes the enum medallion.control.v1.FreezeScope.
 */
export declare const FreezeScopeSchema: GenEnum<FreezeScope, FreezeScopeJson>;
