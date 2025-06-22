
-- Lägg till 5 fiktiva kunder
INSERT INTO customers (id, company_name, contact_name, role_title, email, phone, org_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'TechStart AB', 'Anna Andersson', 'VD', 'anna.andersson@techstart.se', '+46701234567', '556789-1234'),
('550e8400-e29b-41d4-a716-446655440002', 'FinanceFlow Solutions', 'Erik Eriksson', 'CTO', 'erik.eriksson@financeflow.se', '+46702345678', '559876-5432'),
('550e8400-e29b-41d4-a716-446655440003', 'GreenTech Innovations', 'Maria Johansson', 'Produktchef', 'maria.johansson@greentech.se', '+46703456789', '556543-2109'),
('550e8400-e29b-41d4-a716-446655440004', 'E-handel Nordic AB', 'Lars Larsson', 'IT-chef', 'lars.larsson@ehandel.se', '+46704567890', '558765-4321'),
('550e8400-e29b-41d4-a716-446655440005', 'HealthApp Sweden', 'Sara Nilsson', 'Grundare', 'sara.nilsson@healthapp.se', '+46705678901', '557654-3210');

-- Lägg till 10 fiktiva projekt (2 per kund)
INSERT INTO project_requirements (
  id, customer_id, project_description, technical_skills, experience_level, 
  employment_type, has_budget, project_type, industry_experience_required,
  start_date, project_duration, budget_amount, required_resources,
  security_requirements, project_risks, additional_comments, is_active
) VALUES
-- TechStart AB projekt
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 
 'Vi behöver utveckla en modern e-handelsplattform med React och Node.js. Plattformen ska hantera produktkataloger, kundkonton, beställningar och betalningar.', 
 'React, Node.js, PostgreSQL, Stripe API, REST API', 'medior',
 'full_time', true, 'fixed_price', false,
 '2024-02-01', '6 månader', '800000-1200000 SEK', 
 'Designteam, UX-expert, Projektledare',
 'PCI DSS compliance för betalningar, GDPR-hantering',
 'Teknisk skuld, integrationsutmaningar med befintliga system',
 'Vi föredrar agila arbetsmetoder och veckovisa avstämningar', true),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001',
 'Mobilapp för iOS och Android som integrerar med vår befintliga webbplattform. Behöver React Native-utvecklare med erfarenhet av push-notifikationer och offline-funktionalitet.',
 'React Native, TypeScript, Firebase, REST API, Push Notifications', 'senior',
 'part_time', true, 'hourly_based', false,
 '2024-03-15', '4 månader', '600-800 SEK/timme',
 'App Store-hantering, Testare',
 'Datasäkerhet, kryptering av lokal data',
 'App Store-godkännanden, plattformsspecifika buggar',
 'Flexibla arbetstider, möjlighet till remote work', true),

-- FinanceFlow Solutions projekt  
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002',
 'Utveckling av ett AI-drivet dashboard för finansiell analys. Systemet ska analysera stora datamängder och presentera insikter genom interaktiva visualiseringar.',
 'Python, Machine Learning, React, D3.js, PostgreSQL, AWS', 'senior',
 'full_time', true, 'fixed_price', true,
 '2024-01-20', '8 månader', '1500000-2000000 SEK',
 'Data Scientist, Cloud Architect, DevOps-ingenjör',
 'Finansiell data säkerhet, ISO 27001, bankregleringar',
 'Modellnoggrannhet, skalbarhet, regulatoriska förändringar',
 'Erfarenhet av finansbranschen är meriterande, säkerhetsclearance kan krävas', true),

('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002',
 'Migration av legacy-system till modern mikroservice-arkitektur. Behöver erfaren backend-utvecklare med expertis inom systemintegration och API-design.',
 'Java, Spring Boot, Docker, Kubernetes, Apache Kafka, MySQL', 'senior',
 'full_time', true, 'fixed_price', true,
 '2024-02-10', '12 månader', '2000000-2500000 SEK',
 'DevOps-team, Systemarkitekt, QA-team',
 'Zero-downtime migration, data integrity, backup-strategier',
 'Legacy kod-komplexitet, datamigrering, produktionsdriftstörningar',
 'Stegvis migration krävs, omfattande testning och dokumentation', true),

