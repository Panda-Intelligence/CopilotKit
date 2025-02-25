import { Parameter, Action } from '@copilotkit/shared';
import { b as CopilotServiceAdapter, R as RemoteChainParameters, A as ActionInput, d as AgentSessionInput, e as AgentStateInput, F as ForwardedParametersInput, E as ExtensionsInput, f as RuntimeEventSource, g as ExtensionsResponse } from './langserve-6f7af8d3.js';
import { M as MessageInput, a as Message } from './index-5bec5424.js';
import * as graphql from 'graphql';
import * as pino from 'pino';
import { YogaInitialContext, createYoga } from 'graphql-yoga';
import { CopilotCloudOptions } from './lib/cloud/index.js';

type LogLevel = "debug" | "info" | "warn" | "error";

declare const logger: pino.Logger<never, boolean>;
declare const addCustomHeaderPlugin: {
    onResponse({ response }: {
        response: any;
    }): void;
};
type AnyPrimitive = string | boolean | number | null;
type CopilotRequestContextProperties = Record<string, AnyPrimitive | Record<string, AnyPrimitive>>;
type GraphQLContext = YogaInitialContext & {
    _copilotkit: CreateCopilotRuntimeServerOptions;
    properties: CopilotRequestContextProperties;
    logger: typeof logger;
};
interface CreateCopilotRuntimeServerOptions {
    runtime: CopilotRuntime<any>;
    serviceAdapter: CopilotServiceAdapter;
    endpoint: string;
    baseUrl?: string;
    cloud?: CopilotCloudOptions;
    properties?: CopilotRequestContextProperties;
    logLevel?: LogLevel;
}
declare function createContext(initialContext: YogaInitialContext, copilotKitContext: CreateCopilotRuntimeServerOptions, contextLogger: typeof logger, properties?: CopilotRequestContextProperties): Promise<Partial<GraphQLContext>>;
declare function buildSchema(options?: {
    emitSchemaFile?: string;
}): graphql.GraphQLSchema;
type CommonConfig = {
    logging: typeof logger;
    schema: ReturnType<typeof buildSchema>;
    plugins: Parameters<typeof createYoga>[0]["plugins"];
    context: (ctx: YogaInitialContext) => Promise<Partial<GraphQLContext>>;
};
declare function getCommonConfig(options: CreateCopilotRuntimeServerOptions): CommonConfig;

declare enum MetaEventName {
    LangGraphInterruptEvent = "LangGraphInterruptEvent",
    CopilotKitLangGraphInterruptEvent = "CopilotKitLangGraphInterruptEvent"
}

declare class MetaEventInput {
    name: MetaEventName;
    value?: string;
    response?: string;
    messages?: MessageInput[];
}

type EndpointDefinition = CopilotKitEndpoint | LangGraphPlatformEndpoint;
declare enum EndpointType {
    CopilotKit = "copilotKit",
    LangGraphPlatform = "langgraph-platform"
}
interface BaseEndpointDefinition<TActionType extends EndpointType> {
    type?: TActionType;
}
interface CopilotKitEndpoint extends BaseEndpointDefinition<EndpointType.CopilotKit> {
    url: string;
    onBeforeRequest?: ({ ctx }: {
        ctx: GraphQLContext;
    }) => {
        headers?: Record<string, string> | undefined;
    };
}
interface LangGraphPlatformAgent {
    name: string;
    description: string;
    assistantId?: string;
}
interface LangGraphPlatformEndpoint extends BaseEndpointDefinition<EndpointType.LangGraphPlatform> {
    deploymentUrl: string;
    langsmithApiKey?: string;
    agents: LangGraphPlatformAgent[];
}

declare class Agent {
    id: string;
    name: string;
    description?: string;
}

declare class LoadAgentStateResponse {
    threadId: string;
    threadExists: boolean;
    state: string;
    messages: string;
}

/**
 * <Callout type="info">
 *   This is the reference for the `CopilotRuntime` class. For more information and example code snippets, please see [Concept: Copilot Runtime](/concepts/copilot-runtime).
 * </Callout>
 *
 * ## Usage
 *
 * ```tsx
 * import { CopilotRuntime } from "@copilotkit/runtime";
 *
 * const copilotKit = new CopilotRuntime();
 * ```
 */

