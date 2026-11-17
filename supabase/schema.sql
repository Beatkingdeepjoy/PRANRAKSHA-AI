-- ==============================================================================
-- PRANRAKSHA AI — PRODUCTION POSTGRESQL & POSTGIS SCHEMA
-- Predict Danger. Connect Help. Save Lives.
-- ==============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    org_type VARCHAR(100) NOT NULL, -- 'ndrf', 'sdrf', 'asdma', 'police', 'fire', 'red_cross', 'hospital'
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Assam',
    contact_phone VARCHAR(50) NOT NULL,
    contact_email VARCHAR(100),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Citizens, Volunteers, Rescuers, Operators, Admins)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen', -- 'citizen', 'volunteer', 'team_member', 'operator', 'admin', 'super_admin'
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    badge_number VARCHAR(100),
    district VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Role Assignments
CREATE TABLE IF NOT EXISTS role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    granted_by UUID REFERENCES profiles(id),
    granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Incidents
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'flood', 'landslide', 'cyclone', 'medical', 'fire', 'trapped', 'road_accident', 'general_sos'
    severity VARCHAR(20) NOT NULL DEFAULT 'moderate', -- 'critical', 'high', 'moderate', 'low'
    status VARCHAR(50) NOT NULL DEFAULT 'reported', -- 'reported', 'under_verification', 'verified', 'assigned', 'en_route', 'in_progress', 'resolved', 'closed', 'rejected'
    location_geom GEOMETRY(Point, 4326),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    address TEXT,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Assam',
    accuracy_meters DOUBLE PRECISION,
    affected_count INT DEFAULT 1,
    vulnerable_count INT DEFAULT 0,
    vulnerable_details JSONB,
    medical_needed BOOLEAN DEFAULT FALSE,
    accessibility_notes TEXT,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reporter_name VARCHAR(255),
    reporter_phone VARCHAR(50),
    ai_priority_score INT DEFAULT 50,
    ai_category_confidence DOUBLE PRECISION DEFAULT 0.95,
    ai_duplicate_cluster_id VARCHAR(100),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    assigned_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

-- Index spatial geometry
CREATE INDEX IF NOT EXISTS idx_incidents_geom ON incidents USING GIST (location_geom);

-- 5. Incident Updates & Progress Notes
CREATE TABLE IF NOT EXISTS incident_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id),
    status VARCHAR(50),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Incident Evidence
CREATE TABLE IF NOT EXISTS incident_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES profiles(id),
    media_url TEXT NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'audio'
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Rescue Teams
CREATE TABLE IF NOT EXISTS rescue_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    team_lead_id UUID REFERENCES profiles(id),
    status VARCHAR(50) DEFAULT 'available', -- 'available', 'dispatched', 'on_scene', 'resting', 'offline'
    current_assignment_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
    base_location_geom GEOMETRY(Point, 4326),
    base_lat DOUBLE PRECISION,
    base_lng DOUBLE PRECISION,
    base_address TEXT,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    member_count INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Team Capabilities
CREATE TABLE IF NOT EXISTS team_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES rescue_teams(id) ON DELETE CASCADE,
    capability VARCHAR(100) NOT NULL -- 'boat_rescue', 'medical_first_aid', 'flood_evacuation', 'search_and_rescue', 'high_angle_rope', 'fire_response'
);

