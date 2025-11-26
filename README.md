# API Spec

Base URL: `https://ttriplej-1078260948749.us-east1.run.app/`

## Authentication

### Registration
Expected request body (example):

`POST /api/auth/register`

```json
{
  "email": "user@gmail.com",
  "username": "username", 
  "password": "password",
    "location": {
    "city": "Atlanta",
    "state": "Georgia",
    "country": "USA"
  },
}
```
- All fields are required

Successful response structure:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGZmNWVmMzEwMzhkYzIwM2E2YTBkMyIsImVtYWlsIjoiamFja3NvbmJhMjFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJqYWNrc29hcnIiLCJpYXQiOjE3NjI2NTM2NzksImV4cCI6MTc2MzI1ODQ3OX0.CLdxVWX_pSkGvbeQ9vaEjVpw9L4FM26hhmX_xGH4X9E",
  "user": {
    "id": "690ff5ef31038dc203a6a0d3",
    "email": "user@gmail.com",
    "username": "username",
    "location": {
      "city": "Atlanta",
      "state": "Georgia",
      "country": "USA",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          -84.3898151,
          33.7544657
        ]
      }
    }
  }
}
```

### Authentication (for getting a JWT for subsequent requests)
`POST /api/auth/login`
```json
{
  "username": "username",
  "password": "password"
}
```
- Requires `username` and/or `email`

Successful response structure:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGZmNWVmMzEwMzhkYzIwM2E2YTBkMyIsImVtYWlsIjoiamFja3NvbmJhMjFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJqYWNrc29hcnIiLCJpYXQiOjE3NjI2NTM2NzksImV4cCI6MTc2MzI1ODQ3OX0.CLdxVWX_pSkGvbeQ9vaEjVpw9L4FM26hhmX_xGH4X9E",
  "user": {
    "id": "690ff5ef31038dc203a6a0d3",
    "email": "user@gmail.com",
    "username": "username",
    "location": {
      "city": "Atlanta",
      "state": "Georgia",
      "country": "USA",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          -84.3898151,
          33.7544657
        ]
      }
    }
  }
}
```

### Get user details
`GET /api/auth/me`
- Requires JWT in HTTP Header -> `"Bearer: <JWT>"`

Successful response structure:
```json
{
  "user": {
    "_id": "690fb48394df222f1b1bd60a",
    "email": "user@gmail.com",
    "username": "username",
    "createdAt": "2025-11-08T21:22:11.865Z",
    "updatedAt": "2025-11-08T21:22:11.865Z",
    "__v": 0
  }
}
```

## Bands

### Create Band
- This endpoint should be used when completing the frontend form to create a new band
- There will be a separate endpoint to upload image data that will then be associated with the band.


- Requires JWT in HTTP Header -> `"Bearer: <JWT>"`
`POST /api/bands/`

Expected Request Structure:
```json
{
  "name": "Jackson's band",
  "description": "A great band",
  "location": {
    "city": "Atlanta",
    "state": "Georgia",
    "country": "USA"
  },
  "topTracks": [
    "http://spotify.com",
    "http://soundcloud.com"
  ],
  "equipment": ["Drums", "Mic", "Bass Guitar"],
  "tags": ["Emo", "Cover Band"],
  "links": ["http://instagram", "http://bandcamp"],
  "genres": ["Grunge", "Rock"],
  "experienceLevel": "intermediate",
  "availability": [
    {
      "start": "2025-11-09T18:00:00.000Z",
      "end": "2025-11-09T23:00:00.000Z"
    },
    {
      "start": "2025-11-10T18:00:00.000Z",
      "end": "2025-11-10T23:00:00.000Z"
    }
  ],
  "contactInfo": {
    "email": "jacksonbarr2021@gmail.com",
    "phone": "770-377-5434"
  }
}
```
- Required fields
    - `name`
    - `location`
    - `experienceLevel`
    - `contactInfo`

Expected response structure:
```json
{
  "band": {
    "name": "Jackson's band",
    "description": "A great band",
    "headerImages": [
      "http://url1.com",
      "http://url2.com"
    ],
    "members": [
      "690f9e14bfc6722f29a5f684"
    ],
    "owner": "690f9e14bfc6722f29a5f684",
    "location": {
      "city": "Atlanta",
      "state": "Georgia",
      "country": "USA",
      "coordinates": {
        "type": "Point",
        "coordinates": [
          -84.3898151,
          33.7544657
        ]
      }
    },
    "topTracks": [
      "http://spotify.com",
      "http://soundcloud.com"
    ],
    "previousEvents": [],
    "equipment": [
      "Drums",
      "Mic",
      "Bass Guitar"
    ],
    "tags": [
      "Emo",
      "Cover Band"
    ],
    "links": [
      "http://instagram",
      "http://bandcamp"
    ],
    "genres": [
      "Grunge",
      "Rock"
    ],
    "experienceLevel": "intermediate",
    "availability": [
      {
        "start": "2025-11-09T18:00:00.000Z",
        "end": "2025-11-09T23:00:00.000Z"
      },
      {
        "start": "2025-11-10T18:00:00.000Z",
        "end": "2025-11-10T23:00:00.000Z"
      }
    ],
    "averageRating": null,
    "contactInfo": {
      "email": "jacksonbarr2021@gmail.com",
      "phone": "770-377-5434"
    },
    "_id": "690fe00360c6a023bb73a082",
    "createdAt": "2025-11-09T00:27:47.771Z",
    "updatedAt": "2025-11-09T00:27:47.771Z",
    "__v": 0
  }
}
```



