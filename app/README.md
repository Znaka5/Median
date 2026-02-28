Project Name 'Median' (heading)

Topic: A hybrid between a social blog and a forum like Reddit,
with inspirations from other sources like Steam profile UI and Instagram's
style and app icons.

How to run?

Install the app repo.
You'd need Android Studio, React Native CLI and the npm packets
after installing the first two open the project at root /app
then run 'npx react-native run-android'
(Make sure you have USB debbuging enabled on your phone)

Alternatively use this .apk artifact from the link below
https://github.com/Znaka5/Median/releases/tag/Median-first-release

User Access & Permissions

Guests: Cannot access any screen except the following:
1. Register screen - so they can register
2. Login screen - if they're an existing user 
3. Forgotten password screen - if by any chance an existing user has forgoten their password

Logged in user: Authenticated User, can access every other screen like:
1. The main boards page 
2. Each board's details
3. Their profile page
4. The settings page 
Other components visible include:
1. The navigation tab
2. The boards sort tab
3. The profile nav buttons
4. The profile's onwer posts 
(And these are just the summed versions)

# Authentication & Session Handling

## Authentication Flow

### App Start

* `AuthProvider` wraps the app and manages auth state.
* Firebase checks for an existing saved session using `onAuthStateChanged`.
* If a user session exists → user data is loaded.
* If not → user is `null`.
* App shows authenticated or login screens accordingly.

### Authentication Check

* Firebase automatically persists sessions on the device.
* On launch, it restores the user if previously logged in.
* A token is retrieved and stored in state.

### Login

* User enters email and password on the Login screen.
* Firebase verifies credentials.
* On success:

  * User is signed in
  * Token retrieved
  * App state updated
  * User enters the app

### Registration

* User creates account with email and password.
* Firebase creates the account and signs in automatically.
* User state and token are stored.
* User enters the app immediately.

### Logout

* Logout button calls `signOut`.
* Firebase clears the session.
* Auth state becomes `null`.
* App returns to login/register screens.

---

## Session Persistence

### Session Storage

* Handled automatically by Firebase Auth.
* Stored securely on the device.
* No manual storage implemented in the app.

### Automatic Login After Restart

* When the app restarts:

  * Firebase restores the saved session.
  * User is automatically signed in.
  * No credentials required again.

---

## Protected Screens

* Screens check if a user exists via `useAuth`.
* If no user → protected content is not rendered.

---

## Summary

* Firebase manages authentication and persistence.
* Context provides global auth state.
* UI reacts to auth changes.

Result: secure login, automatic session restore, and protected access control.

Navigation Summary

The app uses authentication-aware navigation that switches between two main flows depending on whether the user is logged in.

Root Navigator

Acts as the entry point for navigation.

Checks authentication state from AuthContext.

While session is being restored → shows a loading screen.

Chooses which navigation stack to render:

Authenticated (token exists) → MainTabs

Unauthenticated (no token) → AuthStack

Unauthenticated Flow — AuthStack

Displayed when the user is not logged in.

Screens:

Login

Register

Forgot Password

Purpose:

Allows account access or creation before entering the app.

Authenticated Flow — MainTabs

Displayed after successful login or registration.

Uses bottom tab navigation with two main sections:

Feed Tab (FeedStack)

Handles content browsing and post management.

Screens:

Feed (main boards list)

Post Details

Edit Post

Create Post

Profile Tab (ProfileStack)

Handles user account and settings.

Screens:

Profile Home

Profile Settings

Post Details (viewed from profile)

Navigation Behavior

Logging in switches from AuthStack to MainTabs.

Logging out switches back to AuthStack.

Protected screens are only accessible inside the authenticated flow.

Result

This structure ensures:

Clear separation between public and private areas

Secure access control

Smooth transitions after login/logout

Organized feature grouping by tabs and stacks

## List → Details Flow

### List / Overview Screen (Feed)

**Type of data displayed**

* Collection of posts from the database
* Each item shows summary information:

  * Title
  * Short body text
  * Author name
  * Creation date
  * Like state
  * Comment count (if shown in card)

**User interaction with the list**

* Scroll through posts (vertical list)
* Pull-to-refresh to reload data
* Tap a post card to open details
* Tap like button to like/unlike (if implemented)
* List updates automatically after changes (create/edit/delete)

---

### Details Screen (Post Details)

**How navigation is triggered**

* User taps a post item in the list
* Navigation is called with the selected post ID
* Example action: open details screen for that post

---

**Data received via route parameters**

* The unique post identifier:

  * `postId`

**How the data is used**

* Details screen uses `postId` to find the full post data from context
* Displays complete information:

  * Full title
  * Full body
  * Author
  * Timestamp
  * Comments

**Additional interactions on details screen**

* Add a comment
* Delete own comment
* Edit post (if owner)
* Delete post (if owner)

---

### Flow Summary

