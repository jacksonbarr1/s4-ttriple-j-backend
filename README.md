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



