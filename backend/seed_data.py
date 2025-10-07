"""
Sample opportunities data for Depanku.id
Run this script to populate Firestore and Algolia with initial data
"""

import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin.firestore import SERVER_TIMESTAMP
from algoliasearch.search.client import SearchClient
from datetime import datetime, timedelta

load_dotenv()

# Initialize Firebase
firebase_service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")

if not firebase_admin._apps:
    if firebase_service_account:
        # Parse JSON string from environment variable
        firebase_config = json.loads(firebase_service_account)
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
    else:
        print("Error: FIREBASE_SERVICE_ACCOUNT_KEY not found in environment")
        exit(1)

db = firestore.client()

# Initialize Algolia (using sync client)
algolia_client = SearchClient(
    os.getenv("ALGOLIA_APP_ID"),
    os.getenv("ALGOLIA_ADMIN_API_KEY")
)
ALGOLIA_INDEX_NAME = 'opportunities'

# Sample opportunities data
opportunities = [
    {
        "title": "MIT Research Science Institute",
        "description": "A prestigious summer research program where high school students work alongside MIT faculty on cutting-edge research projects in STEM fields.",
        "type": "research",
        "category": ["STEM", "Research", "Summer Program"],
        "deadline": (datetime.now() + timedelta(days=60)).isoformat(),
        "location": "Cambridge, MA, USA",
        "organization": "Massachusetts Institute of Technology",
        "url": "https://www.cee.org/programs/research-science-institute",
        "tags": ["stem", "research", "summer", "mit", "science"],
    },
    {
        "title": "Google Code-in",
        "description": "A global contest introducing pre-university students (ages 13-17) to open source software development.",
        "type": "competition",
        "category": ["Coding", "Open Source"],
        "deadline": (datetime.now() + timedelta(days=45)).isoformat(),
        "location": "Online",
        "organization": "Google",
        "url": "https://codein.withgoogle.com",
        "tags": ["coding", "programming", "open-source", "google", "competition"],
    },
    {
        "title": "Climate Action Youth Summit",
        "description": "Join young climate activists from around the world to learn about environmental sustainability and develop action plans for your community.",
        "type": "youth-program",
        "category": ["Environment", "Leadership"],
        "deadline": (datetime.now() + timedelta(days=30)).isoformat(),
        "location": "Bali, Indonesia",
        "organization": "UN Environment Programme",
        "url": "https://www.unep.org",
        "tags": ["environment", "climate", "sustainability", "leadership", "youth"],
    },
    {
        "title": "Creative Minds Design Challenge",
        "description": "A design competition for students passionate about UX/UI, graphic design, and creative problem-solving.",
        "type": "competition",
        "category": ["Design", "Creative"],
        "deadline": (datetime.now() + timedelta(days=50)).isoformat(),
        "location": "Online",
        "organization": "Adobe Foundation",
        "url": "https://www.adobe.com",
        "tags": ["design", "ux", "ui", "creative", "art"],
    },
    {
        "title": "Stanford AI Research Program for High Schoolers",
        "description": "Explore artificial intelligence and machine learning through hands-on projects guided by Stanford researchers.",
        "type": "research",
        "category": ["AI", "Computer Science"],
        "deadline": (datetime.now() + timedelta(days=70)).isoformat(),
        "location": "Stanford, CA, USA",
        "organization": "Stanford University",
        "url": "https://ai.stanford.edu",
        "tags": ["ai", "machine-learning", "research", "computer-science", "stanford"],
    },
    {
        "title": "Youth Entrepreneurship Bootcamp",
        "description": "Learn the fundamentals of starting and running a business, from ideation to pitch presentation.",
        "type": "youth-program",
        "category": ["Business", "Entrepreneurship"],
        "deadline": (datetime.now() + timedelta(days=40)).isoformat(),
        "location": "Jakarta, Indonesia",
        "organization": "Indonesia Young Entrepreneurs",
        "url": "https://example.com",
        "tags": ["business", "entrepreneurship", "startup", "leadership"],
    },
    {
        "title": "Ocean Conservation Volunteer Network",
        "description": "Join a community of ocean lovers working on beach cleanups, marine research, and conservation education.",
        "type": "community",
        "category": ["Environment", "Volunteering"],
        "deadline": None,
        "location": "Coastal regions, Indonesia",
        "organization": "Ocean Guardians Indonesia",
        "url": "https://example.com",
        "tags": ["ocean", "environment", "volunteer", "conservation", "community"],
    },
    {
        "title": "National Science Olympiad",
        "description": "Compete with the best young scientists in Indonesia across physics, chemistry, biology, and earth sciences.",
        "type": "competition",
        "category": ["STEM", "Science"],
        "deadline": (datetime.now() + timedelta(days=55)).isoformat(),
        "location": "Various cities, Indonesia",
        "organization": "Indonesian Science Education Foundation",
        "url": "https://example.com",
        "tags": ["science", "olympiad", "stem", "physics", "chemistry", "biology"],
    },
    {
        "title": "Writers' Circle: Young Authors Community",
        "description": "A supportive community for aspiring writers to share work, get feedback, and improve their craft.",
        "type": "community",
        "category": ["Writing", "Creative"],
        "deadline": None,
        "location": "Online & Jakarta",
        "organization": "Indonesian Young Writers",
        "url": "https://example.com",
        "tags": ["writing", "literature", "creative", "community", "arts"],
    },
    {
        "title": "Data Science for Social Good Fellowship",
        "description": "Apply data science skills to real-world social challenges in health, education, and poverty alleviation.",
        "type": "research",
        "category": ["Data Science", "Social Impact"],
        "deadline": (datetime.now() + timedelta(days=65)).isoformat(),
        "location": "Bandung, Indonesia",
        "organization": "Indonesia Data Institute",
        "url": "https://example.com",
        "tags": ["data-science", "social-impact", "research", "analytics"],
    },
    {
        "title": "Music Production Masterclass Series",
        "description": "Learn music production, sound engineering, and digital composition from industry professionals.",
        "type": "youth-program",
        "category": ["Music", "Creative"],
        "deadline": (datetime.now() + timedelta(days=25)).isoformat(),
        "location": "Surabaya, Indonesia",
        "organization": "Creative Sound Academy",
        "url": "https://example.com",
        "tags": ["music", "production", "creative", "arts", "audio"],
    },
    {
        "title": "Robotics Innovation Challenge",
        "description": "Design and build robots to solve real-world problems in this hands-on engineering competition.",
        "type": "competition",
        "category": ["Robotics", "Engineering"],
        "deadline": (datetime.now() + timedelta(days=75)).isoformat(),
        "location": "Yogyakarta, Indonesia",
        "organization": "ASEAN Robotics Federation",
        "url": "https://example.com",
        "tags": ["robotics", "engineering", "stem", "technology", "innovation"],
    },
]

