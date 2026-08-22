from datetime import datetime, timedelta
from database import Base, SessionLocal, engine
from dependencies import get_password_hash
import models


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(models.City).first():
            print("Database already contains seed data.")
            return

        print("Seeding initial data...")

        # ==========================================
        # 1. USERS (5 demo users + 1 admin)
        # ==========================================
        users = {
            "ada": models.User(
                id="u1000000-0000-0000-0000-000000000001",
                email="ada@example.com",
                name="Ada Lovelace",
                hashed_password=get_password_hash("password123"),
                photo_url="https://i.pravatar.cc/150?u=ada",
                language_preference="en",
                is_admin=False,
                created_at=datetime.utcnow() - timedelta(days=45),
            ),
            "marco": models.User(
                id="u1000000-0000-0000-0000-000000000002",
                email="marco@example.com",
                name="Marco Polo",
                hashed_password=get_password_hash("password123"),
                photo_url="https://i.pravatar.cc/150?u=marco",
                language_preference="en",
                is_admin=False,
                created_at=datetime.utcnow() - timedelta(days=30),
            ),
            "sakura": models.User(
                id="u1000000-0000-0000-0000-000000000003",
                email="sakura@example.com",
                name="Sakura Tanaka",
                hashed_password=get_password_hash("password123"),
                photo_url="https://i.pravatar.cc/150?u=sakura",
                language_preference="en",
                is_admin=False,
                created_at=datetime.utcnow() - timedelta(days=20),
            ),
            "priya": models.User(
                id="u1000000-0000-0000-0000-000000000004",
                email="priya@example.com",
                name="Priya Sharma",
                hashed_password=get_password_hash("password123"),
                photo_url="https://i.pravatar.cc/150?u=priya",
                language_preference="hi",
                is_admin=False,
                created_at=datetime.utcnow() - timedelta(days=10),
            ),
            "elena": models.User(
                id="u1000000-0000-0000-0000-000000000005",
                email="elena@example.com",
                name="Elena García",
                hashed_password=get_password_hash("password123"),
                photo_url="https://i.pravatar.cc/150?u=elena",
                language_preference="es",
                is_admin=False,
                created_at=datetime.utcnow() - timedelta(days=5),
            ),
            "admin": models.User(
                id="u1000000-0000-0000-0000-000000000099",
                email="admin@globetrotter.com",
                name="GlobeTrotter Admin",
                hashed_password=get_password_hash("admin123"),
                photo_url="https://i.pravatar.cc/150?u=admin",
                language_preference="en",
                is_admin=True,
                created_at=datetime.utcnow() - timedelta(days=60),
            ),
        }
        db.add_all(users.values())
        db.flush()

        # ==========================================
        # 2. CITIES (10 cities across multiple regions)
        # ==========================================
        cities_data = [
            {
                "id": "c1000000-0000-0000-0000-000000000001",
                "name": "Paris",
                "country": "France",
                "region": "Europe",
                "cost_index": 4,
                "popularity": 95,
                "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
                "description": "The City of Light, known for art, fashion, and world-class cuisine.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000002",
                "name": "Barcelona",
                "country": "Spain",
                "region": "Europe",
                "cost_index": 3,
                "popularity": 88,
                "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600",
                "description": "Vibrant Mediterranean city famous for Gaudí architecture, tapas, and beaches.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000003",
                "name": "Tokyo",
                "country": "Japan",
                "region": "Asia",
                "cost_index": 4,
                "popularity": 92,
                "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
                "description": "Ultra-modern capital blending futuristic culture with ancient shrines.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000004",
                "name": "Rome",
                "country": "Italy",
                "region": "Europe",
                "cost_index": 3,
                "popularity": 90,
                "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600",
                "description": "The Eternal City, home to the Colosseum, Vatican, and endless gelato.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000005",
                "name": "Bali",
                "country": "Indonesia",
                "region": "Asia",
                "cost_index": 2,
                "popularity": 85,
                "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
                "description": "Tropical island paradise with lush terraces, temples, and serene beaches.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000006",
                "name": "Jaipur",
                "country": "India",
                "region": "Asia",
                "cost_index": 2,
                "popularity": 87,
                "image_url": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600",
                "description": "The Pink City of Rajasthan, famous for royal palaces and vibrant bazaars.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000007",
                "name": "New York",
                "country": "USA",
                "region": "North America",
                "cost_index": 5,
                "popularity": 96,
                "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600",
                "description": "The city that never sleeps — iconic skyline, Broadway, and Central Park.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000008",
                "name": "Istanbul",
                "country": "Turkey",
                "region": "Europe",
                "cost_index": 2,
                "popularity": 82,
                "image_url": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600",
                "description": "Where East meets West — stunning mosques, bazaars, and Bosphorus views.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000009",
                "name": "Sydney",
                "country": "Australia",
                "region": "Oceania",
                "cost_index": 4,
                "popularity": 83,
                "image_url": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600",
                "description": "Harbour city with the iconic Opera House, golden beaches, and surf culture.",
            },
            {
                "id": "c1000000-0000-0000-0000-000000000010",
                "name": "Marrakech",
                "country": "Morocco",
                "region": "Africa",
                "cost_index": 2,
                "popularity": 78,
                "image_url": "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600",
                "description": "Enchanting Red City with vibrant souks, riads, and Atlas Mountain views.",
            },
        ]

        for c in cities_data:
            db.add(models.City(**c))
        db.flush()

        # ==========================================
        # 3. ACTIVITIES (3-4 per city = ~35 activities)
        # ==========================================
        activities_data = [
            # Paris (4)
            {"id": "a1000000-0000-0000-0000-000000000001", "name": "Eiffel Tower Visit", "city_id": "c1000000-0000-0000-0000-000000000001", "category": "sightseeing", "estimated_cost": 2100.00, "duration_hours": 2.5, "description": "Iconic iron lattice tower on the Champ de Mars with panoramic views.", "image_url": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000002", "name": "Seine River Cruise", "city_id": "c1000000-0000-0000-0000-000000000001", "category": "sightseeing", "estimated_cost": 3350.00, "duration_hours": 1.5, "description": "Scenic boat cruise along the Seine passing major Paris landmarks.", "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000003", "name": "Louvre Museum", "city_id": "c1000000-0000-0000-0000-000000000001", "category": "culture", "estimated_cost": 1400.00, "duration_hours": 4.0, "description": "World's largest art museum housing the Mona Lisa and Venus de Milo.", "image_url": "https://images.unsplash.com/photo-1499426600726-7f1e2a27e705?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000004", "name": "Montmartre Walking Tour", "city_id": "c1000000-0000-0000-0000-000000000001", "category": "culture", "estimated_cost": 2500.00, "duration_hours": 3.0, "description": "Guided walk through the artistic hilltop neighborhood of Montmartre.", "image_url": "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400"},
            # Barcelona (3)
            {"id": "a1000000-0000-0000-0000-000000000005", "name": "Sagrada Familia Tour", "city_id": "c1000000-0000-0000-0000-000000000002", "category": "sightseeing", "estimated_cost": 3000.00, "duration_hours": 2.0, "description": "Gaudí's unfinished masterpiece basilica with stunning facades.", "image_url": "https://images.unsplash.com/photo-1583779457711-ab081de64105?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000006", "name": "La Boqueria Market Food Tour", "city_id": "c1000000-0000-0000-0000-000000000002", "category": "food", "estimated_cost": 4600.00, "duration_hours": 2.5, "description": "Guided tasting tour through Barcelona's famous public market.", "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000030", "name": "Park Güell Exploration", "city_id": "c1000000-0000-0000-0000-000000000002", "category": "sightseeing", "estimated_cost": 1200.00, "duration_hours": 2.0, "description": "Colourful mosaic park by Gaudí overlooking Barcelona.", "image_url": "https://images.unsplash.com/photo-1564509143984-59cf1df9c7b3?w=400"},
            # Tokyo (3)
            {"id": "a1000000-0000-0000-0000-000000000008", "name": "Shibuya & Harajuku Walk", "city_id": "c1000000-0000-0000-0000-000000000003", "category": "culture", "estimated_cost": 0.00, "duration_hours": 3.0, "description": "Self-guided walk through Tokyo's trendiest fashion and food districts.", "image_url": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000031", "name": "Tsukiji Outer Market Sushi Tour", "city_id": "c1000000-0000-0000-0000-000000000003", "category": "food", "estimated_cost": 5500.00, "duration_hours": 2.0, "description": "Taste the freshest sushi and street food at Tokyo's legendary market.", "image_url": "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000032", "name": "Senso-ji Temple Visit", "city_id": "c1000000-0000-0000-0000-000000000003", "category": "culture", "estimated_cost": 0.00, "duration_hours": 1.5, "description": "Tokyo's oldest Buddhist temple in the heart of Asakusa.", "image_url": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400"},
            # Rome (3)
            {"id": "a1000000-0000-0000-0000-000000000007", "name": "Colosseum Guided Tour", "city_id": "c1000000-0000-0000-0000-000000000004", "category": "sightseeing", "estimated_cost": 3750.00, "duration_hours": 3.0, "description": "Skip-the-line tour of the ancient Roman amphitheatre.", "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000033", "name": "Vatican Museums & Sistine Chapel", "city_id": "c1000000-0000-0000-0000-000000000004", "category": "culture", "estimated_cost": 2800.00, "duration_hours": 3.5, "description": "Explore the papal art collection and Michelangelo's ceiling.", "image_url": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000034", "name": "Trastevere Food Walk", "city_id": "c1000000-0000-0000-0000-000000000004", "category": "food", "estimated_cost": 4200.00, "duration_hours": 2.5, "description": "Stroll the cobblestone streets tasting pizza, pasta, and gelato.", "image_url": "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=400"},
            # Bali (3)
            {"id": "a1000000-0000-0000-0000-000000000009", "name": "Ubud Rice Terrace Trek", "city_id": "c1000000-0000-0000-0000-000000000005", "category": "adventure", "estimated_cost": 1250.00, "duration_hours": 4.0, "description": "Scenic trek through the famous Tegallalang rice terraces.", "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000035", "name": "Uluwatu Temple Sunset", "city_id": "c1000000-0000-0000-0000-000000000005", "category": "culture", "estimated_cost": 800.00, "duration_hours": 2.0, "description": "Cliff-top temple with traditional Kecak fire dance at sunset.", "image_url": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000036", "name": "Bali Surf Lesson", "city_id": "c1000000-0000-0000-0000-000000000005", "category": "adventure", "estimated_cost": 2500.00, "duration_hours": 2.5, "description": "Beginner-friendly surf class on Kuta or Seminyak beach.", "image_url": "https://images.unsplash.com/photo-1502680390548-bdbac40d7154?w=400"},
            # Jaipur (3)
            {"id": "a1000000-0000-0000-0000-000000000010", "name": "Amber Fort Heritage Tour", "city_id": "c1000000-0000-0000-0000-000000000006", "category": "culture", "estimated_cost": 500.00, "duration_hours": 3.0, "description": "Explore the majestic hilltop palace and Sheesh Mahal mirror work.", "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000037", "name": "Hawa Mahal & City Palace", "city_id": "c1000000-0000-0000-0000-000000000006", "category": "sightseeing", "estimated_cost": 700.00, "duration_hours": 2.5, "description": "The iconic Palace of Winds and the royal City Palace complex.", "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000038", "name": "Jaipur Street Food Trail", "city_id": "c1000000-0000-0000-0000-000000000006", "category": "food", "estimated_cost": 600.00, "duration_hours": 2.0, "description": "Sample dal baati, kachori, and lassi at the best local stalls.", "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400"},
            # New York (3)
            {"id": "a1000000-0000-0000-0000-000000000011", "name": "Statue of Liberty & Ellis Island", "city_id": "c1000000-0000-0000-0000-000000000007", "category": "sightseeing", "estimated_cost": 2000.00, "duration_hours": 4.0, "description": "Ferry ride and tour of America's most iconic landmark.", "image_url": "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000012", "name": "Central Park Bike Tour", "city_id": "c1000000-0000-0000-0000-000000000007", "category": "adventure", "estimated_cost": 3500.00, "duration_hours": 2.5, "description": "Guided bike ride through Manhattan's green heart.", "image_url": "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000013", "name": "Broadway Show", "city_id": "c1000000-0000-0000-0000-000000000007", "category": "culture", "estimated_cost": 12000.00, "duration_hours": 3.0, "description": "Catch a world-class musical on the Great White Way.", "image_url": "https://images.unsplash.com/photo-1520485260996-2b9764c76127?w=400"},
            # Istanbul (3)
            {"id": "a1000000-0000-0000-0000-000000000014", "name": "Hagia Sophia & Blue Mosque", "city_id": "c1000000-0000-0000-0000-000000000008", "category": "sightseeing", "estimated_cost": 1500.00, "duration_hours": 3.0, "description": "Visit two of the world's most magnificent religious buildings.", "image_url": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000015", "name": "Grand Bazaar Shopping", "city_id": "c1000000-0000-0000-0000-000000000008", "category": "culture", "estimated_cost": 0.00, "duration_hours": 2.5, "description": "Lose yourself in one of the largest covered markets in the world.", "image_url": "https://images.unsplash.com/photo-1535565454739-863432ea7c40?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000016", "name": "Bosphorus Sunset Cruise", "city_id": "c1000000-0000-0000-0000-000000000008", "category": "sightseeing", "estimated_cost": 2200.00, "duration_hours": 2.0, "description": "Cruise between two continents as the sun sets over the strait.", "image_url": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400"},
            # Sydney (3)
            {"id": "a1000000-0000-0000-0000-000000000017", "name": "Sydney Opera House Tour", "city_id": "c1000000-0000-0000-0000-000000000009", "category": "culture", "estimated_cost": 3200.00, "duration_hours": 1.5, "description": "Go behind the sails of this World Heritage masterpiece.", "image_url": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000018", "name": "Bondi to Coogee Coastal Walk", "city_id": "c1000000-0000-0000-0000-000000000009", "category": "adventure", "estimated_cost": 0.00, "duration_hours": 2.5, "description": "Stunning cliff-top trail past secluded beaches and rock pools.", "image_url": "https://images.unsplash.com/photo-1523428096881-5bd79d043006?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000019", "name": "Harbour Bridge Climb", "city_id": "c1000000-0000-0000-0000-000000000009", "category": "adventure", "estimated_cost": 18000.00, "duration_hours": 3.5, "description": "Climb the iconic bridge for 360° views of Sydney Harbour.", "image_url": "https://images.unsplash.com/photo-1524820197278-540916411e20?w=400"},
            # Marrakech (3)
            {"id": "a1000000-0000-0000-0000-000000000020", "name": "Jemaa el-Fnaa Night Market", "city_id": "c1000000-0000-0000-0000-000000000010", "category": "food", "estimated_cost": 1000.00, "duration_hours": 2.5, "description": "Experience the electric atmosphere of Marrakech's main square after dark.", "image_url": "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000021", "name": "Majorelle Garden Visit", "city_id": "c1000000-0000-0000-0000-000000000010", "category": "culture", "estimated_cost": 600.00, "duration_hours": 1.5, "description": "Yves Saint Laurent's vibrant blue garden retreat.", "image_url": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400"},
            {"id": "a1000000-0000-0000-0000-000000000022", "name": "Atlas Mountains Day Trip", "city_id": "c1000000-0000-0000-0000-000000000010", "category": "adventure", "estimated_cost": 3800.00, "duration_hours": 8.0, "description": "Drive through Berber villages to the stunning Ourika Valley.", "image_url": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400"},
        ]

        for a in activities_data:
            db.add(models.Activity(**a))
        db.flush()

        # ==========================================
        # 4. TRIPS, STOPS, and STOP ACTIVITIES
        # ==========================================

        # --- Trip 1: Ada's European Adventure (past trip, public) ---
        trip1 = models.Trip(
            id="t1000000-0000-0000-0000-000000000001",
            user_id=users["ada"].id,
            name="European Adventure",
            description="Two weeks across Western Europe covering Paris, Barcelona and Rome.",
            start_date="2026-09-01",
            end_date="2026-09-14",
            cover_photo_url="https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800",
            is_public=True,
            created_at=datetime.utcnow() - timedelta(days=40),
        )
        db.add(trip1)
        db.flush()

        t1_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000001", trip_id=trip1.id, city_id="c1000000-0000-0000-0000-000000000001", arrival_date="2026-09-01", departure_date="2026-09-05", transport_cost=29000.00, stay_cost=50000.00, order=1)
        t1_stop2 = models.Stop(id="s1000000-0000-0000-0000-000000000002", trip_id=trip1.id, city_id="c1000000-0000-0000-0000-000000000002", arrival_date="2026-09-06", departure_date="2026-09-09", transport_cost=16500.00, stay_cost=42000.00, order=2)
        t1_stop3 = models.Stop(id="s1000000-0000-0000-0000-000000000003", trip_id=trip1.id, city_id="c1000000-0000-0000-0000-000000000004", arrival_date="2026-09-10", departure_date="2026-09-14", transport_cost=25500.00, stay_cost=58000.00, order=3)
        db.add_all([t1_stop1, t1_stop2, t1_stop3])
        db.flush()

        t1_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000001", stop_id=t1_stop1.id, activity_id="a1000000-0000-0000-0000-000000000001", date="2026-09-02", start_time="09:00", end_time="11:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000002", stop_id=t1_stop1.id, activity_id="a1000000-0000-0000-0000-000000000002", date="2026-09-02", start_time="14:00", end_time="15:30", order=2),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000003", stop_id=t1_stop1.id, activity_id="a1000000-0000-0000-0000-000000000003", date="2026-09-03", start_time="10:00", end_time="14:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000004", stop_id=t1_stop1.id, activity_id="a1000000-0000-0000-0000-000000000004", date="2026-09-04", start_time="09:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000005", stop_id=t1_stop2.id, activity_id="a1000000-0000-0000-0000-000000000005", date="2026-09-07", start_time="10:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000006", stop_id=t1_stop2.id, activity_id="a1000000-0000-0000-0000-000000000006", date="2026-09-08", start_time="11:00", end_time="13:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000020", stop_id=t1_stop2.id, activity_id="a1000000-0000-0000-0000-000000000030", date="2026-09-08", start_time="15:00", end_time="17:00", order=2),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000007", stop_id=t1_stop3.id, activity_id="a1000000-0000-0000-0000-000000000007", date="2026-09-11", start_time="09:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000021", stop_id=t1_stop3.id, activity_id="a1000000-0000-0000-0000-000000000033", date="2026-09-12", start_time="09:00", end_time="12:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000022", stop_id=t1_stop3.id, activity_id="a1000000-0000-0000-0000-000000000034", date="2026-09-13", start_time="18:00", end_time="20:30", order=1),
        ]
        db.add_all(t1_acts)
        db.flush()

        # --- Trip 2: Ada's Bali & Jaipur Escape (upcoming, private) ---
        trip2 = models.Trip(
            id="t1000000-0000-0000-0000-000000000002",
            user_id=users["ada"].id,
            name="Bali & Jaipur Escape",
            description="Relaxation in Bali followed by cultural immersion in Jaipur.",
            start_date="2026-11-15",
            end_date="2026-11-28",
            cover_photo_url="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
            is_public=False,
            created_at=datetime.utcnow() - timedelta(days=3),
        )
        db.add(trip2)
        db.flush()

        t2_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000004", trip_id=trip2.id, city_id="c1000000-0000-0000-0000-000000000005", arrival_date="2026-11-15", departure_date="2026-11-22", transport_cost=22000.00, stay_cost=35000.00, order=1)
        t2_stop2 = models.Stop(id="s1000000-0000-0000-0000-000000000005", trip_id=trip2.id, city_id="c1000000-0000-0000-0000-000000000006", arrival_date="2026-11-23", departure_date="2026-11-28", transport_cost=8000.00, stay_cost=18000.00, order=2)
        db.add_all([t2_stop1, t2_stop2])
        db.flush()

        t2_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000008", stop_id=t2_stop1.id, activity_id="a1000000-0000-0000-0000-000000000009", date="2026-11-16", start_time="07:00", end_time="11:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000009", stop_id=t2_stop1.id, activity_id="a1000000-0000-0000-0000-000000000035", date="2026-11-17", start_time="16:00", end_time="18:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000010", stop_id=t2_stop1.id, activity_id="a1000000-0000-0000-0000-000000000036", date="2026-11-18", start_time="08:00", end_time="10:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000011", stop_id=t2_stop2.id, activity_id="a1000000-0000-0000-0000-000000000010", date="2026-11-24", start_time="09:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000012", stop_id=t2_stop2.id, activity_id="a1000000-0000-0000-0000-000000000037", date="2026-11-25", start_time="10:00", end_time="12:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000013", stop_id=t2_stop2.id, activity_id="a1000000-0000-0000-0000-000000000038", date="2026-11-25", start_time="17:00", end_time="19:00", order=2),
        ]
        db.add_all(t2_acts)
        db.flush()

        # --- Trip 3: Marco's Japan Journey (public) ---
        trip3 = models.Trip(
            id="t1000000-0000-0000-0000-000000000003",
            user_id=users["marco"].id,
            name="Japan Journey",
            description="Exploring the ancient and ultra-modern sides of Tokyo.",
            start_date="2026-10-05",
            end_date="2026-10-12",
            cover_photo_url="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
            is_public=True,
            created_at=datetime.utcnow() - timedelta(days=25),
        )
        db.add(trip3)
        db.flush()

        t3_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000006", trip_id=trip3.id, city_id="c1000000-0000-0000-0000-000000000003", arrival_date="2026-10-05", departure_date="2026-10-12", transport_cost=45000.00, stay_cost=70000.00, order=1)
        db.add(t3_stop1)
        db.flush()

        t3_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000014", stop_id=t3_stop1.id, activity_id="a1000000-0000-0000-0000-000000000008", date="2026-10-06", start_time="10:00", end_time="13:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000015", stop_id=t3_stop1.id, activity_id="a1000000-0000-0000-0000-000000000031", date="2026-10-07", start_time="07:00", end_time="09:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000016", stop_id=t3_stop1.id, activity_id="a1000000-0000-0000-0000-000000000032", date="2026-10-08", start_time="09:00", end_time="10:30", order=1),
        ]
        db.add_all(t3_acts)
        db.flush()

        # --- Trip 4: Marco's NYC Weekend (public) ---
        trip4 = models.Trip(
            id="t1000000-0000-0000-0000-000000000004",
            user_id=users["marco"].id,
            name="NYC Weekend",
            description="Quick 4-day getaway to the Big Apple.",
            start_date="2026-12-20",
            end_date="2026-12-23",
            cover_photo_url="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
            is_public=True,
            created_at=datetime.utcnow() - timedelta(days=2),
        )
        db.add(trip4)
        db.flush()

        t4_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000007", trip_id=trip4.id, city_id="c1000000-0000-0000-0000-000000000007", arrival_date="2026-12-20", departure_date="2026-12-23", transport_cost=65000.00, stay_cost=85000.00, order=1)
        db.add(t4_stop1)
        db.flush()

        t4_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000017", stop_id=t4_stop1.id, activity_id="a1000000-0000-0000-0000-000000000011", date="2026-12-20", start_time="10:00", end_time="14:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000018", stop_id=t4_stop1.id, activity_id="a1000000-0000-0000-0000-000000000012", date="2026-12-21", start_time="09:00", end_time="11:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000019", stop_id=t4_stop1.id, activity_id="a1000000-0000-0000-0000-000000000013", date="2026-12-22", start_time="19:00", end_time="22:00", order=1),
        ]
        db.add_all(t4_acts)
        db.flush()

        # --- Trip 5: Sakura's Istanbul & Marrakech (public) ---
        trip5 = models.Trip(
            id="t1000000-0000-0000-0000-000000000005",
            user_id=users["sakura"].id,
            name="Istanbul & Marrakech Discovery",
            description="10 days immersed in bazaars, mosques, and medinas across two continents.",
            start_date="2026-10-20",
            end_date="2026-10-30",
            cover_photo_url="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
            is_public=True,
            created_at=datetime.utcnow() - timedelta(days=15),
        )
        db.add(trip5)
        db.flush()

        t5_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000008", trip_id=trip5.id, city_id="c1000000-0000-0000-0000-000000000008", arrival_date="2026-10-20", departure_date="2026-10-25", transport_cost=32000.00, stay_cost=25000.00, order=1)
        t5_stop2 = models.Stop(id="s1000000-0000-0000-0000-000000000009", trip_id=trip5.id, city_id="c1000000-0000-0000-0000-000000000010", arrival_date="2026-10-26", departure_date="2026-10-30", transport_cost=18000.00, stay_cost=22000.00, order=2)
        db.add_all([t5_stop1, t5_stop2])
        db.flush()

        t5_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000023", stop_id=t5_stop1.id, activity_id="a1000000-0000-0000-0000-000000000014", date="2026-10-21", start_time="09:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000024", stop_id=t5_stop1.id, activity_id="a1000000-0000-0000-0000-000000000015", date="2026-10-22", start_time="10:00", end_time="12:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000025", stop_id=t5_stop1.id, activity_id="a1000000-0000-0000-0000-000000000016", date="2026-10-23", start_time="17:00", end_time="19:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000026", stop_id=t5_stop2.id, activity_id="a1000000-0000-0000-0000-000000000020", date="2026-10-27", start_time="18:00", end_time="20:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000027", stop_id=t5_stop2.id, activity_id="a1000000-0000-0000-0000-000000000021", date="2026-10-28", start_time="09:00", end_time="10:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000028", stop_id=t5_stop2.id, activity_id="a1000000-0000-0000-0000-000000000022", date="2026-10-29", start_time="07:00", end_time="15:00", order=1),
        ]
        db.add_all(t5_acts)
        db.flush()

        # --- Trip 6: Priya's Golden Triangle (public) ---
        trip6 = models.Trip(
            id="t1000000-0000-0000-0000-000000000006",
            user_id=users["priya"].id,
            name="Rajasthan Golden Triangle",
            description="Exploring the heritage cities of Jaipur with a side trip to Bali for relaxation.",
            start_date="2026-11-01",
            end_date="2026-11-10",
            cover_photo_url="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
            is_public=True,
            created_at=datetime.utcnow() - timedelta(days=8),
        )
        db.add(trip6)
        db.flush()

        t6_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000010", trip_id=trip6.id, city_id="c1000000-0000-0000-0000-000000000006", arrival_date="2026-11-01", departure_date="2026-11-05", transport_cost=4500.00, stay_cost=12000.00, order=1)
        t6_stop2 = models.Stop(id="s1000000-0000-0000-0000-000000000011", trip_id=trip6.id, city_id="c1000000-0000-0000-0000-000000000005", arrival_date="2026-11-06", departure_date="2026-11-10", transport_cost=18000.00, stay_cost=25000.00, order=2)
        db.add_all([t6_stop1, t6_stop2])
        db.flush()

        t6_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000029", stop_id=t6_stop1.id, activity_id="a1000000-0000-0000-0000-000000000010", date="2026-11-02", start_time="09:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000030", stop_id=t6_stop1.id, activity_id="a1000000-0000-0000-0000-000000000037", date="2026-11-03", start_time="10:00", end_time="12:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000031", stop_id=t6_stop1.id, activity_id="a1000000-0000-0000-0000-000000000038", date="2026-11-03", start_time="17:00", end_time="19:00", order=2),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000032", stop_id=t6_stop2.id, activity_id="a1000000-0000-0000-0000-000000000009", date="2026-11-07", start_time="07:00", end_time="11:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000033", stop_id=t6_stop2.id, activity_id="a1000000-0000-0000-0000-000000000036", date="2026-11-08", start_time="08:00", end_time="10:30", order=1),
        ]
        db.add_all(t6_acts)
        db.flush()

        # --- Trip 7: Elena's Mediterranean Dream (public) ---
        trip7 = models.Trip(
            id="t1000000-0000-0000-0000-000000000007",
            user_id=users["elena"].id,
            name="Mediterranean Dream",
            description="Barcelona and Rome — the best of Mediterranean food, art, and sunshine.",
            start_date="2026-10-01",
            end_date="2026-10-10",
            cover_photo_url="https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
            is_public=True,
            created_at=datetime.utcnow() - timedelta(days=4),
        )
        db.add(trip7)
        db.flush()

        t7_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000012", trip_id=trip7.id, city_id="c1000000-0000-0000-0000-000000000002", arrival_date="2026-10-01", departure_date="2026-10-05", transport_cost=35000.00, stay_cost=40000.00, order=1)
        t7_stop2 = models.Stop(id="s1000000-0000-0000-0000-000000000013", trip_id=trip7.id, city_id="c1000000-0000-0000-0000-000000000004", arrival_date="2026-10-06", departure_date="2026-10-10", transport_cost=12000.00, stay_cost=45000.00, order=2)
        db.add_all([t7_stop1, t7_stop2])
        db.flush()

        t7_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000034", stop_id=t7_stop1.id, activity_id="a1000000-0000-0000-0000-000000000005", date="2026-10-02", start_time="10:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000035", stop_id=t7_stop1.id, activity_id="a1000000-0000-0000-0000-000000000006", date="2026-10-03", start_time="11:00", end_time="13:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000036", stop_id=t7_stop1.id, activity_id="a1000000-0000-0000-0000-000000000030", date="2026-10-04", start_time="09:00", end_time="11:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000037", stop_id=t7_stop2.id, activity_id="a1000000-0000-0000-0000-000000000007", date="2026-10-07", start_time="09:00", end_time="12:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000038", stop_id=t7_stop2.id, activity_id="a1000000-0000-0000-0000-000000000033", date="2026-10-08", start_time="09:00", end_time="12:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000039", stop_id=t7_stop2.id, activity_id="a1000000-0000-0000-0000-000000000034", date="2026-10-09", start_time="19:00", end_time="21:30", order=1),
        ]
        db.add_all(t7_acts)
        db.flush()

        # --- Trip 8: Elena's Sydney Surf (private) ---
        trip8 = models.Trip(
            id="t1000000-0000-0000-0000-000000000008",
            user_id=users["elena"].id,
            name="Sydney Surf & Sights",
            description="Adventure trip to climb the bridge and catch some waves Down Under.",
            start_date="2027-01-10",
            end_date="2027-01-17",
            cover_photo_url="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
            is_public=False,
            created_at=datetime.utcnow() - timedelta(days=1),
        )
        db.add(trip8)
        db.flush()

        t8_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000014", trip_id=trip8.id, city_id="c1000000-0000-0000-0000-000000000009", arrival_date="2027-01-10", departure_date="2027-01-17", transport_cost=55000.00, stay_cost=72000.00, order=1)
        db.add(t8_stop1)
        db.flush()

        t8_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000040", stop_id=t8_stop1.id, activity_id="a1000000-0000-0000-0000-000000000017", date="2027-01-11", start_time="10:00", end_time="11:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000041", stop_id=t8_stop1.id, activity_id="a1000000-0000-0000-0000-000000000018", date="2027-01-12", start_time="07:00", end_time="09:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000042", stop_id=t8_stop1.id, activity_id="a1000000-0000-0000-0000-000000000019", date="2027-01-14", start_time="06:00", end_time="09:30", order=1),
        ]
        db.add_all(t8_acts)
        db.flush()

        # --- Trip 9: Priya's Paris Solo (public, recent) ---
        trip9 = models.Trip(
            id="t1000000-0000-0000-0000-000000000009",
            user_id=users["priya"].id,
            name="Paris Solo Getaway",
            description="A solo weekend in Paris to see the Eiffel Tower and enjoy French pastries.",
            start_date="2026-10-15",
            end_date="2026-10-19",
            cover_photo_url="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
            is_public=True,
            created_at=datetime.utcnow() - timedelta(days=1),
        )
        db.add(trip9)
        db.flush()

        t9_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000015", trip_id=trip9.id, city_id="c1000000-0000-0000-0000-000000000001", arrival_date="2026-10-15", departure_date="2026-10-19", transport_cost=38000.00, stay_cost=48000.00, order=1)
        db.add(t9_stop1)
        db.flush()

        t9_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000043", stop_id=t9_stop1.id, activity_id="a1000000-0000-0000-0000-000000000001", date="2026-10-16", start_time="09:00", end_time="11:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000044", stop_id=t9_stop1.id, activity_id="a1000000-0000-0000-0000-000000000002", date="2026-10-16", start_time="14:00", end_time="15:30", order=2),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000045", stop_id=t9_stop1.id, activity_id="a1000000-0000-0000-0000-000000000003", date="2026-10-17", start_time="10:00", end_time="14:00", order=1),
        ]
        db.add_all(t9_acts)
        db.flush()

        # --- Trip 10: Sakura's Bali Retreat (private, recent) ---
        trip10 = models.Trip(
            id="t1000000-0000-0000-0000-000000000010",
            user_id=users["sakura"].id,
            name="Bali Wellness Retreat",
            description="A week of yoga, surf, and temple visits in beautiful Bali.",
            start_date="2026-12-01",
            end_date="2026-12-08",
            cover_photo_url="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
            is_public=False,
            created_at=datetime.utcnow() - timedelta(days=2),
        )
        db.add(trip10)
        db.flush()

        t10_stop1 = models.Stop(id="s1000000-0000-0000-0000-000000000016", trip_id=trip10.id, city_id="c1000000-0000-0000-0000-000000000005", arrival_date="2026-12-01", departure_date="2026-12-08", transport_cost=28000.00, stay_cost=42000.00, order=1)
        db.add(t10_stop1)
        db.flush()

        t10_acts = [
            models.StopActivity(id="sa100000-0000-0000-0000-000000000046", stop_id=t10_stop1.id, activity_id="a1000000-0000-0000-0000-000000000009", date="2026-12-02", start_time="06:30", end_time="10:30", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000047", stop_id=t10_stop1.id, activity_id="a1000000-0000-0000-0000-000000000035", date="2026-12-03", start_time="16:00", end_time="18:00", order=1),
            models.StopActivity(id="sa100000-0000-0000-0000-000000000048", stop_id=t10_stop1.id, activity_id="a1000000-0000-0000-0000-000000000036", date="2026-12-05", start_time="08:00", end_time="10:30", order=1),
        ]
        db.add_all(t10_acts)

        db.commit()
        print("Database seeded successfully!")
        print("  → 6 users (5 demo + 1 admin)")
        print("  → 10 cities across 6 regions")
        print("  → 35 activities")
        print("  → 10 trips with 17 stops and 50+ scheduled activities")
        print("  → Login: ada@example.com / password123")
        print("  → Login: marco@example.com / password123")
        print("  → Login: sakura@example.com / password123")
        print("  → Login: priya@example.com / password123")
        print("  → Login: elena@example.com / password123")
        print("  → Admin: admin@globetrotter.com / admin123")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
