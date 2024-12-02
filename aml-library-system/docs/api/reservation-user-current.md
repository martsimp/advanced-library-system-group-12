**Endpoint**:
GET /user/:userId/current

**Description**: Searches for a user's current reservations.

**Headers**:

- `Content-Type`: application/json

**Response**:

- Status: 200 OK
- Response:

```json
[
  {
    "reservation_id": 9,
    "reserve_date": "2024-11-24T16:59:44.060Z",
    "status": "active",
    "queue_position": 0,
    "title": "The Godfather",
    "author": "Francis Ford Coppola",
    "media_id": 4,
    "branch_id": 1,
    "branch_name": "Downtown Library"
  }
]
```