def seed_database():
    """Seed Firestore and Algolia with sample data"""
    print("[*] Starting database seeding...")
    
    # Clear existing data (optional)
    print("Clearing existing opportunities...")
    existing_docs = db.collection('opportunities').stream()
    for doc in existing_docs:
        doc.reference.delete()
    
    # Add opportunities to Firestore and Algolia
    algolia_records = []
    
    for opp in opportunities:
        # Add to Firestore
        doc_ref = db.collection('opportunities').document()
        firestore_opp = opp.copy()
        firestore_opp['createdAt'] = SERVER_TIMESTAMP
        doc_ref.set(firestore_opp)
        
        # Prepare for Algolia (without SERVER_TIMESTAMP sentinel)
        algolia_opp = opp.copy()
        algolia_opp['objectID'] = doc_ref.id
        algolia_opp['createdAt'] = datetime.now().isoformat()
        algolia_records.append(algolia_opp)
        
        print(f"[+] Added: {opp['title']}")
    
    # Batch add to Algolia (using sync client)
    print("\n[*] Syncing to Algolia...")
    try:
        # Use save_objects with sync client
        response = algolia_client.save_objects(
            index_name=ALGOLIA_INDEX_NAME,
            objects=algolia_records
        )
        print(f"Successfully synced {len(algolia_records)} records to Algolia")
    except Exception as e:
        print(f"Warning: Algolia sync error: {e}")
        print("Continuing anyway...")
    
    print(f"\n[!] Successfully seeded {len(opportunities)} opportunities!")
    print("Database is ready to use.")

if __name__ == "__main__":
    seed_database()

