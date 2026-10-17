import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { KindOptions, KindOptionsJson, OperationOptions, OperationOptionsJson } from "./options_pb.js";
import type { FieldSpec, FieldSpecJson, Plan, PlanJson, Resource, ResourceJson, ResourceRef, ResourceRefJson } from "./resource_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file medallion/control/v1/control.proto.
 */
export declare const file_medallion_control_v1_control: GenFile;
/**
 * Discover request.
 *
 * @generated from message medallion.control.v1.DiscoverRequest
 */
export type DiscoverRequest = Message<"medallion.control.v1.DiscoverRequest"> & {
    /**
     * Workspace being browsed.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Discover request.
 *
 * @generated from message medallion.control.v1.DiscoverRequest
 */
export type DiscoverRequestJson = {
    /**
     * Workspace being browsed.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId?: string;
};
/**
 * Describes the message medallion.control.v1.DiscoverRequest.
 * Use `create(DiscoverRequestSchema)` to create a new message.
 */
export declare const DiscoverRequestSchema: GenMessage<DiscoverRequest, {
    jsonType: DiscoverRequestJson;
}>;
/**
 * A kind as served.
 *
 * @generated from message medallion.control.v1.KindInfo
 */
export type KindInfo = Message<"medallion.control.v1.KindInfo"> & {
    /**
     * Message carrying the declaration.
     *
     * @generated from field: string message = 1;
     */
    message: string;
    /**
     * Declaration.
     *
     * @generated from field: medallion.control.v1.KindOptions options = 2;
     */
    options?: KindOptions | undefined;
    /**
     * Operation methods targeting this kind.
     *
     * @generated from field: repeated string operations = 3;
     */
    operations: string[];
    /**
     * Form projection of the spec, for SPEC_SOURCE_CONTROL_PLANE kinds.
     *
     * @generated from field: repeated medallion.control.v1.FieldSpec spec_fields = 4;
     */
    specFields: FieldSpec[];
};
/**
 * A kind as served.
 *
 * @generated from message medallion.control.v1.KindInfo
 */
export type KindInfoJson = {
    /**
     * Message carrying the declaration.
     *
     * @generated from field: string message = 1;
     */
    message?: string;
    /**
     * Declaration.
     *
     * @generated from field: medallion.control.v1.KindOptions options = 2;
     */
    options?: KindOptionsJson;
    /**
     * Operation methods targeting this kind.
     *
     * @generated from field: repeated string operations = 3;
     */
    operations?: string[];
    /**
     * Form projection of the spec, for SPEC_SOURCE_CONTROL_PLANE kinds.
     *
     * @generated from field: repeated medallion.control.v1.FieldSpec spec_fields = 4;
     */
    specFields?: FieldSpecJson[];
};
/**
 * Describes the message medallion.control.v1.KindInfo.
 * Use `create(KindInfoSchema)` to create a new message.
 */
export declare const KindInfoSchema: GenMessage<KindInfo, {
    jsonType: KindInfoJson;
}>;
/**
 * An operation type as served. RISK_NEVER operations are never served.
 *
 * @generated from message medallion.control.v1.OperationInfo
 */
export type OperationInfo = Message<"medallion.control.v1.OperationInfo"> & {
    /**
     * Method, e.g. "example.v1.OpsService.Maintain".
     *
     * @generated from field: string method = 1;
     */
    method: string;
    /**
     * Request message.
     *
     * @generated from field: string request_type = 2;
     */
    requestType: string;
    /**
     * Response message.
     *
     * @generated from field: string response_type = 3;
     */
    responseType: string;
    /**
     * Declaration.
     *
     * @generated from field: medallion.control.v1.OperationOptions options = 4;
     */
    options?: OperationOptions | undefined;
    /**
     * Form projection of the request, control-managed fields excluded.
     *
     * @generated from field: repeated medallion.control.v1.FieldSpec request_fields = 5;
     */
    requestFields: FieldSpec[];
};
/**
 * An operation type as served. RISK_NEVER operations are never served.
 *
 * @generated from message medallion.control.v1.OperationInfo
 */
export type OperationInfoJson = {
    /**
     * Method, e.g. "example.v1.OpsService.Maintain".
     *
     * @generated from field: string method = 1;
     */
    method?: string;
    /**
     * Request message.
     *
     * @generated from field: string request_type = 2;
     */
    requestType?: string;
    /**
     * Response message.
     *
     * @generated from field: string response_type = 3;
     */
    responseType?: string;
    /**
     * Declaration.
     *
     * @generated from field: medallion.control.v1.OperationOptions options = 4;
     */
    options?: OperationOptionsJson;
    /**
     * Form projection of the request, control-managed fields excluded.
     *
     * @generated from field: repeated medallion.control.v1.FieldSpec request_fields = 5;
     */
    requestFields?: FieldSpecJson[];
};
/**
 * Describes the message medallion.control.v1.OperationInfo.
 * Use `create(OperationInfoSchema)` to create a new message.
 */
export declare const OperationInfoSchema: GenMessage<OperationInfo, {
    jsonType: OperationInfoJson;
}>;
/**
 * One provider behind the service.
 *
 * @generated from message medallion.control.v1.ProviderInfo
 */
export type ProviderInfo = Message<"medallion.control.v1.ProviderInfo"> & {
    /**
     * Provider name, e.g. "os".
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * SHA-256 of the provider's declaration descriptor set.
     *
     * @generated from field: string descriptor_digest = 2;
     */
    descriptorDigest: string;
    /**
     * API groups it owns.
     *
     * @generated from field: repeated string groups = 3;
     */
    groups: string[];
    /**
     * Served or not.
     *
     * @generated from field: medallion.control.v1.ProviderState state = 4;
     */
    state: ProviderState;
    /**
     * Why degraded.
     *
     * @generated from field: string message = 5;
     */
    message: string;
};
/**
 * One provider behind the service.
 *
 * @generated from message medallion.control.v1.ProviderInfo
 */
export type ProviderInfoJson = {
    /**
     * Provider name, e.g. "os".
     *
     * @generated from field: string name = 1;
     */
    name?: string;
    /**
     * SHA-256 of the provider's declaration descriptor set.
     *
     * @generated from field: string descriptor_digest = 2;
     */
    descriptorDigest?: string;
    /**
     * API groups it owns.
     *
     * @generated from field: repeated string groups = 3;
     */
    groups?: string[];
    /**
     * Served or not.
     *
     * @generated from field: medallion.control.v1.ProviderState state = 4;
     */
    state?: ProviderStateJson;
    /**
     * Why degraded.
     *
     * @generated from field: string message = 5;
     */
    message?: string;
};
/**
 * Describes the message medallion.control.v1.ProviderInfo.
 * Use `create(ProviderInfoSchema)` to create a new message.
 */
export declare const ProviderInfoSchema: GenMessage<ProviderInfo, {
    jsonType: ProviderInfoJson;
}>;
/**
 * Discover response.
 *
 * @generated from message medallion.control.v1.DiscoverResponse
 */
export type DiscoverResponse = Message<"medallion.control.v1.DiscoverResponse"> & {
    /**
     * Kinds the caller may read.
     *
     * @generated from field: repeated medallion.control.v1.KindInfo kinds = 1;
     */
    kinds: KindInfo[];
    /**
     * Operation types, offered or not, with their reasons.
     *
     * @generated from field: repeated medallion.control.v1.OperationInfo operations = 2;
     */
    operations: OperationInfo[];
    /**
     * Providers and their state.
     *
     * @generated from field: repeated medallion.control.v1.ProviderInfo providers = 3;
     */
    providers: ProviderInfo[];
};
/**
 * Discover response.
 *
 * @generated from message medallion.control.v1.DiscoverResponse
 */
export type DiscoverResponseJson = {
    /**
     * Kinds the caller may read.
     *
     * @generated from field: repeated medallion.control.v1.KindInfo kinds = 1;
     */
    kinds?: KindInfoJson[];
    /**
     * Operation types, offered or not, with their reasons.
     *
     * @generated from field: repeated medallion.control.v1.OperationInfo operations = 2;
     */
    operations?: OperationInfoJson[];
    /**
     * Providers and their state.
     *
     * @generated from field: repeated medallion.control.v1.ProviderInfo providers = 3;
     */
    providers?: ProviderInfoJson[];
};
/**
 * Describes the message medallion.control.v1.DiscoverResponse.
 * Use `create(DiscoverResponseSchema)` to create a new message.
 */
export declare const DiscoverResponseSchema: GenMessage<DiscoverResponse, {
    jsonType: DiscoverResponseJson;
}>;
/**
 * List request.
 *
 * @generated from message medallion.control.v1.ListResourcesRequest
 */
export type ListResourcesRequest = Message<"medallion.control.v1.ListResourcesRequest"> & {
    /**
     * Workspace.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * Group.
     *
     * @generated from field: string group = 2;
     */
    group: string;
    /**
     * Plural.
     *
     * @generated from field: string plural = 3;
     */
    plural: string;
    /**
     * Optional tree prefix, e.g. "Platform/Data/Feeds/markets".
     *
     * @generated from field: string tree_prefix = 4;
     */
    treePrefix: string;
    /**
     * Optional equality label selector.
     *
     * @generated from field: map<string, string> labels = 5;
     */
    labels: {
        [key: string]: string;
    };
    /**
     * Optional phase filter.
     *
     * @generated from field: repeated string phases = 6;
     */
    phases: string[];
    /**
     * At most 100; zero means 100.
     *
     * @generated from field: int32 page_size = 7;
     */
    pageSize: number;
    /**
     * Opaque.
     *
     * @generated from field: string page_token = 8;
     */
    pageToken: string;
};
/**
 * List request.
 *
 * @generated from message medallion.control.v1.ListResourcesRequest
 */
export type ListResourcesRequestJson = {
    /**
     * Workspace.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId?: string;
    /**
     * Group.
     *
     * @generated from field: string group = 2;
     */
    group?: string;
    /**
     * Plural.
     *
     * @generated from field: string plural = 3;
     */
    plural?: string;
    /**
     * Optional tree prefix, e.g. "Platform/Data/Feeds/markets".
     *
     * @generated from field: string tree_prefix = 4;
     */
    treePrefix?: string;
    /**
     * Optional equality label selector.
     *
     * @generated from field: map<string, string> labels = 5;
     */
    labels?: {
        [key: string]: string;
    };
    /**
     * Optional phase filter.
     *
     * @generated from field: repeated string phases = 6;
     */
    phases?: string[];
    /**
     * At most 100; zero means 100.
     *
     * @generated from field: int32 page_size = 7;
     */
    pageSize?: number;
    /**
     * Opaque.
     *
     * @generated from field: string page_token = 8;
     */
    pageToken?: string;
};
/**
 * Describes the message medallion.control.v1.ListResourcesRequest.
 * Use `create(ListResourcesRequestSchema)` to create a new message.
 */
export declare const ListResourcesRequestSchema: GenMessage<ListResourcesRequest, {
    jsonType: ListResourcesRequestJson;
}>;
/**
 * List response.
 *
 * @generated from message medallion.control.v1.ListResourcesResponse
 */
export type ListResourcesResponse = Message<"medallion.control.v1.ListResourcesResponse"> & {
    /**
     * Objects.
     *
     * @generated from field: repeated medallion.control.v1.Resource resources = 1;
     */
    resources: Resource[];
    /**
     * Opaque; empty at the end.
     *
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
};
/**
 * List response.
 *
 * @generated from message medallion.control.v1.ListResourcesResponse
 */
export type ListResourcesResponseJson = {
    /**
     * Objects.
     *
     * @generated from field: repeated medallion.control.v1.Resource resources = 1;
     */
    resources?: ResourceJson[];
    /**
     * Opaque; empty at the end.
     *
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken?: string;
};
/**
 * Describes the message medallion.control.v1.ListResourcesResponse.
 * Use `create(ListResourcesResponseSchema)` to create a new message.
 */
export declare const ListResourcesResponseSchema: GenMessage<ListResourcesResponse, {
    jsonType: ListResourcesResponseJson;
}>;
/**
 * Get request.
 *
 * @generated from message medallion.control.v1.GetResourceRequest
 */
export type GetResourceRequest = Message<"medallion.control.v1.GetResourceRequest"> & {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRef | undefined;
};
/**
 * Get request.
 *
 * @generated from message medallion.control.v1.GetResourceRequest
 */
export type GetResourceRequestJson = {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRefJson;
};
/**
 * Describes the message medallion.control.v1.GetResourceRequest.
 * Use `create(GetResourceRequestSchema)` to create a new message.
 */
export declare const GetResourceRequestSchema: GenMessage<GetResourceRequest, {
    jsonType: GetResourceRequestJson;
}>;
/**
 * Get response.
 *
 * @generated from message medallion.control.v1.GetResourceResponse
 */
export type GetResourceResponse = Message<"medallion.control.v1.GetResourceResponse"> & {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: Resource | undefined;
};
/**
 * Get response.
 *
 * @generated from message medallion.control.v1.GetResourceResponse
 */
export type GetResourceResponseJson = {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: ResourceJson;
};
/**
 * Describes the message medallion.control.v1.GetResourceResponse.
 * Use `create(GetResourceResponseSchema)` to create a new message.
 */
export declare const GetResourceResponseSchema: GenMessage<GetResourceResponse, {
    jsonType: GetResourceResponseJson;
}>;
/**
 * Apply request.
 *
 * @generated from message medallion.control.v1.ApplyRequest
 */
export type ApplyRequest = Message<"medallion.control.v1.ApplyRequest"> & {
    /**
     * Desired object: metadata.ref names it and spec is the typed message.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: Resource | undefined;
    /**
     * Validate and plan only; nothing is persisted.
     *
     * @generated from field: bool dry_run = 2;
     */
    dryRun: boolean;
    /**
     * Client-generated; a retry with the same key returns the same result.
     *
     * @generated from field: string idempotency_key = 3;
     */
    idempotencyKey: string;
};
/**
 * Apply request.
 *
 * @generated from message medallion.control.v1.ApplyRequest
 */
export type ApplyRequestJson = {
    /**
     * Desired object: metadata.ref names it and spec is the typed message.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: ResourceJson;
    /**
     * Validate and plan only; nothing is persisted.
     *
     * @generated from field: bool dry_run = 2;
     */
    dryRun?: boolean;
    /**
     * Client-generated; a retry with the same key returns the same result.
     *
     * @generated from field: string idempotency_key = 3;
     */
    idempotencyKey?: string;
};
/**
 * Describes the message medallion.control.v1.ApplyRequest.
 * Use `create(ApplyRequestSchema)` to create a new message.
 */
export declare const ApplyRequestSchema: GenMessage<ApplyRequest, {
    jsonType: ApplyRequestJson;
}>;
/**
 * Apply response.
 *
 * @generated from message medallion.control.v1.ApplyResponse
 */
export type ApplyResponse = Message<"medallion.control.v1.ApplyResponse"> & {
    /**
     * Object after apply, or as it would be for dry_run.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: Resource | undefined;
    /**
     * Plan, for operations and plan-then-approve kinds.
     *
     * @generated from field: medallion.control.v1.Plan plan = 2;
     */
    plan?: Plan | undefined;
};
/**
 * Apply response.
 *
 * @generated from message medallion.control.v1.ApplyResponse
 */
export type ApplyResponseJson = {
    /**
     * Object after apply, or as it would be for dry_run.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: ResourceJson;
    /**
     * Plan, for operations and plan-then-approve kinds.
     *
     * @generated from field: medallion.control.v1.Plan plan = 2;
     */
    plan?: PlanJson;
};
/**
 * Describes the message medallion.control.v1.ApplyResponse.
 * Use `create(ApplyResponseSchema)` to create a new message.
 */
export declare const ApplyResponseSchema: GenMessage<ApplyResponse, {
    jsonType: ApplyResponseJson;
}>;
/**
 * Approve request.
 *
 * @generated from message medallion.control.v1.ApproveRequest
 */
export type ApproveRequest = Message<"medallion.control.v1.ApproveRequest"> & {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRef | undefined;
    /**
     * Generation being decided.
     *
     * @generated from field: int64 generation = 2;
     */
    generation: bigint;
    /**
     * Must equal the current plan digest.
     *
     * @generated from field: string plan_digest = 3;
     */
    planDigest: string;
    /**
     * Approve or reject.
     *
     * @generated from field: bool approved = 4;
     */
    approved: boolean;
    /**
     * Required.
     *
     * @generated from field: string reason = 5;
     */
    reason: string;
    /**
     * The first six or more hex characters of plan_digest, as typed by the
     * approver.
     *
     * @generated from field: string confirmation = 6;
     */
    confirmation: string;
};
/**
 * Approve request.
 *
 * @generated from message medallion.control.v1.ApproveRequest
 */
export type ApproveRequestJson = {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRefJson;
    /**
     * Generation being decided.
     *
     * @generated from field: int64 generation = 2;
     */
    generation?: string;
    /**
     * Must equal the current plan digest.
     *
     * @generated from field: string plan_digest = 3;
     */
    planDigest?: string;
    /**
     * Approve or reject.
     *
     * @generated from field: bool approved = 4;
     */
    approved?: boolean;
    /**
     * Required.
     *
     * @generated from field: string reason = 5;
     */
    reason?: string;
    /**
     * The first six or more hex characters of plan_digest, as typed by the
     * approver.
     *
     * @generated from field: string confirmation = 6;
     */
    confirmation?: string;
};
/**
 * Describes the message medallion.control.v1.ApproveRequest.
 * Use `create(ApproveRequestSchema)` to create a new message.
 */
export declare const ApproveRequestSchema: GenMessage<ApproveRequest, {
    jsonType: ApproveRequestJson;
}>;
/**
 * Approve response.
 *
 * @generated from message medallion.control.v1.ApproveResponse
 */
export type ApproveResponse = Message<"medallion.control.v1.ApproveResponse"> & {
    /**
     * Object after the decision.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: Resource | undefined;
};
/**
 * Approve response.
 *
 * @generated from message medallion.control.v1.ApproveResponse
 */
export type ApproveResponseJson = {
    /**
     * Object after the decision.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: ResourceJson;
};
/**
 * Describes the message medallion.control.v1.ApproveResponse.
 * Use `create(ApproveResponseSchema)` to create a new message.
 */
export declare const ApproveResponseSchema: GenMessage<ApproveResponse, {
    jsonType: ApproveResponseJson;
}>;
/**
 * Cancel request.
 *
 * @generated from message medallion.control.v1.CancelRequest
 */
export type CancelRequest = Message<"medallion.control.v1.CancelRequest"> & {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRef | undefined;
    /**
     * Generation being cancelled.
     *
     * @generated from field: int64 generation = 2;
     */
    generation: bigint;
    /**
     * Required.
     *
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * Cancel request.
 *
 * @generated from message medallion.control.v1.CancelRequest
 */
export type CancelRequestJson = {
    /**
     * Object.
     *
     * @generated from field: medallion.control.v1.ResourceRef ref = 1;
     */
    ref?: ResourceRefJson;
    /**
     * Generation being cancelled.
     *
     * @generated from field: int64 generation = 2;
     */
    generation?: string;
    /**
     * Required.
     *
     * @generated from field: string reason = 3;
     */
    reason?: string;
};
/**
 * Describes the message medallion.control.v1.CancelRequest.
 * Use `create(CancelRequestSchema)` to create a new message.
 */
export declare const CancelRequestSchema: GenMessage<CancelRequest, {
    jsonType: CancelRequestJson;
}>;
/**
 * Cancel response.
 *
 * @generated from message medallion.control.v1.CancelResponse
 */
export type CancelResponse = Message<"medallion.control.v1.CancelResponse"> & {
    /**
     * Object after the request.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: Resource | undefined;
};
/**
 * Cancel response.
 *
 * @generated from message medallion.control.v1.CancelResponse
 */
export type CancelResponseJson = {
    /**
     * Object after the request.
     *
     * @generated from field: medallion.control.v1.Resource resource = 1;
     */
    resource?: ResourceJson;
};
/**
 * Describes the message medallion.control.v1.CancelResponse.
 * Use `create(CancelResponseSchema)` to create a new message.
 */
export declare const CancelResponseSchema: GenMessage<CancelResponse, {
    jsonType: CancelResponseJson;
}>;
/**
 * Whether a provider is being served.
 *
 * @generated from enum medallion.control.v1.ProviderState
 */
export declare enum ProviderState {
    /**
     * Unset.
     *
     * @generated from enum value: PROVIDER_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Served.
     *
     * @generated from enum value: PROVIDER_STATE_READY = 1;
     */
    READY = 1,
    /**
     * Not served: unreachable, or its descriptor differs from the frozen one.
     *
     * @generated from enum value: PROVIDER_STATE_DEGRADED = 2;
     */
    DEGRADED = 2
}
/**
 * Whether a provider is being served.
 *
 * @generated from enum medallion.control.v1.ProviderState
 */
export type ProviderStateJson = "PROVIDER_STATE_UNSPECIFIED" | "PROVIDER_STATE_READY" | "PROVIDER_STATE_DEGRADED";
/**
 * Describes the enum medallion.control.v1.ProviderState.
 */
export declare const ProviderStateSchema: GenEnum<ProviderState, ProviderStateJson>;
/**
 * One uniform resource API. An aggregator serves it to hosts (identity,
 * authorization, tenancy, discovery merge, audit) and each owner serves the
 * same service as a provider for the groups it owns. Unary only; hosts poll.
 *
 * @generated from service medallion.control.v1.ControlService
 */
export declare const ControlService: GenService<{
    /**
     * Kinds, operation types and the form projections needed to render them.
     *
     * @generated from rpc medallion.control.v1.ControlService.Discover
     */
    discover: {
        methodKind: "unary";
        input: typeof DiscoverRequestSchema;
        output: typeof DiscoverResponseSchema;
    };
    /**
     * Objects of one kind, filtered by tree prefix, labels or phase.
     *
     * @generated from rpc medallion.control.v1.ControlService.ListResources
     */
    listResources: {
        methodKind: "unary";
        input: typeof ListResourcesRequestSchema;
        output: typeof ListResourcesResponseSchema;
    };
    /**
     * One object.
     *
     * @generated from rpc medallion.control.v1.ControlService.GetResource
     */
    getResource: {
        methodKind: "unary";
        input: typeof GetResourceRequestSchema;
        output: typeof GetResourceResponseSchema;
    };
    /**
     * Server-side apply of desired state. dry_run plans without persisting;
     * otherwise the object (an Operation, a Freeze) is created once and its
     * controller run starts.
     *
     * @generated from rpc medallion.control.v1.ControlService.Apply
     */
    apply: {
        methodKind: "unary";
        input: typeof ApplyRequestSchema;
        output: typeof ApplyResponseSchema;
    };
    /**
     * Deliver an approval or rejection bound to a plan digest.
     *
     * @generated from rpc medallion.control.v1.ControlService.Approve
     */
    approve: {
        methodKind: "unary";
        input: typeof ApproveRequestSchema;
        output: typeof ApproveResponseSchema;
    };
    /**
     * Ask the current generation's run to stop at its next activity boundary.
     *
     * @generated from rpc medallion.control.v1.ControlService.Cancel
     */
    cancel: {
        methodKind: "unary";
        input: typeof CancelRequestSchema;
        output: typeof CancelResponseSchema;
    };
}>;
