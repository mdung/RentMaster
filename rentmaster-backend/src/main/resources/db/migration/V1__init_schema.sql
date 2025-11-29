CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    full_name   VARCHAR(200),
    email       VARCHAR(200),
    role        VARCHAR(50)         NOT NULL,
    active      BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE properties (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(500),
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE rooms (
    id          BIGSERIAL PRIMARY KEY,
    property_id BIGINT      NOT NULL REFERENCES properties (id),
    code        VARCHAR(100) NOT NULL,
    floor       VARCHAR(50),
    type        VARCHAR(100),
    size_m2     NUMERIC(10, 2),
    status      VARCHAR(50) NOT NULL,
    base_rent   NUMERIC(12, 2) NOT NULL,
    capacity    INT,
    notes       TEXT,
    CONSTRAINT uq_room_property_code UNIQUE (property_id, code)
);

CREATE TABLE tenants (
    id                 BIGSERIAL PRIMARY KEY,
    full_name          VARCHAR(255) NOT NULL,
    phone              VARCHAR(50),
    email              VARCHAR(200),
    id_number          VARCHAR(100),
    address            VARCHAR(500),
    emergency_contact  VARCHAR(500),
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE contracts (
    id                 BIGSERIAL PRIMARY KEY,
    code               VARCHAR(100) UNIQUE NOT NULL,
    room_id            BIGINT      NOT NULL REFERENCES rooms (id),
    primary_tenant_id  BIGINT      NOT NULL REFERENCES tenants (id),
    start_date         DATE        NOT NULL,
    end_date           DATE,
    rent_amount        NUMERIC(12, 2) NOT NULL,
    deposit_amount     NUMERIC(12, 2),
    billing_cycle      VARCHAR(50) NOT NULL,
    status             VARCHAR(50) NOT NULL,
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE contract_tenants (
    contract_id BIGINT NOT NULL REFERENCES contracts (id) ON DELETE CASCADE,
    tenant_id   BIGINT NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    PRIMARY KEY (contract_id, tenant_id)
);

CREATE TABLE services (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    type           VARCHAR(50)  NOT NULL,
    pricing_model  VARCHAR(50)  NOT NULL,
    unit_price     NUMERIC(12, 4),
    unit_name      VARCHAR(50),
    active         BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE contract_services (
    id           BIGSERIAL PRIMARY KEY,
    contract_id  BIGINT NOT NULL REFERENCES contracts (id) ON DELETE CASCADE,
    service_id   BIGINT NOT NULL REFERENCES services (id),
    custom_price NUMERIC(12, 4),
    active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE invoices (
    id            BIGSERIAL PRIMARY KEY,
    contract_id   BIGINT NOT NULL REFERENCES contracts (id),
    period_start  DATE   NOT NULL,
    period_end    DATE   NOT NULL,
    issue_date    DATE   NOT NULL,
    due_date      DATE   NOT NULL,
    total_amount  NUMERIC(12, 2) NOT NULL,
    status        VARCHAR(50)    NOT NULL,
    created_at    TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_items (
    id            BIGSERIAL PRIMARY KEY,
    invoice_id    BIGINT NOT NULL REFERENCES invoices (id) ON DELETE CASCADE,
    service_id    BIGINT REFERENCES services (id),
    description   VARCHAR(500),
    quantity      NUMERIC(12, 3) DEFAULT 1,
    unit_price    NUMERIC(12, 4),
    amount        NUMERIC(12, 2) NOT NULL,
    prev_index    NUMERIC(12, 3),
    current_index NUMERIC(12, 3)
);

CREATE TABLE payments (
    id           BIGSERIAL PRIMARY KEY,
    invoice_id   BIGINT NOT NULL REFERENCES invoices (id) ON DELETE CASCADE,
    amount       NUMERIC(12, 2) NOT NULL,
    paid_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    method       VARCHAR(50),
    note         VARCHAR(500)
);


