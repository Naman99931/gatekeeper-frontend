export interface HeaderRule {
  id: number;
  direction: 'REQUEST' | 'RESPONSE';
  action: 'ADD' | 'REMOVE';
  headerName: string;
  headerValue: string;
}

export interface RouteResponse {
  id: number;
  organizationId: number;
  routeId: string;
  name: string;
  pathPattern: string;
  targetBaseUrl: string;
  targetPathPrefix: string;
  requestsPerMinute: number;
  responseTimeoutMs: number;
  isIdempotencyEnabled: boolean;
  active: boolean;
  configurationVersion: number;
  allowedMethods: string[];
  headerRules: HeaderRule[];
  createdAt: string;
  updatedAt: string;
}

export interface RouteRequest {
  routeId: string;
  name: string;
  pathPattern: string;
  targetBaseUrl: string;
  targetPathPrefix: string;
  requestsPerMinute: number;
  responseTimeoutMs: number;
  idempotancyEnabled: boolean;
  active: boolean;
  allowedMethods: string[];
  headerRules: Array<{
    direction: 'REQUEST' | 'RESPONSE';
    action: 'ADD' | 'REMOVE';
    headerName: string;
    headerValue: string;
  }>;
}
