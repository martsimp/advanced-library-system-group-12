**Endpoint**:
GET /api/branch

**Description**: Retrieves information about all or a specific branch branches.

**Headers**:

- `Content-Type`: application/json

**Query Parameters**:

- `id` (type: int, optional): ID of the branch to retrieve information about.

**Response**:

- Status: 200 OK
- Response:

```json
[
  {
    "id": 1,
    "name": "Downtown Library",
    "city": "Springfield",
    "street_address": "500 Main St",
    "postal_code": "12345",
    "monday_friday_open": "09:00:00",
    "monday_friday_close": "18:00:00",
    "saturday_open": "10:00:00",
    "saturday_close": "14:00:00",
    "sunday_open": null,
    "sunday_close": null
  },
  {
    "id": 2,
    "name": "Uptown Library",
    "city": "Shelbyville",
    "street_address": "250 Elm St",
    "postal_code": "54321",
    "monday_friday_open": "10:00:00",
    "monday_friday_close": "19:00:00",
    "saturday_open": "10:00:00",
    "saturday_close": "16:00:00",
    "sunday_open": "12:00:00",
    "sunday_close": "16:00:00"
  }
]
```