### List Bands

- Lists bands and supports filtering and sorting. Requires authentication (JWT in Authorization header).

`GET /api/bands`

Query parameters (all optional):

- `sortStrategy` - `timePosted` (default) or `nearest`. When `nearest` is used the authenticated user's stored location `user.location.coordinates` is required and results are sorted by ascending distance. Each returned band will include a numeric `distanceMeters` field when `nearest` is used.
- `genres` - comma-separated list of genres (e.g. `genres=Rock,Grunge`). Matches bands that have any of the listed genres.
- `tags` - comma-separated list of tags (e.g. `tags=Emo,Cover`). Matches bands that have any of the listed tags.
- `experienceLevel` - one of `beginner`, `intermediate`, `professional`.
- `owner` - a MongoDB user id to filter by owner (we can use this for booking requests later probably)
- `search` - simple case-insensitive substring search against the band `name`.

Notes:

- Filters are ANDed together. For example `genres=Rock&experienceLevel=intermediate` returns bands that match both conditions.

Example requests:

`GET /api/bands` (most recent first)

`GET /api/bands?genres=Rock&experienceLevel=intermediate&sortStrategy=timePosted`

`GET /api/bands?sortStrategy=nearest` (authenticated user required)

Example successful response (truncated):

```json
{
  "bands": [
    {
      "_id": "690fe00360c6a023bb73a082",
      "name": "Jackson's band",
      "location": {
        "city": "Atlanta",
        "state": "Georgia",
        "country": "USA",
        "coordinates": { "type": "Point", "coordinates": [ -84.3898151, 33.7544657 ] }
      },
      "experienceLevel": "intermediate",
      "headerImages": ["https://storage.googleapis.com/..."],
      "distanceMeters": 1234.56, // present only when sortStrategy=nearest
      "createdAt": "2025-11-09T00:27:47.771Z"
    }
  ]
}
```

### Get Event by ID

- Retrieve a single event by its MongoDB id. Requires JWT in HTTP Header -> `"Bearer: <JWT>"`

`GET /api/events/:id`

Path parameters:

- `id` - MongoDB ObjectId of the event

Example request:

`GET /api/events/6910abcd1234ef567890ab12`

Example successful response:

```json
{
  "event": {
    "_id": "6910abcd1234ef567890ab12",
    "name": "Neighborhood Block Party",
    "eventDate": { "start": "2025-12-01T18:00:00.000Z", "end": "2025-12-01T22:00:00.000Z" },
    "location": { "city": "Atlanta", "state": "Georgia", "country": "USA", "coordinates": { "type": "Point", "coordinates": [ -84.3898151, 33.7544657 ] } },
    "compensation": 150,
    "requirements": ["mic", "stage"],
    "equipmentProvided": ["pa", "lighting"],
    "contactInfo": { "email": "organizer@example.com", "phone": "555-123-4567" },
    "owner": "690f9e14bfc6722f29a5f684",
    "createdAt": "2025-11-26T12:00:00.000Z"
  }
}
```

## Events
### Create Event

- Use this endpoint when creating a new event (organizer/host creates an event).
- Requires JWT in HTTP Header -> `"Bearer: <JWT>"`
`POST /api/events/`

Expected Request Structure:
```json
{
  "name": "Neighborhood Block Party",
  "description": "An evening of live music and food",
  "image": "https://storage.googleapis.com/...",
  "capacity": "200",
  "compensation": 150.0,
  "eventDate": { "start": "2025-12-01T18:00:00.000Z", "end": "2025-12-01T22:00:00.000Z" },
  "location": { "city": "Atlanta", "state": "Georgia", "country": "USA" },
  "requirements": ["mic", "stage"],
  "equipmentProvided": ["PA", "lighting"],
  "contactInfo": { "email": "organizer@example.com", "phone": "555-123-4567" }
}
```
- Required fields
  - `name`
  - `location`
  - `eventDate` (start and end)
  - `contactInfo`

Expected response structure:
```json
{
  "event": {
    "_id": "6910abcd1234ef567890ab12",
    "name": "Neighborhood Block Party",
    "description": "An evening of live music and food",
    "image": "https://storage.googleapis.com/...",
    "capacity": "200",
    "compensation": 150,
    "eventDate": { "start": "2025-12-01T18:00:00.000Z", "end": "2025-12-01T22:00:00.000Z" },
    "location": {
      "city": "Atlanta",
      "state": "Georgia",
      "country": "USA",
      "coordinates": { "type": "Point", "coordinates": [ -84.3898151, 33.7544657 ] }
    },
    "requirements": ["mic", "stage"],
    "equipmentProvided": ["pa", "lighting"],
    "contactInfo": { "email": "organizer@example.com", "phone": "555-123-4567" },
    "owner": "690f9e14bfc6722f29a5f684",
    "createdAt": "2025-11-26T12:00:00.000Z"
  }
}
```


