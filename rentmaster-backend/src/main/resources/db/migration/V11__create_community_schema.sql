-- Community Schema

-- Tenant Communities
CREATE TABLE tenant_communities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    member_count INTEGER NOT NULL DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    property_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by BIGINT
);

-- Community Rules (collection table)
CREATE TABLE community_rules (
    community_id BIGINT NOT NULL REFERENCES tenant_communities(id) ON DELETE CASCADE,
    rule VARCHAR(500) NOT NULL
);

-- Community Moderators (collection table)
CREATE TABLE community_moderators (
    community_id BIGINT NOT NULL REFERENCES tenant_communities(id) ON DELETE CASCADE,
    moderator_name VARCHAR(255) NOT NULL
);

-- Community Posts
CREATE TABLE community_posts (
    id BIGSERIAL PRIMARY KEY,
    community_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_avatar VARCHAR(500),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    is_liked BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Post Tags (collection table)
CREATE TABLE post_tags (
    post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- Post Attachments (collection table)
CREATE TABLE post_attachments (
    post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    attachment_url VARCHAR(1000) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_tenant_communities_type ON tenant_communities(type);
CREATE INDEX idx_tenant_communities_property_id ON tenant_communities(property_id);
CREATE INDEX idx_tenant_communities_is_public ON tenant_communities(is_public);
CREATE INDEX idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_posts_type ON community_posts(type);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX idx_community_posts_is_pinned ON community_posts(is_pinned);

