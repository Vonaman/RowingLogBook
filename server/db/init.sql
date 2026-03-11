-- =============================================================
-- Rowing Logbook — Initialisation de la base de données
-- PostgreSQL
-- =============================================================

-- Extension pour la génération d'UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- TYPES ÉNUMÉRÉS
-- =============================================================

CREATE TYPE member_role     AS ENUM ('ROWER', 'STAFF', 'ADMIN');
CREATE TYPE boat_condition  AS ENUM ('GOOD', 'WATCH', 'MAINTENANCE');
CREATE TYPE session_status  AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TYPE alert_channel   AS ENUM ('IN_APP', 'EMAIL');
CREATE TYPE token_type      AS ENUM ('INVITE', 'PASSWORD_RESET');

-- =============================================================
-- FONCTION utilitaire : mise à jour automatique de updated_at
-- =============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- TABLE : member
-- Représente un utilisateur du club (rameur, staff, admin)
-- La suppression est logique via deleted_at (RG-10)
-- =============================================================

CREATE TABLE member (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          member_role  NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMP    -- NULL = non supprimé (suppression logique)
);

CREATE TRIGGER trg_member_updated_at
    BEFORE UPDATE ON member
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- TABLE : boat
-- Représente un bateau disponible dans le club
-- is_active = FALSE → hors service, non sélectionnable (RG-07)
-- =============================================================

CREATE TABLE boat (
    id         UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100)     NOT NULL UNIQUE,
    type       VARCHAR(50)      NOT NULL,
    capacity   INTEGER          NOT NULL CHECK (capacity > 0),
    condition  boat_condition   NOT NULL DEFAULT 'GOOD',
    is_active  BOOLEAN          NOT NULL DEFAULT TRUE,
    notes      TEXT,
    created_at TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP        NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_boat_updated_at
    BEFORE UPDATE ON boat
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- TABLE : session (Sortie)
-- return_time NULL = sortie en cours (status IN_PROGRESS)
-- RG-01 : unicité d'un bateau en cours → contrainte applicative + index partiel
-- RG-02 : departure_time <= NOW() → vérifié côté application
-- RG-03 : return_time > departure_time → contrainte CHECK
-- =============================================================

CREATE TABLE session (
    id                   UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id              UUID            NOT NULL REFERENCES boat(id),
    responsible_id       UUID            NOT NULL REFERENCES member(id),
    departure_time       TIMESTAMP       NOT NULL,
    return_time          TIMESTAMP,
    planned_distance_km  DECIMAL(6,2)    NOT NULL CHECK (planned_distance_km > 0),
    actual_distance_km   DECIMAL(6,2)    CHECK (actual_distance_km > 0),
    route                TEXT,
    pre_remarks          TEXT,
    post_remarks         TEXT,
    status               session_status  NOT NULL DEFAULT 'IN_PROGRESS',
    created_at           TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_return_after_departure
        CHECK (return_time IS NULL OR return_time > departure_time)
);

CREATE TRIGGER trg_session_updated_at
    BEFORE UPDATE ON session
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index partiel : garantit qu'un bateau ne peut avoir qu'une seule sortie en cours (RG-01)
CREATE UNIQUE INDEX idx_session_boat_in_progress
    ON session (boat_id)
    WHERE status = 'IN_PROGRESS';

-- =============================================================
-- TABLE : session_crew (Équipage)
-- Table de jointure entre une sortie et ses membres d'équipage
-- =============================================================

CREATE TABLE session_crew (
    session_id UUID NOT NULL REFERENCES session(id) ON DELETE CASCADE,
    member_id  UUID NOT NULL REFERENCES member(id),
    PRIMARY KEY (session_id, member_id)
);

-- =============================================================
-- TABLE : alert (Alerte de sécurité)
-- Une entrée par destinataire et par canal (RG-08, RG-09)
-- =============================================================

CREATE TABLE alert (
    id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID          NOT NULL REFERENCES session(id),
    member_id  UUID          NOT NULL REFERENCES member(id),
    sent_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    is_read    BOOLEAN       NOT NULL DEFAULT FALSE,
    channel    alert_channel NOT NULL
);

-- =============================================================
-- TABLE : auth_token
-- Tokens à usage unique pour invitation et réinitialisation de mot de passe
-- (sections 8.3 et 8.4)
-- =============================================================

CREATE TABLE auth_token (
    id         UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id  UUID       NOT NULL REFERENCES member(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    type       token_type NOT NULL,
    expires_at TIMESTAMP  NOT NULL,
    used_at    TIMESTAMP, -- NULL = non utilisé
    created_at TIMESTAMP  NOT NULL DEFAULT NOW()
);

-- =============================================================
-- TABLE : refresh_token
-- Refresh tokens JWT (durée de vie 30 jours, section 8.1)
-- =============================================================

CREATE TABLE refresh_token (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id  UUID        NOT NULL REFERENCES member(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP   NOT NULL,
    revoked_at TIMESTAMP,  -- NULL = actif
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- =============================================================
-- INDEX DE PERFORMANCE
-- =============================================================

-- member
CREATE INDEX idx_member_email      ON member (email);
CREATE INDEX idx_member_is_active  ON member (is_active) WHERE deleted_at IS NULL;

-- session
CREATE INDEX idx_session_status         ON session (status);
CREATE INDEX idx_session_boat_id        ON session (boat_id);
CREATE INDEX idx_session_responsible_id ON session (responsible_id);
CREATE INDEX idx_session_departure_time ON session (departure_time DESC);

-- session_crew
CREATE INDEX idx_session_crew_member ON session_crew (member_id);

-- alert
CREATE INDEX idx_alert_member_unread ON alert (member_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_alert_session_id    ON alert (session_id);

-- auth_token
CREATE INDEX idx_auth_token_lookup ON auth_token (token) WHERE used_at IS NULL;

-- refresh_token
CREATE INDEX idx_refresh_token_lookup ON refresh_token (token) WHERE revoked_at IS NULL;