### List Events

- Lists events and supports filtering and sorting. Requires authentication (JWT in Authorization header).

`GET /api/events`

Query parameters (all optional):

- `sortStrategy` - one of:
  - `timePosted` (default) — most recent first
  - `nearest` — requires authenticated user's `user.location.coordinates`; returns `distanceMeters` for each item
  - `compensation` — sort by compensation descending
- `search` - simple case-insensitive substring search against the event `name`.
- `requirements` - comma-separated list (e.g. `requirements=mic,stage`). Matches events that include all listed requirements (matching is performed against lowercased requirement entries).
- `equipmentProvided` - comma-separated list (e.g. `equipmentProvided=PA,lighting`). Matches events that include all listed equipment (matching is performed against lowercased equipment entries).
- `startDate` / `endDate` - ISO8601 dates to filter events whose `eventDate.start` falls within the provided range.

Notes:

- Filters are ANDed together. For example `requirements=mic&equipmentProvided=PA&sortStrategy=compensation` returns events that match both conditions and are sorted by compensation.
- `nearest` requires the authenticated user to have `user.location.coordinates` available; otherwise the server falls back to `timePosted`.

Example requests:

`GET /api/events` (most recent first)

`GET /api/events?startDate=2025-12-01T00:00:00.000Z&endDate=2025-12-31T23:59:59.999Z&sortStrategy=compensation`

`GET /api/events?requirements=mic,stage&sortStrategy=nearest` (authenticated user required)

Example successful response (truncated):

```json
{
  "events": [
    {
      "_id": "6910abcd1234ef567890ab12",
      "name": "Neighborhood Block Party",
      "eventDate": { "start": "2025-12-01T18:00:00.000Z", "end": "2025-12-01T22:00:00.000Z" },
      "location": { "city": "Atlanta", "state": "Georgia", "country": "USA", "coordinates": { "type": "Point", "coordinates": [ -84.3898151, 33.7544657 ] } },
      "compensation": 150,
      "distanceMeters": 432.21,
      "createdAt": "2025-11-26T12:00:00.000Z"
    }
  ]
}
```

## A/B testing: explore default sort (frontend integration)

High-level behavior
- When the frontend calls `GET /api/bands` without a `sortStrategy` parameter, the server treats that as an "explore" call. If the user does not already have an assigned experiment, the server assigns them to group A or B (50/50) and persists the assignment on the user document under `user.experiment` (object with `name`, `group`, `assignedAt`). The server also records an assignment event in the `ABTestMetric` collection.
- Group mapping used by the server (default):
  - Group A -> default sort `nearest`
  - Group B -> default sort `timePosted`
- If the client explicitly sends `?sortStrategy=nearest` or `?sortStrategy=timePosted`, the server will honor that explicit request and not reassign the user.
  - This represents the situation where a user loaded the explore page with the default strategy, and then specifically switched to a different strategy

Endpoints for A/B event recording
- POST /api/experiments/record (authenticated)
  - Body: `{ "eventType": string, "details"?: object }`
  - Allowed `eventType` values: `assignment`, `switch_sort`, `scrolls_before_match`, `booking`.
  - The server will save an `ABTestMetric` document with `user`, `group` (from `req.user.experiment` if present), `eventType`, and `details`.

Recommended frontend integration
1) Initial explore load:
   - Call `GET /api/bands` without `sortStrategy` (and include the Authorization header). This triggers assignment for first-time users and returns bands sorted by the effective strategy for that user. Use the returned list and any included `distanceMeters` field (present when `nearest` is used).

   Example (fetch):

   ```js
   const res = await fetch('/api/bands', {
     headers: { Authorization: `Bearer ${token}` }
   });
   const { bands } = await res.json();
   // render bands
   ```

2) User switches sorting in the UI:
   - If the user toggles the sort strategy in the UI (e.g. from nearest to timePosted), call the experiments record endpoint to log the action. This helps measure interaction ratio by sorting strategy.

   Example payload (switch_sort):
   ```json
   { "eventType": "switch_sort", "details": { "from": "nearest", "to": "timePosted" } }
   ```

3) Track scrolls before match:
   - When a user finds a band they want to contact/book (or triggers whatever you define as a match), send `scrolls_before_match` with the number of times the user scrolled (or pages viewed) before arriving at that match.

   Example payload:
   ```json
   { "eventType": "scrolls_before_match", "details": { "scrolls": 7, "matchedBandId": "690fe00360c6a023bb73a082" } }
   ```

4) Booking events:
   - When the user books/contacts a band, send `booking` events with relevant details.




