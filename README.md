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
  "password": "password"
}
```
- All fields are required

Successful response structure:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGZlMTk3NDBiZGFiNTY3ZmIxNWRmZiIsImVtYWlsIjoiamFja3NvbmJhMDIxQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiamFja3NvbmFyciIsImlhdCI6MTc2MjY0ODQ3MSwiZXhwIjoxNzYzMjUzMjcxfQ.KH3HrYg5Ckg2ZF846ex6QA6anHazNpetrEfTRgfqFjA",
  "user": {
    "id": "690fe19740bdab567fb15dff",
    "email": "user@gmail.com",
    "username": "username"
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGY5ZTE0YmZjNjcyMmYyOWE1ZjY4NCIsImVtYWlsIjoiamFja3NvbmJhcnIyMDIxQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiamFja3NvbmJhcnIiLCJpYXQiOjE3NjI2NDg2MjEsImV4cCI6MTc2MzI1MzQyMX0.E0mdD1UZkNHNKCu-u6LfLa0zSQWpSWBlyF_7LpDwNb0",
  "user": {
    "id": "690f9e14bfc6722f29a5f684",
    "email": "user@gmail.com",
    "username": "username"
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



