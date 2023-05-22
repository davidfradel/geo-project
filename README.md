# Geolocation Data Processor

## Introduction
This project is a small backend application built with Node.js that processes geolocation data in the form of routes travelled by vehicles. The geolocation data is contained in a file named `data.json`, with each route comprising a series of location points specified by longitude and latitude coordinates along with a timestamp.

## Features
The application exposes a REST API with three services:

1. A service that returns the list of all routes. It returns all the attributes of the route documents, except the location points.

2. A service that returns the list of location points for a route specified by an identifier (id).

3. A service that returns the total distance travelled over a time period passed as a parameter. The result is expressed in meters.

## Prerequisites
- Node.js v14.0 or later
- npm v6.0 or later

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/davidfradel/geo-project.git

2. Navigate to the project directory:
   ```bash
   cd geo-project

3. Install the dependencies:
   ```bash
   npm install

## Usage

To run the server, use the following command:
```bash
npm start
```

This will start the server at `http://localhost:3000`.

The available endpoints are:

- `GET /routes` - Fetches the list of all routes (without location points).
- `GET /routes/:id` - Fetches the list of location points for a route specified by the `id`.
- `GET /distance` - Fetches the total distance traveled over a period specified by `start` and `end` query parameters in ISO 8601 format.

For example, to fetch the total distance travelled between January 1, 2022 and December 31, 2022, you would send a GET request to `http://localhost:3000/distance?start=2022-01-01T00:00:00Z&end=2022-12-31T23:59:59Z`.

## Testing

The project includes Mocha and Chai for testing. To run the tests, use the following command:

```bash
npm test
```

Please ensure the server is not running before executing the tests, as they will start and stop the server automatically.



