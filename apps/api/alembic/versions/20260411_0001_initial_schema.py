"""initial schema

Revision ID: 20260411_0001
Revises:
Create Date: 2026-04-11 15:30:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260411_0001"
down_revision = None
branch_labels = None
depends_on = None


user_role_enum = sa.Enum(
    "developer_admin",
    "developer_viewer",
    "buyer",
    "verity_admin",
    "verity_analyst",
    name="user_role",
    native_enum=False,
    create_constraint=True,
)

verification_status_enum = sa.Enum(
    "uploaded",
    "under_review",
    "ai_processing",
    "analyst_review",
    "verified",
    "flagged",
    name="verification_status",
    native_enum=False,
    create_constraint=True,
)


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("cac_registration_number", sa.String(length=100), nullable=False),
        sa.Column("contact_name", sa.String(length=255), nullable=False),
        sa.Column("contact_email", sa.String(length=255), nullable=False),
        sa.Column("contact_phone", sa.String(length=50), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("billing_plan", sa.String(length=50), nullable=False),
        sa.Column("billing_cycle", sa.String(length=50), nullable=False),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_companies")),
        sa.UniqueConstraint("cac_registration_number", name=op.f("uq_companies_cac_registration_number")),
        sa.UniqueConstraint("contact_email", name=op.f("uq_companies_contact_email")),
    )
    op.create_index(op.f("ix_companies_cac_registration_number"), "companies", ["cac_registration_number"], unique=False)
    op.create_index(op.f("ix_companies_contact_email"), "companies", ["contact_email"], unique=False)

    op.create_table(
        "users",
        sa.Column("company_id", sa.String(length=36), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("phone_number", sa.String(length=50), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("role", user_role_enum, nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_email_verified", sa.Boolean(), nullable=False),
        sa.Column("otp_code", sa.String(length=10), nullable=True),
        sa.Column("otp_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], name=op.f("fk_users_company_id_companies")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_users")),
        sa.UniqueConstraint("email", name=op.f("uq_users_email")),
    )
    op.create_index(op.f("ix_users_company_id"), "users", ["company_id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=False)

    op.create_table(
        "properties",
        sa.Column("company_id", sa.String(length=36), nullable=False),
        sa.Column("created_by_user_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("address", sa.String(length=500), nullable=False),
        sa.Column("lga", sa.String(length=120), nullable=False),
        sa.Column("state", sa.String(length=120), nullable=False),
        sa.Column("property_type", sa.String(length=50), nullable=False),
        sa.Column("title_type", sa.String(length=100), nullable=False),
        sa.Column("verification_status", verification_status_enum, nullable=False),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], name=op.f("fk_properties_company_id_companies")),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"], name=op.f("fk_properties_created_by_user_id_users")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_properties")),
    )
    op.create_index(op.f("ix_properties_company_id"), "properties", ["company_id"], unique=False)
    op.create_index(op.f("ix_properties_created_by_user_id"), "properties", ["created_by_user_id"], unique=False)

    op.create_table(
        "orders",
        sa.Column("user_id", sa.String(length=36), nullable=True),
        sa.Column("property_id", sa.String(length=36), nullable=True),
        sa.Column("buyer_name", sa.String(length=255), nullable=False),
        sa.Column("buyer_email", sa.String(length=255), nullable=False),
        sa.Column("property_address", sa.String(length=500), nullable=False),
        sa.Column("tier", sa.String(length=50), nullable=False),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=10), nullable=False),
        sa.Column("payment_provider", sa.String(length=50), nullable=False),
        sa.Column("payment_reference", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], name=op.f("fk_orders_property_id_properties")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_orders_user_id_users")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_orders")),
        sa.UniqueConstraint("payment_reference", name=op.f("uq_orders_payment_reference")),
    )
    op.create_index(op.f("ix_orders_buyer_email"), "orders", ["buyer_email"], unique=False)
    op.create_index(op.f("ix_orders_payment_reference"), "orders", ["payment_reference"], unique=False)
    op.create_index(op.f("ix_orders_property_id"), "orders", ["property_id"], unique=False)
    op.create_index(op.f("ix_orders_user_id"), "orders", ["user_id"], unique=False)

    op.create_table(
        "documents",
        sa.Column("property_id", sa.String(length=36), nullable=False),
        sa.Column("uploaded_by_user_id", sa.String(length=36), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_type", sa.String(length=50), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("s3_key", sa.String(length=500), nullable=False),
        sa.Column("upload_status", sa.String(length=50), nullable=False),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], name=op.f("fk_documents_property_id_properties")),
        sa.ForeignKeyConstraint(["uploaded_by_user_id"], ["users.id"], name=op.f("fk_documents_uploaded_by_user_id_users")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_documents")),
        sa.UniqueConstraint("s3_key", name=op.f("uq_documents_s3_key")),
    )
    op.create_index(op.f("ix_documents_property_id"), "documents", ["property_id"], unique=False)
    op.create_index(op.f("ix_documents_uploaded_by_user_id"), "documents", ["uploaded_by_user_id"], unique=False)

    op.create_table(
        "verification_jobs",
        sa.Column("property_id", sa.String(length=36), nullable=True),
        sa.Column("order_id", sa.String(length=36), nullable=True),
        sa.Column("document_id", sa.String(length=36), nullable=True),
        sa.Column("analyst_id", sa.String(length=36), nullable=True),
        sa.Column("status", verification_status_enum, nullable=False),
        sa.Column("extracted_data", sa.JSON(), nullable=True),
        sa.Column("confidence_summary", sa.JSON(), nullable=True),
        sa.Column("analyst_notes", sa.String(length=1000), nullable=True),
        sa.Column("risk_rating", sa.String(length=50), nullable=True),
        sa.Column("dispatch_attempts", sa.Integer(), nullable=False),
        sa.Column("last_dispatch_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("queued_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_dispatch_error", sa.String(length=1000), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], name=op.f("fk_verification_jobs_order_id_orders")),
        sa.ForeignKeyConstraint(["analyst_id"], ["users.id"], name=op.f("fk_verification_jobs_analyst_id_users")),
        sa.ForeignKeyConstraint(["document_id"], ["documents.id"], name=op.f("fk_verification_jobs_document_id_documents")),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], name=op.f("fk_verification_jobs_property_id_properties")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_verification_jobs")),
    )
    op.create_index(op.f("ix_verification_jobs_analyst_id"), "verification_jobs", ["analyst_id"], unique=False)
    op.create_index(op.f("ix_verification_jobs_document_id"), "verification_jobs", ["document_id"], unique=False)
    op.create_index(op.f("ix_verification_jobs_order_id"), "verification_jobs", ["order_id"], unique=False)
    op.create_index(op.f("ix_verification_jobs_property_id"), "verification_jobs", ["property_id"], unique=False)

    op.create_table(
        "reports",
        sa.Column("property_id", sa.String(length=36), nullable=False),
        sa.Column("verification_job_id", sa.String(length=36), nullable=False),
        sa.Column("order_id", sa.String(length=36), nullable=True),
        sa.Column("reference_number", sa.String(length=100), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("tier", sa.String(length=50), nullable=False),
        sa.Column("pdf_s3_key", sa.String(length=500), nullable=False),
        sa.Column("public_verification_slug", sa.String(length=255), nullable=False),
        sa.Column("executive_summary", sa.String(length=1000), nullable=False),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], name=op.f("fk_reports_order_id_orders")),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], name=op.f("fk_reports_property_id_properties")),
        sa.ForeignKeyConstraint(["verification_job_id"], ["verification_jobs.id"], name=op.f("fk_reports_verification_job_id_verification_jobs")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_reports")),
        sa.UniqueConstraint("public_verification_slug", name=op.f("uq_reports_public_verification_slug")),
        sa.UniqueConstraint("reference_number", name=op.f("uq_reports_reference_number")),
    )
    op.create_index(op.f("ix_reports_order_id"), "reports", ["order_id"], unique=False)
    op.create_index(op.f("ix_reports_property_id"), "reports", ["property_id"], unique=False)
    op.create_index(op.f("ix_reports_public_verification_slug"), "reports", ["public_verification_slug"], unique=False)
    op.create_index(op.f("ix_reports_reference_number"), "reports", ["reference_number"], unique=False)
    op.create_index(op.f("ix_reports_verification_job_id"), "reports", ["verification_job_id"], unique=False)

    op.create_table(
        "audit_logs",
        sa.Column("actor_user_id", sa.String(length=36), nullable=True),
        sa.Column("action", sa.String(length=255), nullable=False),
        sa.Column("entity_type", sa.String(length=100), nullable=False),
        sa.Column("entity_id", sa.String(length=36), nullable=False),
        sa.Column("ip_address", sa.String(length=100), nullable=True),
        sa.Column("user_agent", sa.String(length=255), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["actor_user_id"], ["users.id"], name=op.f("fk_audit_logs_actor_user_id_users")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_audit_logs")),
    )
    op.create_index(op.f("ix_audit_logs_actor_user_id"), "audit_logs", ["actor_user_id"], unique=False)
    op.create_index(op.f("ix_audit_logs_entity_id"), "audit_logs", ["entity_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_audit_logs_entity_id"), table_name="audit_logs")
    op.drop_index(op.f("ix_audit_logs_actor_user_id"), table_name="audit_logs")
    op.drop_table("audit_logs")

    op.drop_index(op.f("ix_reports_verification_job_id"), table_name="reports")
    op.drop_index(op.f("ix_reports_reference_number"), table_name="reports")
    op.drop_index(op.f("ix_reports_public_verification_slug"), table_name="reports")
    op.drop_index(op.f("ix_reports_property_id"), table_name="reports")
    op.drop_index(op.f("ix_reports_order_id"), table_name="reports")
    op.drop_table("reports")

    op.drop_index(op.f("ix_verification_jobs_property_id"), table_name="verification_jobs")
    op.drop_index(op.f("ix_verification_jobs_order_id"), table_name="verification_jobs")
    op.drop_index(op.f("ix_verification_jobs_document_id"), table_name="verification_jobs")
    op.drop_index(op.f("ix_verification_jobs_analyst_id"), table_name="verification_jobs")
    op.drop_table("verification_jobs")

    op.drop_index(op.f("ix_documents_uploaded_by_user_id"), table_name="documents")
    op.drop_index(op.f("ix_documents_property_id"), table_name="documents")
    op.drop_table("documents")

    op.drop_index(op.f("ix_orders_user_id"), table_name="orders")
    op.drop_index(op.f("ix_orders_property_id"), table_name="orders")
    op.drop_index(op.f("ix_orders_payment_reference"), table_name="orders")
    op.drop_index(op.f("ix_orders_buyer_email"), table_name="orders")
    op.drop_table("orders")

    op.drop_index(op.f("ix_properties_created_by_user_id"), table_name="properties")
    op.drop_index(op.f("ix_properties_company_id"), table_name="properties")
    op.drop_table("properties")

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_company_id"), table_name="users")
    op.drop_table("users")

    op.drop_index(op.f("ix_companies_contact_email"), table_name="companies")
    op.drop_index(op.f("ix_companies_cac_registration_number"), table_name="companies")
    op.drop_table("companies")
