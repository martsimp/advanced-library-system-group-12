**Endpoint**:
POST /api/mediaTransfer/addMedia

**Description**: Transfers media from one branch to another.

**Headers**:

- `Content-Type`: application/json

**Query Parameters**:

- `mediaId` (type: int, required): ID of the media being transferred.
- `fromBranchId` (type: int, required): ID of the branch the media is being transferred from.
- `toBranchId` (type: int, required): ID of the branch the media is being transferred to.
- `quantity` (type: int, required): Amount of this media being transferred.

**Response**:

- Status: 200 OK
- Response:

```json
{ "message":  "Transfer successful" }
```
