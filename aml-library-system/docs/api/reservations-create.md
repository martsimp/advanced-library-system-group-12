**Endpoint**:
POST /api/reservations/create

**Description**: Creates a reservation.

**Headers**:

- `Content-Type`: application/json

**Query Parameters**:

- `user` (type: string, required): Firebase ID of the user.
- `media_id` (type: int, required): ID of the media being reserved.
- `branch_id` (type: int, required): ID of the branch the media is being reserved from.

**Response**:

- Status: 200 OK