1. User sees list of posts
2. User selects a post
3. App navigates to details with post ID
4. Details screen loads full post data
5. User interacts with the selected post

## Data Source & Backend

### Backend Type

**Real backend — Firebase**

The application uses Firebase as a real cloud backend service for authentication and data storage.

---

### Services Used

#### Firebase Authentication

* Handles user registration, login, logout, and session persistence
* Uses React Native persistence via AsyncStorage
* Maintains authentication state across app restarts

Configuration:

* Initialized with `initializeAuth`
* Persistence set to device storage

---

#### Cloud Firestore Database

Used as the main database for application data.

**Collections**

* `posts` — stores all posts
* `posts/{postId}/likes` — stores user likes per post
* (Optional) comments stored inside post documents

---

### Data Operations

#### Fetching Data

* Retrieves all posts from Firestore
* Optionally checks if the current user liked each post
* Combines post data with user-specific state

---

#### Creating Data

* New posts added to the `posts` collection
* Includes:

  * Title
  * Body
  * Author info
  * Timestamp

---

#### Updating Data

* Edit post content
* Update like counts using atomic increments
* Modify comments or other fields

---

#### Deleting Data

* Remove posts from database
* Remove likes or comments as needed

---

### Likes System

* Each like stored as a document in a subcollection:

  `posts/{postId}/likes/{userId}`

* Toggling like:

  * If like exists → remove it and decrement counter
  * If not → create it and increment counter

This ensures:

* Accurate like counts
* Per-user like tracking
* Scalable design

---

### Why Firebase

* Real-time cloud backend
* Secure authentication
* Scalable NoSQL database
* No custom server required

---

### Summary

The app uses a **real backend (Firebase)** providing:

* Authentication services
* Persistent cloud database
* User-specific interactions (likes, comments)
* Scalable data storage

Result: a fully functional backend supporting real users and live data.

## Data Source & Backend (Including Profile Settings)

### Backend Type

**Real backend — Firebase**

The application uses Firebase for authentication, database storage, and user profile management.

---

### Services Used

#### Firebase Authentication

* Manages user identity (login, registration, logout)
* Supports secure email changes (requires reauthentication)
* Maintains persistent sessions on the device

---

#### Cloud Firestore Database

Stores application data and user profiles.

**Collections**

* `posts` — user posts
* `posts/{postId}/likes` — likes per post
* `users` — profile information

---

### User Profile Data (Profile Settings)

Stored in the `users` collection per user ID.

**Fields managed**

* Display name (username)
* Email (synced with authentication)
* Favorite music preference
* Avatar image
* Banner image
* Theme preference (via app settings)

---

### Profile Data Operations

#### Updating Username

* Saves new display name to the user document
* Merges with existing profile data
* Does not affect authentication credentials

---

#### Updating Email

Requires secure verification:

1. User enters current password
2. App reauthenticates the user
3. Firebase updates the email in Auth
4. Firestore profile document is updated

This ensures account security.

---

#### Updating Favorite Music

* Saves preference to the user document
* Used for profile display personalization

---

### Post Data Operations

* Create posts with title, body, publish date
* Edit existing posts
* Delete posts
* Add and remove comments
* Like and unlike posts

All stored in Firestore.

---

### Why Firebase

* Provides authentication and database in one platform
* Real-time data synchronization
* Secure operations for sensitive changes
* Scalable cloud storage
* No custom backend required

---

### Summary

The backend supports:

* User authentication
* Posts and interactions
* Likes and comments
* Profile customization
* Secure account updates

Result: a complete real backend handling both content and user management.

# Forms, Native Features, User Flow & Error Handling

## Forms & Validation

### Forms Used

* Login form
* Registration form
* Forgot Password form
* Create Post form
* Edit Post form
* Profile Settings forms (username, email, preferences)

### Validation Rules (Examples)

* **Email** — required, must match email format
* **Password** — required, minimum length (e.g., 6 characters)
* **Post Title** — required, minimum length (e.g., 3 characters)
* **Post Body** — required, minimum length (e.g., 10 characters)
* **Confirm Password** — must match password (multiple validation rules)
* **Publish Date** — required, restricted within allowed date range

---

## Native Device Features

### Used Native Feature

**Image Picker (Gallery Access)**

### Usage Description

* Used in the Profile section
* Allows users to select avatar and banner images from their device
* Enables profile customization with personal images

---

## Typical User Flow

1. User registers or logs in
2. User enters the main app and views the posts feed
3. User opens a post to see details or creates a new post
4. User manages profile settings or logs out

---

## 12. Error & Edge Case Handling

* **Authentication errors** — displayed when login or registration fails
* **Network/data errors** — shown if database operations fail
* **Validation errors** — shown for incorrect form input
* **Empty or missing data** — fallback messages (e.g., post not found)

---

## Summary

The app ensures reliable interaction through validated forms, use of native device capabilities, a clear user journey, and comprehensive error handling for both user input and system issues.