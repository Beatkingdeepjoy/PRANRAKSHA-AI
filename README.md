# PRANRAKSHA AI
### Predict Danger. Connect Help. Save Lives.

**PRANRAKSHA AI** is a production-oriented AI Emergency Intelligence, Live GPS Tracking, Disaster Prediction, and Rescue Coordination Platform designed for multi-agency disaster response (NDRF, SDRF, ASDMA, Civil Defence, and Indian Red Cross).

---

## 🌟 Key Features

1. **Public Website (`/`)**:
   - Hero section with live telemetry ticker, emergency disclaimer, response workflow, and interactive GIS preview.
2. **Citizen Protection Portal (`/citizen/dashboard`)**:
   - Accidental activation-protected **Emergency SOS button** (2-second hold).
   - Real browser device GPS accuracy radius tracking (`watchPosition`).
   - Detailed incident reporting with vulnerability details (elderly, infants, pregnant women, medical needs).
   - Nearest shelters and hospital ICU bed availability with live distance calculation.
   - **Journey Guardian (`/citizen/journey`)**: Periodic check-in countdown timer and missed check-in alert escalation.
3. **Rescue Team Terminal (`/team/dashboard`)**:
   - Dedicated interface for field rescue columns (NDRF 1st Bn, SDRF Assam, etc.).
   - Assignment queue, departure reporting ("En Route"), arrival ("On Scene"), and assistance completion verification.
4. **Emergency Command Centre (`/admin/command-center`)**:
   - Flagship operational dark navy layout matching the **Cobalt Sky** design system.
   - Live metrics: Total incidents, active emergencies, critical priority queue, teams dispatched, evacuees assisted.
   - Interactive GIS tactical map with colored incident pins, flood hazard polygons, and rescue columns.
   - Incident triage panel with AI priority recommendation scores.
   - Live streaming activity timeline.
5. **Real Road & Routing Intelligence (`/routes`)**:
   - Evaluates OpenStreetMap road vectors against flooded road segments and active landslides.
   - Issues warnings when routes pass within critical distance of extreme hazard zones.
6. **AI Disaster Intelligence (`/admin/intelligence`)**:
   - RoBERTa / Sentence-Transformer NLP classification.
   - DBSCAN spatial incident clustering (grouping calls within 500m radius).
   - Hydrological flood crest prediction against CWC danger marks.
7. **24-Module Full Administration Panel (`/admin`)**:
   - Overview, Incidents, Verification, AI Intelligence, Risk Prediction, Teams, Volunteers, Resources, Hospitals, Shelters, Roads, Hazards, Operations, Resolution, Analytics, Notifications, Users, Organizations, Audit Logs, API Integrations, Health, Settings.

---

## 🎨 Cobalt Sky Design System

- **Deep Navy**: `#071126`
- **Midnight Blue**: `#0B1736`
- **Primary Cobalt**: `#2563EB`
- **Electric Blue**: `#3B82F6`
- **Sky Blue**: `#60A5FA`
- **Pale Blue**: `#DBEAFE`
- **Ice Background**: `#F4F8FF`
- **Success Green**: `#16A34A`
- **Warning Amber**: `#F59E0B`
- **Critical Red**: `#DC2626`
- **Intelligence Purple**: `#8B5CF6`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

### 4. (Optional) Run the Python AI Microservice
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```
API runs on `http://localhost:8000`.

---

## 🔄 Dual Operation Modes

- **DEMO MODE (Default)**: Preloaded with realistic disaster scenarios for Assam & Northeast India (Brahmaputra river flood, Saraighat bridge inundation, Silchar medical emergency, Haflong landslide). Allows full end-to-end testing of SOS, dispatch, and resolution without external cloud dependencies.
- **REAL MODE**: Configurable via the toggle in the top bar or Settings. Connects to live Supabase PostgreSQL and PostGIS instances.

---

## 🛡️ Emergency Disclaimer
PRANRAKSHA AI is an intelligence and coordination network. It complements official emergency lines (`112`, `108`, `101`, `1070`/`1077`) and does not replace emergency response services.
