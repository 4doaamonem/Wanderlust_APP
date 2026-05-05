 Wanderlust - Backend API Handover (Enhancements)
Author: Doaa AbdelMonem (Lead Backend Developer)
Status: Production Ready
Swagger Documentation: [View Swagger UI](https://designing-unworried-left.ngrok-free.dev/api#/)

 KEY ARCHITECTURAL ENHANCEMENTS (PLEASE READ)
The following updates were implemented to improve system security, performance, and API consistency:
1. Centralized Profile Management
Update: All personal data (Favorites, Plans, Profile Info) has been moved under the /profile prefix.
Reason: This organizes the Swagger UI and ensures that all user-specific data is logically grouped.
2. Travel Plans Path Optimization
Update: The endpoint for fetching a user's plans is now GET /profile/plans/user.
Previous Path: GET /plans/:userId.
Reason: This enhancement leverages the JWT Token to identify the user automatically. It removes the need to pass a userId in the URL, preventing unauthorized access to other users' plans.
3. Smart Toggle Logic for Favorites
Update: We now use a single POST /profile/favorites endpoint to handle both adding and removing items.
Reason: This simplifies the Frontend logic (one button, one API call) and keeps the database in sync.

 Updated API Reference
Authentication
All endpoints below require a JWT Bearer Token in the Authorization header.
### **Endpoints Table**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/profile` | Get basic profile information and preferences. |
| **GET** | `/profile/plans/user` | **(NEW)** Get all plans belonging to the logged-in user. |
| **GET** | `/profile/favorites` | Get the list of all places saved to favorites. |
| **POST** | `/profile/favorites` | **(NEW)** Add or Remove a favorite based on `placeId`. |
| **DELETE** | `/profile/favorites/:id` | Manually delete a specific favorite entry by its ID. |


 Integration Notes for Frontend
Request Body (POST Favorites):
JSON
{
  "placeId": "string"
}




Naming Convention: All JSON keys use camelCase.
Strict Validation: The API uses a strict Validation Pipe. Sending extra properties not defined in the DTO will result in a 400 Bad Request.
Clean Code Standards: The "any" type has been strictly avoided to ensure type safety across the project.



