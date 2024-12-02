**Endpoint**:
POST /api/mediaTransfer/transfer

**Description**: Transfers media from one branch to another.

**Headers**:

- `Content-Type`: application/json

**Query Parameters**:

- `mediaName` (type: string, required): Name of the media being added.
- `branchId` (type: int, required): ID of the branch the media is being added to.
- `quantity` (type: int, required): Amount of this media being added.

**Response**:

- Status: 200 OK