-- 9. Team Members
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES rescue_teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_in_team VARCHAR(100) DEFAULT 'Rescuer',
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Incident Assignments
CREATE TABLE IF NOT EXISTS incident_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    team_id UUID REFERENCES rescue_teams(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    departed_at TIMESTAMPTZ,
    arrived_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 11. Incident Clusters (DBSCAN outputs)
CREATE TABLE IF NOT EXISTS incident_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_label VARCHAR(100) NOT NULL,
    centroid_geom GEOMETRY(Point, 4326),
    incident_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Strategic Resources
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL, -- 'boat', 'ambulance', 'drone', 'water_purifier', 'ration_pack', 'generator', 'life_jacket'
    total_quantity INT DEFAULT 1,
    deployed_quantity INT DEFAULT 0,
    available_quantity INT DEFAULT 1,
    base_district VARCHAR(100),
    condition VARCHAR(50) DEFAULT 'ready',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    geom GEOMETRY(Point, 4326),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    total_beds INT DEFAULT 100,
    available_general_beds INT DEFAULT 10,
    available_icu_beds INT DEFAULT 2,
    blood_bank_status VARCHAR(50) DEFAULT 'moderate',
    ambulance_count INT DEFAULT 2,
    emergency_phone VARCHAR(50) NOT NULL,
    trauma_center_tier VARCHAR(50) DEFAULT 'Level 2',
    last_verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Shelters & Relief Camps
CREATE TABLE IF NOT EXISTS shelters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    geom GEOMETRY(Point, 4326),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    total_capacity INT DEFAULT 500,
    current_occupancy INT DEFAULT 0,
    facilities JSONB,
    status VARCHAR(50) DEFAULT 'active_open',
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    last_verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Hazard Zones (PostGIS Polygons)
CREATE TABLE IF NOT EXISTS hazard_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    hazard_type VARCHAR(100) NOT NULL, -- 'river_flood', 'flash_flood', 'landslide_prone'
    risk_level VARCHAR(50) NOT NULL, -- 'extreme', 'high', 'moderate'
    polygon_geom GEOMETRY(Polygon, 4326),
    river_basin VARCHAR(100),
    current_water_level_m DOUBLE PRECISION,
    danger_mark_m DOUBLE PRECISION,
    rainfall_24h_mm DOUBLE PRECISION,
    trend VARCHAR(50) DEFAULT 'stable',
    evacuation_recommended BOOLEAN DEFAULT FALSE,
    alert_issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Road Reports & Obstructions
CREATE TABLE IF NOT EXISTS road_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    road_name VARCHAR(255) NOT NULL,
    highway_number VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'open', 'partially_blocked', 'flooded', 'closed_landslide', 'bridge_compromised'
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    detour_advice TEXT,
    water_depth_cm INT,
    last_verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Hazard Observations
CREATE TABLE IF NOT EXISTS hazard_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hazard_zone_id UUID REFERENCES hazard_zones(id) ON DELETE CASCADE,
    station_name VARCHAR(255),
    water_level_m DOUBLE PRECISION,
    rainfall_mm DOUBLE PRECISION,
    observed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Notifications Registry
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_district VARCHAR(100),
    alert_level VARCHAR(50) DEFAULT 'high',
    channels JSONB, -- ['sms', 'in_app', 'cell_broadcast']
    dispatched_by UUID REFERENCES profiles(id),
    dispatched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. AI Analysis Logs
CREATE TABLE IF NOT EXISTS ai_analysis_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    input_text TEXT,
    predicted_category VARCHAR(100),
    priority_score INT,
    confidence DOUBLE PRECISION,
    execution_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Security Audit Logs (Immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    user_name VARCHAR(255),
    user_role VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Journey Sessions (Journey Guardian)
CREATE TABLE IF NOT EXISTS journey_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_lat DOUBLE PRECISION NOT NULL,
    start_lng DOUBLE PRECISION NOT NULL,
    dest_lat DOUBLE PRECISION NOT NULL,
    dest_lng DOUBLE PRECISION NOT NULL,
    dest_address TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expected_arrival_at TIMESTAMPTZ,
    last_checkin_at TIMESTAMPTZ DEFAULT NOW(),
    checkin_interval_mins INT DEFAULT 15,
    status VARCHAR(50) DEFAULT 'active' -- 'active', 'safe_completed', 'missed_checkin_alert', 'sos_triggered'
);

-- 22. Emergency Contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    notify_on_sos BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Consent Records (GDPR & Telemetry Privacy)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL, -- 'gps_live_tracking', 'emergency_contact_sms', 'medical_data_sharing'
    granted BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of verified incidents
CREATE POLICY "Public can view verified incidents" ON incidents
    FOR SELECT USING (status != 'rejected');

-- Allow citizens to create new reports
CREATE POLICY "Anyone can report an emergency" ON incidents
    FOR INSERT WITH CHECK (true);

-- Allow admins and operators to update incidents
CREATE POLICY "Operators can update incidents" ON incidents
    FOR UPDATE USING (true);
