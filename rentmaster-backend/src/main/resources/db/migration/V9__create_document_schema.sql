-- Document Management Schema

-- Document Templates
CREATE TABLE document_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    created_by BIGINT NOT NULL,
    created_by_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Document Template Variables (collection table)
CREATE TABLE document_template_variables (
    template_id BIGINT NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
    variable_name VARCHAR(255) NOT NULL
);

-- Document Folders
CREATE TABLE document_folders (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_folder_id BIGINT,
    path VARCHAR(500) NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    can_read BOOLEAN DEFAULT TRUE,
    can_write BOOLEAN DEFAULT TRUE,
    can_delete BOOLEAN DEFAULT TRUE,
    document_count INTEGER NOT NULL DEFAULT 0,
    subfolder_count INTEGER NOT NULL DEFAULT 0,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    related_entity_type VARCHAR(100),
    related_entity_id BIGINT,
    tenant_id BIGINT,
    property_id BIGINT,
    contract_id BIGINT,
    uploaded_by BIGINT NOT NULL,
    uploaded_by_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    requires_signature BOOLEAN NOT NULL DEFAULT FALSE,
    signature_status VARCHAR(50) NOT NULL DEFAULT 'NOT_REQUIRED',
    expiry_date TIMESTAMP,
    version INTEGER NOT NULL DEFAULT 1,
    parent_document_id BIGINT,
    folder_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Document Tags (collection table)
CREATE TABLE document_tags (
    document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- Document Versions
CREATE TABLE document_versions (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,
    version INTEGER NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_size BIGINT NOT NULL,
    change_description TEXT,
    uploaded_by BIGINT NOT NULL,
    uploaded_by_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Document Signatures
CREATE TABLE document_signatures (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,
    signer_name VARCHAR(255) NOT NULL,
    signer_email VARCHAR(255) NOT NULL,
    signer_role VARCHAR(50) NOT NULL,
    signature_data TEXT,
    signed_at TIMESTAMP,
    ip_address VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    signature_request_sent_at TIMESTAMP,
    expires_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bulk Document Generations
CREATE TABLE bulk_document_generations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_id BIGINT NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    total_documents INTEGER NOT NULL DEFAULT 0,
    generated_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    output_format VARCHAR(50) NOT NULL DEFAULT 'PDF',
    created_by BIGINT NOT NULL,
    created_by_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_message TEXT
);

-- Bulk Generation Recipients (collection table)
CREATE TABLE bulk_generation_recipients (
    bulk_generation_id BIGINT NOT NULL REFERENCES bulk_document_generations(id) ON DELETE CASCADE,
    recipient_id BIGINT NOT NULL
);

-- Bulk Generation Variables (collection table)
CREATE TABLE bulk_generation_variables (
    bulk_generation_id BIGINT NOT NULL REFERENCES bulk_document_generations(id) ON DELETE CASCADE,
    variable_key VARCHAR(255) NOT NULL,
    variable_value TEXT,
    PRIMARY KEY (bulk_generation_id, variable_key)
);

-- Indexes for performance
CREATE INDEX idx_document_templates_template_type ON document_templates(template_type);
CREATE INDEX idx_document_templates_active ON document_templates(active);
CREATE INDEX idx_document_folders_parent ON document_folders(parent_folder_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX idx_documents_property_id ON documents(property_id);
CREATE INDEX idx_documents_contract_id ON documents(contract_id);
CREATE INDEX idx_documents_folder_id ON documents(folder_id);
CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_document_signatures_document_id ON document_signatures(document_id);
CREATE INDEX idx_document_signatures_status ON document_signatures(status);
CREATE INDEX idx_bulk_document_generations_status ON bulk_document_generations(status);
CREATE INDEX idx_bulk_document_generations_template_id ON bulk_document_generations(template_id);
CREATE INDEX idx_bulk_document_generations_created_by ON bulk_document_generations(created_by);
CREATE INDEX idx_bulk_document_generations_created_at ON bulk_document_generations(created_at);
CREATE INDEX idx_bulk_generation_recipients_bulk_id ON bulk_generation_recipients(bulk_generation_id);