interface CopilotRuntimeRequest {
    serviceAdapter: CopilotServiceAdapter;
    messages: MessageInput[];
    actions: ActionInput[];
    agentSession?: AgentSessionInput;
    agentStates?: AgentStateInput[];
    outputMessagesPromise: Promise<Message[]>;
    threadId?: string;
    runId?: string;
    publicApiKey?: string;
    graphqlContext: GraphQLContext;
    forwardedParameters?: ForwardedParametersInput;
    url?: string;
    extensions?: ExtensionsInput;
    metaEvents?: MetaEventInput[];
}
interface CopilotRuntimeResponse {
    threadId: string;
    runId?: string;
    eventSource: RuntimeEventSource;
    serverSideActions: Action<any>[];
    actionInputsWithoutAgents: ActionInput[];
    extensions?: ExtensionsResponse;
}
type ActionsConfiguration<T extends Parameter[] | [] = []> = Action<T>[] | ((ctx: {
    properties: any;
    url?: string;
}) => Action<T>[]);
interface OnBeforeRequestOptions {
    threadId?: string;
    runId?: string;
    inputMessages: Message[];
    properties: any;
    url?: string;
}
type OnBeforeRequestHandler = (options: OnBeforeRequestOptions) => void | Promise<void>;
interface OnAfterRequestOptions {
    threadId: string;
    runId?: string;
    inputMessages: Message[];
    outputMessages: Message[];
    properties: any;
    url?: string;
}
type OnAfterRequestHandler = (options: OnAfterRequestOptions) => void | Promise<void>;
interface Middleware {
    /**
     * A function that is called before the request is processed.
     */
    onBeforeRequest?: OnBeforeRequestHandler;
    /**
     * A function that is called after the request is processed.
     */
    onAfterRequest?: OnAfterRequestHandler;
}
type AgentWithEndpoint = Agent & {
    endpoint: EndpointDefinition;
};
interface CopilotRuntimeConstructorParams<T extends Parameter[] | [] = []> {
    /**
     * Middleware to be used by the runtime.
     *
     * ```ts
     * onBeforeRequest: (options: {
     *   threadId?: string;
     *   runId?: string;
     *   inputMessages: Message[];
     *   properties: any;
     * }) => void | Promise<void>;
     * ```
     *
     * ```ts
     * onAfterRequest: (options: {
     *   threadId?: string;
     *   runId?: string;
     *   inputMessages: Message[];
     *   outputMessages: Message[];
     *   properties: any;
     * }) => void | Promise<void>;
     * ```
     */
    middleware?: Middleware;
    actions?: ActionsConfiguration<T>;
    remoteActions?: CopilotKitEndpoint[];
    remoteEndpoints?: EndpointDefinition[];
    langserve?: RemoteChainParameters[];
    delegateAgentProcessingToServiceAdapter?: boolean;
}
declare class CopilotRuntime<const T extends Parameter[] | [] = []> {
    actions: ActionsConfiguration<T>;
    remoteEndpointDefinitions: EndpointDefinition[];
    private langserve;
    private onBeforeRequest?;
    private onAfterRequest?;
    private delegateAgentProcessingToServiceAdapter;
    constructor(params?: CopilotRuntimeConstructorParams<T>);
    processRuntimeRequest(request: CopilotRuntimeRequest): Promise<CopilotRuntimeResponse>;
    discoverAgentsFromEndpoints(graphqlContext: GraphQLContext): Promise<AgentWithEndpoint[]>;
    loadAgentState(graphqlContext: GraphQLContext, threadId: string, agentName: string): Promise<LoadAgentStateResponse>;
    private processAgentRequest;
    private getServerSideActions;
}
declare function flattenToolCallsNoDuplicates(toolsByPriority: ActionInput[]): ActionInput[];
declare function copilotKitEndpoint(config: Omit<CopilotKitEndpoint, "type">): CopilotKitEndpoint;
declare function langGraphPlatformEndpoint(config: Omit<LangGraphPlatformEndpoint, "type">): LangGraphPlatformEndpoint;
declare function resolveEndpointType(endpoint: EndpointDefinition): EndpointType;

export { CopilotRuntimeConstructorParams as C, GraphQLContext as G, CopilotRuntime as a, addCustomHeaderPlugin as b, copilotKitEndpoint as c, CopilotRequestContextProperties as d, CreateCopilotRuntimeServerOptions as e, flattenToolCallsNoDuplicates as f, createContext as g, buildSchema as h, CommonConfig as i, getCommonConfig as j, langGraphPlatformEndpoint as l, resolveEndpointType as r };
