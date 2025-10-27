# Database Schema Review — 1 Oct 2025

## Context
- Source analysed: `docs/legacy/02_ARQUITECTURA_DATOS/ARQUITECTURA_DATOS_COMPLETA.md` (revision 28 Sep 2025) plus supporting tech guide `docs/legacy/GUIA_TECNOLOGIAS_POR_MODULO.md`.
- Target stack: **Microsoft SQL Server 2019+** (per infrastructure charter).
- Observed drift: architectural DDL snippets still reference **PostgreSQL syntax** (`SERIAL`, `JSONB`, `INET`, `TIMESTAMP`).

## Summary Snapshot
- ✅ Business entities and relationships are thoroughly documented.
- ⚠️ Implementation syntax is incompatible with the committed SQL Server target.
- 🎯 Immediate win: translate the documented schema into Django migrations or SQL Server scripts, then feed changes back into the architecture dossier.

## Alignment Findings
### 1. Platform Mismatch (High Priority)
- Tables declare columns with `SERIAL`, `JSONB`, `INET`, and `BOOLEAN`. These types are invalid in SQL Server.
- `TIMESTAMP` is used as a generic datetime; in SQL Server it is a `ROWVERSION` type. Should use `DATETIME2(0-3)` or `DATETIMEOFFSET` instead.
- Recommended conversion matrix:
  | Current | SQL Server replacement |
  | --- | --- |
  | `SERIAL` | `INT IDENTITY(1,1)` |
  | `BOOLEAN` | `BIT` |
  | `JSONB` | `NVARCHAR(MAX)` + `CHECK (ISJSON(...)=1)` |
  | `INET` | `VARCHAR(45)` (supports IPv4/IPv6) |
  | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `DATETIME2 DEFAULT SYSDATETIME()` |

### 2. Naming & Schema Organisation (Medium)
- Tables currently defined without schema prefixes; align with SQL Server convention (`dbo.<table>` or dedicated schema such as `core`, `payments`).
- Mixed Spanish/English column names; maintain business terminology but standardise casing (snake_case) for consistency (e.g. `fecha_creacion` vs `created_at`).
- Consider using English for system fields (`created_at`, `updated_at`) to align with ORM defaults (Django expects `created_at`/`updated_at`).

### 3. Constraints & Indexing (Medium)
- Several foreign keys lack explicit indexes (`curso_id`, `persona_id`, `inscripcion_id`). SQL Server does not automatically create them; create non-clustered indexes for join performance.
- Unique constraints defined via `UNIQUE()` should be restated as named constraints for clarity and to ease migrations (e.g. `CONSTRAINT uq_user_role UNIQUE (user_id, role_id)`).
- `CHECK` constraints referencing functions like `CURRENT_DATE` should be rephrased using SQL Server equivalents (`GETDATE()` within persisted computed column or trigger) because check constraints cannot reference non-deterministic functions.

### 4. JSON Usage (Medium)
- Where `metadata JSONB` is used, confirm actual need for semi-structured data. SQL Server handles JSON as `NVARCHAR(MAX)` with `ISJSON` checks plus computed columns for indexing (`JSON_VALUE`, `OPENJSON`). Define helper indexes on frequently queried paths.
- Capture sample JSON payloads inside `docs/schema/examples/` to validate size expectations and key paths before enforcing constraints.

### 5. Auditing & Soft Deletes (Low)
- Some tables have `is_active` flags; ensure pattern is consistent (BIT type, default 1). If soft delete semantics are required, add `deleted_at DATETIME2 NULL` and filtered indexes.
- Logging tables (e.g., `inscripcion_estado_log`, `acreditacion_log`) should include trace columns (`created_by`, `origin_app`) per project audit requirements.

### 6. Payment Module Specifics (Medium)
- Monetary fields use `DECIMAL(10,2)`, which satisfies Chilean currency ranges. Consider `DECIMAL(12,2)` for long-term growth.
- `pago_batch.estado` enumerations should be enforced via lookup table or `CHECK` constraint using SQL Server syntax (`CONSTRAINT chk_pago_batch_estado CHECK (estado IN (...))`).

### 7. File Paths & Storage (Low)
- Columns such as `archivo_path VARCHAR(500)` should align with chosen storage provider (S3-compatible). Ensure length suffices (recommend `NVARCHAR(1024)`), and store canonical URLs instead of local paths if using cloud storage.

## Recommended Next Steps
1. **Generate SQL Server-compliant DDL** for the documented tables (preferably via Django migrations or an ER tool set to SQL Server target).
2. **Update architectural documentation** to reflect SQL Server syntax and capabilities, replacing PostgreSQL examples.
3. **Define schema versioning process** (e.g., maintain `database/migrations/sqlserver` folder with reviewed scripts).
4. **Validate JSON usage** in SQL Server by drafting sample queries leveraging `JSON_VALUE`/`OPENJSON` for analytics dashboards.
5. **Add indexing plan** document enumerating clustered/non-clustered indexes for each FK-heavy table (inscriptions, payments, accreditation).

### Remediation Tracker
| Step | Owner | Target Date | Notes |
| --- | --- | --- | --- |
| Draft SQL Server DDL scripts | Backend Team (Lucas G.) | 07-Oct-2025 | Base on current Django models; confirm identity strategy. |
| Update architecture dossier | Documentation Squad (Ricardo S.) | 09-Oct-2025 | Replace PostgreSQL code blocks with SQL Server syntax and diagrams. |
| Establish migration folder | DevOps (Giovanni P.) | 10-Oct-2025 | Add `database/sqlserver/` with versioned scripts + README. |
| JSON payload validation | Data Team (Marisol S.) | 14-Oct-2025 | Provide 3 sample payloads + indexing proposal. |

---
_Review compiled by GitHub Copilot on 1 Oct 2025._