-- GreenTech Innovations projekt
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003',
 'IoT-plattform för övervakning av solpanelsanläggningar. Realtidsdashboard med Vue.js frontend och Node.js API för att hantera sensordata från tusentals enheter.',
 'Vue.js, Node.js, MongoDB, MQTT, InfluxDB, Time Series Data', 'medior',
 'full_time', true, 'hourly_based', false,
 '2024-03-01', '10 månader', '700-900 SEK/timme',
 'Hardware-team, Data Engineer, UX Designer',
 'IoT-säkerhet, dataencryption, deviceautentisering',
 'Skalbarhet vid många samtidiga anslutningar, nätverksstabilitet',
 'Miljöteknikintresse är en fördel, möjlighet till remote work', true),

('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003',
 'Blockchain-baserad plattform för koldioxidkompensation och handel med utsläppsrätter. Behöver utvecklare med erfarenhet av smart contracts och Web3.',
 'Solidity, Web3.js, Ethereum, React, Node.js, IPFS', 'senior',
 'part_time', true, 'fixed_price', false,
 '2024-04-01', '6 månader', '1000000-1400000 SEK',
 'Blockchain Consultant, Smart Contract Auditor',
 'Smart contract säkerhet, audit requirements, regulatory compliance',
 'Blockchain skalbarhet, gas fees, regulatorisk osäkerhet',
 'Pioneering projekt inom sustainability tech, stor potential för framtida partnerskap', true),

-- E-handel Nordic AB projekt
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004',
 'Ombyggnad av befintlig e-handelsplattform till headless commerce-arkitektur. Frontend i Next.js med Shopify Plus som backend. Fokus på prestanda och SEO.',
 'Next.js, TypeScript, Shopify Plus API, GraphQL, Tailwind CSS', 'medior',
 'full_time', true, 'fixed_price', false,
 '2024-02-20', '5 månader', '600000-900000 SEK',
 'SEO-specialist, Performance Engineer, Content Manager',
 'GDPR compliance, säker betalningshantering, PII-skydd',
 'SEO-påverkan under migration, performance optimization',
 'E-handelsexpertis viktigt, erfarenhet av headless arkitektur meriterande', true),

('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004',
 'AI-driven produktrekommendationsmotor och personalisering. Machine learning-algoritmer för att förbättra kundupplevelsen och öka försäljningen.',
 'Python, TensorFlow, Pandas, Flask, Redis, Elasticsearch', 'senior',
 'part_time', true, 'hourly_based', false,
 '2024-03-10', '7 månader', '800-1000 SEK/timme',
 'Data Scientist, ML Engineer, Analytics Team',
 'Kunddata privacy, GDPR compliance, anonymisering',
 'Datakvalietet, modell bias, A/B testing komplexitet',
 'Retail analytics bakgrund fördelaktigt, fokus på resultatmätning', true),

-- HealthApp Sweden projekt
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005',
 'Säker hälsoapp med React Native för patientdata och läkarkommunikation. HIPAA-kompatibel arkitektur med end-to-end kryptering och biometrisk autentisering.',
 'React Native, TypeScript, FHIR, HL7, Biometric Auth, End-to-End Encryption', 'senior',
 'full_time', true, 'fixed_price', true,
 '2024-01-15', '9 månader', '1200000-1600000 SEK',
 'Healthcare IT Specialist, Security Consultant, Regulatory Affairs',
 'HIPAA compliance, MDR regulations, patient data protection',
 'Regulatory approval, data breach risks, interoperability challenges',
 'Hälso-IT erfarenhet kritisk, säkerhetsclearance kan krävas', true),

('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005',
 'Telemedicin-plattform med videokonsultationer och AI-diagnostikstöd. WebRTC för videosamtal och machine learning för preliminär symptomanalys.',
 'WebRTC, Socket.io, Node.js, Python, Computer Vision, React', 'medior',
 'full_time', true, 'hourly_based', true,
 '2024-02-25', '8 månader', '750-950 SEK/timme',
 'Medical AI Specialist, Video Technology Expert, UX Researcher',
 'Medical device regulations, patient confidentiality, data encryption',
 'AI diagnostic accuracy, real-time communication stability, regulatory compliance',
 'Medicinsk bakgrund eller hälso-IT erfarenhet starkt meriterande', true);

