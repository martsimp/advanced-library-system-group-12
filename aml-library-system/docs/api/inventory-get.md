**Endpoint**:
GET /api/inventory/search

**Description**: Searches for media using filter parameters.

**Headers**:

- `Content-Type`: application/json

**Query Parameters**:

- `q` (type: string, optional): Name to search for
- `genre` (type: string, optional): Genre to search for
- `format` (type: string, optional): Format to search for
- `status` (type: string, optional): Status to search for
- `sortBy` (type: string, optional): Field to sort on

**Response**:

- Status: 200 OK
- Response:

```json
[
  {
    "id": 3,
    "title": "Abbey Road",
    "author": "The Beatles",
    "genre": "Music",
    "publication_year": 1969,
    "format": "CD",
    "status": "available",
    "description": "The Beatles’ iconic album.",
    "total_copies": 1
  },
  {
    "id": 7,
    "title": "Jazz Classics",
    "author": "Miles Davis",
    "genre": "Music",
    "publication_year": 1959,
    "format": "CD",
    "status": "available",
    "description": "A collection of jazz masterpieces.",
    "total_copies": 0
  },
  {
    "id": 2,
    "title": "Nature Journal",
    "author": "Various Authors",
    "genre": "Science",
    "publication_year": 2023,
    "format": "journal",
    "status": "available",
    "description": "A monthly scientific journal.",
    "total_copies": 2
  },
  {
    "id": 4,
    "title": "The Godfather",
    "author": "Francis Ford Coppola",
    "genre": "Drama",
    "publication_year": 1972,
    "format": "DVD",
    "status": "borrowed",
    "description": "Classic mafia drama film.",
    "total_copies": 0
  },
  {
    "id": 5,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic",
    "publication_year": 1925,
    "format": "book",
    "status": "available",
    "description": "A story of decadence and excess.",
    "total_copies": 0
  },
  {
    "id": 8,
    "title": "The Shawshank Redemption",
    "author": "Frank Darabont",
    "genre": "Drama",
    "publication_year": 1994,
    "format": "DVD",
    "status": "available",
    "description": "A tale of hope and perseverance.",
    "total_copies": 3
  },
  {
    "id": 1,
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "publication_year": 1960,
    "format": "book",
    "status": "available",
    "description": "A novel about racial injustice in the Deep South.",
    "total_copies": 4
  },
  {
    "id": 6,
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "publication_year": 1960,
    "format": "book",
    "status": "available",
    "description": "A classic of modern American literature.",
    "total_copies": 3
  }
]
```
