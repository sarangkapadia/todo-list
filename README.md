
# Todo List API

This is a RESTful API for managing todo lists, built with Node.js, Express, MongoDB, and Redis.

## Features

- Allows users to create, update, and view todo lists.
- Implements rate limiting algorithms to prevent abuse and ensure fair usage.
- Utilizes Redis for rate limiting storage.
- Stores todo lists in MongoDB.

## Installation

1. Clone the repository: `git clone https://github.com/your_username/todo-list-api.git`
2. Install dependencies: `npm install`
3. Set up MongoDB and Redis servers.
4. Create a `.env` file with the following variables:
    ```
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    REDIS_HOST=your_redis_host
    REDIS_PORT=your_redis_port
    REDIS_PASSWORD=your_redis_password
    ```
5. Run the application: `npm start`

## Usage

1. Access the API through a REST client or HTTP requests.
2. Use the provided endpoints to manage todo lists and users.

## Endpoints

- `GET /user/:id`: Retrieve all todos for a specific user.
- `PUT /user/:id`: Add a todo for a specific user.
- `POST /create/user`: Create a new user.

## Rate Limiting

Two rate limiting algorithms are implemented:

1. **Fixed Window Rate Limiter**: Limits requests to 3 per minute per user.
2. **Token Bucket Rate Limiter**: Limits requests based on tokens available in a bucket, allowing 3 requests per minute with a token refresh every 20 seconds.

## Dependencies

- [Express](https://www.npmjs.com/package/express): Web application framework for Node.js.
- [Mongoose](https://www.npmjs.com/package/mongoose): MongoDB object modeling tool.
- [Redis](https://www.npmjs.com/package/redis): Redis client for Node.js.

## Contributors

- [Your Name](https://github.com/your_username)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