-- Lägg till 5 fiktiva utvecklare
INSERT INTO developers (
  id, first_name, last_name, email, phone, experience_level, years_of_experience,
  technical_skills, cv_summary, location, hourly_rate, available_for_work,
  preferred_employment_types, github_url, linkedin_url, portfolio_url,
  languages, certifications, education, ai_generated_title, is_approved
) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Johan', 'Svensson', 'johan.svensson@email.se', '+46706123456', 'senior', 8,
 ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'], 
 'Erfaren fullstack-utvecklare med 8 års erfarenhet av moderna webblösningar. Specialist på React-ekosystemet och skalbar backend-arkitektur. Har lett flera framgångsrika projekt från koncept till produktion.',
 'Stockholm', 850, true, ARRAY['full_time', 'part_time']::employment_type[],
 'https://github.com/johansvensson', 'https://linkedin.com/in/johansvensson', 'https://johansvensson.dev',
 ARRAY['Svenska', 'Engelska'], ARRAY['AWS Certified Solutions Architect', 'React Expert Certification'],
 'Civilingenjör Datateknik, KTH Stockholm', 'Senior Fullstack-utvecklare specialiserad på React och Node.js', true),

('770e8400-e29b-41d4-a716-446655440002', 'Emma', 'Lindberg', 'emma.lindberg@email.se', '+46707234567', 'medior', 5,
 ARRAY['Vue.js', 'Python', 'Django', 'PostgreSQL', 'MQTT', 'IoT'], 
 'Frontend-fokuserad utvecklare med stark backend-kunskap. Specialiserad på Vue.js och IoT-integration. Passionerad för ren kod och användarvänliga gränssnitt.',
 'Göteborg', 650, true, ARRAY['full_time', 'hourly']::employment_type[],
 'https://github.com/emmalindberg', 'https://linkedin.com/in/emmalindberg', 'https://emmalindberg.se',
 ARRAY['Svenska', 'Engelska', 'Tyska'], ARRAY['Vue.js Certified Developer'],
 'Kandidat Systemvetenskap, Göteborgs Universitet', 'Frontend-utvecklare med Vue.js och IoT-expertis', true),

('770e8400-e29b-41d4-a716-446655440003', 'Marcus', 'Andersson', 'marcus.andersson@email.se', '+46708345678', 'senior', 10,
 ARRAY['Java', 'Spring Boot', 'Kubernetes', 'Docker', 'Apache Kafka', 'MySQL'], 
 'Backend-arkitekt med djup erfarenhet av enterprise-system och mikroservices. Expert på Java-ekosystemet och cloud-native lösningar. Har designat system för miljontals användare.',
 'Malmö', 900, true, ARRAY['full_time']::employment_type[],
 'https://github.com/marcusandersson', 'https://linkedin.com/in/marcusandersson', 'https://marcusandersson.tech',
 ARRAY['Svenska', 'Engelska'], ARRAY['Java EE Expert', 'Kubernetes Administrator', 'Spring Professional'],
 'Civilingenjör Software Engineering, Lunds Universitet', 'Senior Backend-arkitekt specialiserad på Java och mikroservices', true),

('770e8400-e29b-41d4-a716-446655440004', 'Lisa', 'Karlsson', 'lisa.karlsson@email.se', '+46709456789', 'senior', 7,
 ARRAY['Python', 'Machine Learning', 'TensorFlow', 'React', 'AWS', 'Data Science'], 
 'AI/ML-ingenjör med stark bakgrund inom data science och webbutveckling. Specialist på att bygga intelligenta system och implementera machine learning i produktionsmiljöer.',
 'Stockholm', 950, true, ARRAY['full_time', 'part_time']::employment_type[],
 'https://github.com/lisakarlsson', 'https://linkedin.com/in/lisakarlsson', 'https://lisakarlsson.ai',
 ARRAY['Svenska', 'Engelska'], ARRAY['TensorFlow Developer Certificate', 'AWS Machine Learning Specialty'],
 'MSc Data Science, Stockholms Universitet', 'AI/ML-ingenjör med expertis inom TensorFlow och data science', true),

('770e8400-e29b-41d4-a716-446655440005', 'Alexander', 'Nilsson', 'alexander.nilsson@email.se', '+46700567890', 'medior', 4,
 ARRAY['React Native', 'TypeScript', 'Firebase', 'Solidity', 'Web3.js', 'Blockchain'], 
 'Mobilutvecklare med fokus på React Native och emerging technologies. Stor passion för blockchain och Web3-utveckling. Skapar användarvänliga mobilupplevelser.',
 'Uppsala', 600, true, ARRAY['full_time', 'part_time', 'hourly']::employment_type[],
 'https://github.com/alexandernilsson', 'https://linkedin.com/in/alexandernilsson', 'https://alexandernilsson.dev',
 ARRAY['Svenska', 'Engelska'], ARRAY['React Native Certified', 'Ethereum Developer Bootcamp'],
 'Kandidat Datavetenskap, Uppsala Universitet', 'Mobilutvecklare specialiserad på React Native och blockchain', true);
