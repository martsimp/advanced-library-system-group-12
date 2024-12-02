**Endpoint**:
GET /api/inventory/filters

**Description**: Returns the filters available for searching.

**Headers**:

- `Content-Type`: application/json

**Response**:

- Status: 200 OK
- Response:

```json
{
  "genres": [
    "Classic",
    "Drama",
    "Fiction",
    "Music",
    "Science"
  ],
  "formats": [
    "book",
    "CD",
    "DVD",
    "journal"
  ],
  "statuses": [
    "available",
    "borrowed"
  ]
}
```
