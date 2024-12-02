**Endpoint**:
DELETE /api/reservations/:reservationID/cancel

**Description**: Cancels a reservation.

**Headers**:

- `Content-Type`: application/json

**Response**:

- Status: 200 OK
- Response:

```json
{ message: 'Reservation cancelled successfully' }
```