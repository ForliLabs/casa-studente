export type ServiceStatus = "connected" | "configured" | "not_configured" | "error";
export type OverallHealthStatus = "healthy" | "degraded" | "unhealthy";

export interface ServiceCheck {
  status: ServiceStatus;
  label: string;
  critical: boolean;
  latencyMs?: number;
  details?: string;
  recommendation?: string;
}

export interface HealthReport {
  status: OverallHealthStatus;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  summary: string;
  issues: string[];
  readiness: {
    servesTraffic: boolean;
    paymentsReady: boolean;
    notificationsReady: boolean;
    uploadsReady: boolean;
    observabilityReady: boolean;
  };
  services: {
    configured: number;
    total: number;
    criticalOk: boolean;
    details: Record<string, ServiceCheck>;
  };
  memory?: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
    externalMB: number;
  };
  runtime?: {
    nodeVersion: string;
    platform: string;
    arch: string;
  };
  responseTimeMs?: number;
}

interface BuildHealthReportOptions {
  verbose?: boolean;
  env?: NodeJS.ProcessEnv;
  now?: Date;
  uptimeSeconds?: number;
  version?: string;
  responseTimeMs?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  runtime?: {
    nodeVersion: string;
    platform: string;
    arch: string;
  };
}

const SERVICE_DEFINITIONS = [
  { key: "stripe", envVar: "STRIPE_SECRET_KEY", label: "Stripe payments", critical: false },
  { key: "email", envVar: "RESEND_API_KEY", label: "Resend email", critical: false },
  { key: "storage", envVar: "BLOB_READ_WRITE_TOKEN", label: "Vercel Blob storage", critical: false },
  { key: "ai", envVar: "OPENAI_API_KEY", label: "OpenAI AI", critical: false },
  { key: "monitoring", envVar: "SENTRY_DSN", label: "Sentry monitoring", critical: false },
  { key: "analytics", envVar: "POSTHOG_API_KEY", label: "PostHog analytics", critical: false },
] as const;

export function buildHealthReport(options: BuildHealthReportOptions = {}): HealthReport {
  const env = options.env ?? process.env;
  const verbose = options.verbose ?? false;
  const services: Record<string, ServiceCheck> = {
    database: checkDatabase(env),
  };

  for (const definition of SERVICE_DEFINITIONS) {
    services[definition.key] = checkServiceEnv(env, definition.envVar, definition.label, definition.critical);
  }

  const criticalOk = Object.values(services)
    .filter((service) => service.critical)
    .every((service) => service.status !== "error");
  const configuredCount = Object.values(services).filter(
    (service) => service.status === "connected" || service.status === "configured"
  ).length;

  const issues = Object.values(services)
    .filter((service) => service.status === "error")
    .map((service) => `${service.label}: ${service.details}`);
  const warnings = Object.values(services)
    .filter((service) => service.status === "not_configured")
    .map((service) => `${service.label}: ${service.recommendation ?? service.details ?? "configurazione richiesta"}`);

  const status: OverallHealthStatus = !criticalOk ? "unhealthy" : warnings.length > 0 ? "degraded" : "healthy";
  const summary =
    status === "healthy"
      ? `Tutte le integrazioni principali sono operative (${configuredCount}/${Object.keys(services).length}).`
      : status === "unhealthy"
        ? `Servizi critici non disponibili. Risolvi ${issues.length} problema/i prima del deploy.`
        : `${configuredCount}/${Object.keys(services).length} integrazioni configurate. Completa ${warnings.length} configurazioni per la piena operatività.`;

  const report: HealthReport = {
    status,
    timestamp: (options.now ?? new Date()).toISOString(),
    uptime: Math.round(options.uptimeSeconds ?? process.uptime()),
    environment: env.NODE_ENV || "development",
    version: options.version ?? env.npm_package_version ?? "0.1.0",
    summary,
    issues: [...issues, ...warnings],
    readiness: {
      servesTraffic: status !== "unhealthy",
      paymentsReady: services.stripe.status === "configured",
      notificationsReady: services.email.status === "configured",
      uploadsReady: services.storage.status === "configured",
      observabilityReady: services.monitoring.status === "configured" || services.analytics.status === "configured",
    },
    services: {
      configured: configuredCount,
      total: Object.keys(services).length,
      criticalOk,
      details: services,
    },
  };

  if (verbose) {
    const usage = options.memoryUsage ?? process.memoryUsage();
    report.memory = {
      heapUsedMB: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024),
      rssMB: Math.round(usage.rss / 1024 / 1024),
      externalMB: Math.round(usage.external / 1024 / 1024),
    };
    report.runtime = options.runtime ?? {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
    if (typeof options.responseTimeMs === "number") {
      report.responseTimeMs = options.responseTimeMs;
    }
  }

  return report;
}

function checkDatabase(env: NodeJS.ProcessEnv): ServiceCheck {
  if (env.DATABASE_URL) {
    return {
      status: "configured",
      label: "Database",
      critical: true,
      details: "PostgreSQL configured",
    };
  }

  if (env.NODE_ENV === "production") {
    return {
      status: "error",
      label: "Database",
      critical: true,
      details: "DATABASE_URL mancante in produzione",
      recommendation: "Imposta DATABASE_URL prima di pubblicare l'applicazione.",
    };
  }

  return {
    status: "configured",
    label: "Database",
    critical: true,
    details: "In-memory fallback per sviluppo/test",
  };
}

function checkServiceEnv(
  env: NodeJS.ProcessEnv,
  envVar: string,
  label: string,
  critical: boolean
): ServiceCheck {
  if (env[envVar]) {
    return {
      status: "configured",
      label,
      critical,
      details: `${label} configurato`,
    };
  }

  return {
    status: "not_configured",
    label,
    critical,
    details: `${label} non configurato`,
    recommendation: `Imposta ${envVar} per abilitare ${label.toLowerCase()}.`,
  };
}
