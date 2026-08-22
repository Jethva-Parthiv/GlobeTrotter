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

        # 1. Users
        demo_user = models.User(
            id="a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            email="ada@example.com",
            name="Ada Lovelace",
            hashed_password=get_password_hash("password123"),
            photo_url="https://i.pravatar.cc/150?u=ada",
            language_preference="en",
            is_admin=False,
        )
        admin_user = models.User(
            id="b2c3d4e5-f6a7-8901-bcde-f12345678901",
            email="admin@globetrotter.com",
            name="GlobeTrotter Admin",
            hashed_password=get_password_hash("admin123"),
            photo_url="https://i.pravatar.cc/150?u=admin",
            language_preference="en",
            is_admin=True,
        )
        db.add_all([demo_user, admin_user])
        db.flush()

        # 2. Cities
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
        ]

        for c in cities_data:
            db.add(models.City(**c))
        db.flush()

        # 3. Activities
        activities_data = [
            # Paris
            {
                "id": "a1000000-0000-0000-0000-000000000001",
                "name": "Eiffel Tower Visit",
                "city_id": "c1000000-0000-0000-0000-000000000001",
                "category": "sightseeing",
                "estimated_cost": 2100.00,
                "duration_hours": 2.5,
                "description": "Iconic iron lattice tower on the Champ de Mars with panoramic views.",
                "image_url": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400",
            },
            {
                "id": "a1000000-0000-0000-0000-000000000002",
                "name": "Seine River Cruise",
                "city_id": "c1000000-0000-0000-0000-000000000001",
                "category": "sightseeing",
                "estimated_cost": 3350.00,
                "duration_hours": 1.5,
                "description": "Scenic boat cruise along the Seine passing major Paris landmarks.",
                "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
            },
            {
                "id": "a1000000-0000-0000-0000-000000000003",
                "name": "Louvre Museum",
                "city_id": "c1000000-0000-0000-0000-000000000001",
                "category": "culture",
                "estimated_cost": 1400.00,
                "duration_hours": 4.0,
                "description": "World's largest art museum housing the Mona Lisa and Venus de Milo.",
                "image_url": "https://images.unsplash.com/photo-1499426600726-7f1e2a27e705?w=400",
            },
            {
                "id": "a1000000-0000-0000-0000-000000000004",
                "name": "Montmartre Walking Tour",
                "city_id": "c1000000-0000-0000-0000-000000000001",
                "category": "culture",
                "estimated_cost": 2500.00,
                "duration_hours": 3.0,
                "description": "Guided walk through the artistic hilltop neighborhood of Montmartre.",
                "image_url": "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400",
            },
            # Barcelona
            {
                "id": "a1000000-0000-0000-0000-000000000005",
                "name": "Sagrada Familia Tour",
                "city_id": "c1000000-0000-0000-0000-000000000002",
                "category": "sightseeing",
                "estimated_cost": 3000.00,
                "duration_hours": 2.0,
                "description": "Gaudí's unfinished masterpiece basilica with stunning facades.",
                "image_url": "https://images.unsplash.com/photo-1583779457711-ab081de64105?w=400",
            },
            {
                "id": "a1000000-0000-0000-0000-000000000006",
                "name": "La Boqueria Market Food Tour",
                "city_id": "c1000000-0000-0000-0000-000000000002",
                "category": "food",
                "estimated_cost": 4600.00,
                "duration_hours": 2.5,
                "description": "Guided tasting tour through Barcelona's famous public market.",
                "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
            },
            # Rome
            {
                "id": "a1000000-0000-0000-0000-000000000007",
                "name": "Colosseum Guided Tour",
                "city_id": "c1000000-0000-0000-0000-000000000004",
                "category": "sightseeing",
                "estimated_cost": 3750.00,
                "duration_hours": 3.0,
                "description": "Skip-the-line tour of the ancient Roman amphitheatre.",
                "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",
            },
            # Tokyo
            {
                "id": "a1000000-0000-0000-0000-000000000008",
                "name": "Shibuya & Harajuku Walk",
                "city_id": "c1000000-0000-0000-0000-000000000003",
                "category": "culture",
                "estimated_cost": 0.00,
                "duration_hours": 3.0,
                "description": "Self-guided walk through Tokyo's trendiest fashion and food districts.",
                "image_url": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
            },
            # Bali
            {
                "id": "a1000000-0000-0000-0000-000000000009",
                "name": "Ubud Rice Terrace Trek",
                "city_id": "c1000000-0000-0000-0000-000000000005",
                "category": "adventure",
                "estimated_cost": 1250.00,
                "duration_hours": 4.0,
                "description": "Scenic trek through the famous Tegallalang rice terraces.",
                "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
            },
            # Jaipur
            {
                "id": "a1000000-0000-0000-0000-000000000010",
                "name": "Amber Fort Heritage Tour",
                "city_id": "c1000000-0000-0000-0000-000000000006",
                "category": "culture",
                "estimated_cost": 500.00,
                "duration_hours": 3.0,
                "description": "Explore the majestic hilltop palace and Sheesh Mahal mirror work.",
                "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400",
            },
        ]

        for a in activities_data:
            db.add(models.Activity(**a))
        db.flush()

        # 4. Sample Trip for Demo User
        sample_trip = models.Trip(
            id="t1000000-0000-0000-0000-000000000001",
            user_id=demo_user.id,
            name="European Adventure",
            description="Two weeks across Western Europe covering Paris, Barcelona and Rome.",
            start_date="2026-09-01",
            end_date="2026-09-14",
            cover_photo_url="https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800",
            is_public=True,
        )
        db.add(sample_trip)
        db.flush()

        # Stops
        stop1 = models.Stop(
            id="s1000000-0000-0000-0000-000000000001",
            trip_id=sample_trip.id,
            city_id="c1000000-0000-0000-0000-000000000001",
            arrival_date="2026-09-01",
            departure_date="2026-09-05",
            transport_cost=29000.00,
            stay_cost=50000.00,
            order=1,
        )
        stop2 = models.Stop(
            id="s1000000-0000-0000-0000-000000000002",
            trip_id=sample_trip.id,
            city_id="c1000000-0000-0000-0000-000000000002",
            arrival_date="2026-09-06",
            departure_date="2026-09-09",
            transport_cost=16500.00,
            stay_cost=42000.00,
            order=2,
        )
        stop3 = models.Stop(
            id="s1000000-0000-0000-0000-000000000003",
            trip_id=sample_trip.id,
            city_id="c1000000-0000-0000-0000-000000000004",
            arrival_date="2026-09-10",
            departure_date="2026-09-14",
            transport_cost=25500.00,
            stay_cost=58000.00,
            order=3,
        )
        db.add_all([stop1, stop2, stop3])
        db.flush()

        # Stop Activities
        stop_acts = [
            models.StopActivity(
                id="sa100000-0000-0000-0000-000000000001",
                stop_id=stop1.id,
                activity_id="a1000000-0000-0000-0000-000000000001",
                date="2026-09-02",
                start_time="09:00",
                end_time="11:30",
                order=1,
            ),
            models.StopActivity(
                id="sa100000-0000-0000-0000-000000000002",
                stop_id=stop1.id,
                activity_id="a1000000-0000-0000-0000-000000000002",
                date="2026-09-02",
                start_time="14:00",
                end_time="15:30",
                order=2,
            ),
            models.StopActivity(
                id="sa100000-0000-0000-0000-000000000003",
                stop_id=stop1.id,
                activity_id="a1000000-0000-0000-0000-000000000003",
                date="2026-09-03",
                start_time="10:00",
                end_time="14:00",
                order=1,
            ),
            models.StopActivity(
                id="sa100000-0000-0000-0000-000000000004",
                stop_id=stop1.id,
                activity_id="a1000000-0000-0000-0000-000000000004",
                date="2026-09-04",
                start_time="09:00",
                end_time="12:00",
                order=1,
            ),
            models.StopActivity(
                id="sa100000-0000-0000-0000-000000000005",
                stop_id=stop2.id,
                activity_id="a1000000-0000-0000-0000-000000000005",
                date="2026-09-07",
                start_time="10:00",
                end_time="12:00",
                order=1,
            ),
            models.StopActivity(
                id="sa100000-0000-0000-0000-000000000006",
                stop_id=stop2.id,
                activity_id="a1000000-0000-0000-0000-000000000006",
                date="2026-09-08",
                start_time="11:00",
                end_time="13:30",
                order=1,
            ),
            models.StopActivity(
                id="sa100000-0000-0000-0000-000000000007",
                stop_id=stop3.id,
                activity_id="a1000000-0000-0000-0000-000000000007",
                date="2026-09-11",
                start_time="09:00",
                end_time="12:00",
                order=1,
            ),
        ]
        db.add_all(stop_acts)

        db.commit()
        print("Database seeded successfully with initial users, cities, activities, and sample trip!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
