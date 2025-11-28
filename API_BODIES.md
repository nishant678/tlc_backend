# All API Request Bodies

## 🔐 Authentication APIs

### 1. Register User
**POST** `http://localhost:8000/api/auth/register`
- **Access**: Public
- **Content-Type**: `multipart/form-data` (for file upload)
- **Headers**: None required

**Body (form-data):**
```
name: "John Doe"
email: "john@example.com"
mobile_number: "1234567890"
password: "password123"
dob: "1990-01-01"
gender: "male"
user_profile: [FILE] (optional - image file)
```

**Body (JSON - if no image):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "1234567890",
  "password": "password123",
  "dob": "1990-01-01",
  "gender": "male"
}
```

---

### 2. Login User
**POST** `http://localhost:8000/api/auth/login`
- **Access**: Public
- **Content-Type**: `application/json`

**Body:**
```json
{
  "mobile_number": "1234567890",
  "password": "password123"
}
```

---

### 3. Get Current User Profile
**GET** `http://localhost:8000/api/auth/me`
- **Access**: Protected
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Body**: None

---

### 4. Get Profile Details
**GET** `http://localhost:8000/api/auth/profile`
- **Access**: Protected
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Body**: None

---

## 📝 Question Type APIs

### 1. Add Question Type
**POST** `http://localhost:8000/api/question-types`
- **Access**: Protected
- **Content-Type**: `application/json`
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```

**Body:**
```json
{
  "type_name": "Multiple Choice",
  "icon": "https://example.com/icon.png"
}
```

---

### 2. Get All Question Types (with count)
**GET** `http://localhost:8000/api/question-types`
- **Access**: Public
- **Body**: None

---

### 3. Get Question Type by ID
**GET** `http://localhost:8000/api/question-types/:id`
- **Access**: Public
- **Body**: None
- **Example**: `http://localhost:8000/api/question-types/1`

---

### 4. Update Question Type
**PUT** `http://localhost:8000/api/question-types/:id`
- **Access**: Protected
- **Content-Type**: `application/json`
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Example URL**: `http://localhost:8000/api/question-types/1`

**Body (all fields optional):**
```json
{
  "type_name": "Updated Type Name",
  "icon": "https://example.com/new-icon.png"
}
```

**Body (partial update - only one field):**
```json
{
  "type_name": "Updated Type Name"
}
```
or
```json
{
  "icon": "https://example.com/new-icon.png"
}
```

---

### 5. Delete Question Type
**DELETE** `http://localhost:8000/api/question-types/:id`
- **Access**: Protected
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Body**: None
- **Example URL**: `http://localhost:8000/api/question-types/1`

---

## ❓ Question Answer APIs

### 1. Add Question Answer
**POST** `http://localhost:8000/api/question-answers`
- **Access**: Protected
- **Content-Type**: `application/json`
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```

**Body:**
```json
{
  "type_id": 1,
  "question": "What is the capital of France?",
  "option1": "London",
  "option2": "Berlin",
  "option3": "Paris",
  "option4": "Madrid",
  "correct_answer": 3
}
```

**Note**: `correct_answer` must be 1, 2, 3, or 4 (representing which option is correct)

---

### 2. Get Question Answers by Type ID
**GET** `http://localhost:8000/api/question-answers/type/:typeId`
- **Access**: Public
- **Body**: None
- **Example URL**: `http://localhost:8000/api/question-answers/type/1`

---

### 3. Update Question Answer
**PUT** `http://localhost:8000/api/question-answers/:id`
- **Access**: Protected
- **Content-Type**: `application/json`
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Example URL**: `http://localhost:8000/api/question-answers/1`

**Body (all fields optional - only send fields you want to update):**
```json
{
  "type_id": 1,
  "question": "Updated question text?",
  "option1": "Updated option 1",
  "option2": "Updated option 2",
  "option3": "Updated option 3",
  "option4": "Updated option 4",
  "correct_answer": 2
}
```

**Body (partial update - only some fields):**
```json
{
  "question": "What is 2+2?",
  "correct_answer": 2
}
```

---

### 4. Delete Question Answer
**DELETE** `http://localhost:8000/api/question-answers/:id`
- **Access**: Protected
- **Headers**: 
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Body**: None
- **Example URL**: `http://localhost:8000/api/question-answers/1`

---

## 📋 Complete Example Workflow

### Step 1: Register User
```json
POST http://localhost:8000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "1234567890",
  "password": "password123",
  "dob": "1990-01-01",
  "gender": "male"
}
```

### Step 2: Login (Get Token)
```json
POST http://localhost:8000/api/auth/login
{
  "mobile_number": "1234567890",
  "password": "password123"
}
```
**Response includes token** - save this token for protected routes

### Step 3: Add Question Type
```json
POST http://localhost:8000/api/question-types
Authorization: Bearer <token>
{
  "type_name": "Math Quiz",
  "icon": "https://example.com/math-icon.png"
}
```

### Step 4: Get Question Types List
```
GET http://localhost:8000/api/question-types
```
(No auth required)

### Step 5: Add Question Answer
```json
POST http://localhost:8000/api/question-answers
Authorization: Bearer <token>
{
  "type_id": 1,
  "question": "What is 2+2?",
  "option1": "3",
  "option2": "4",
  "option3": "5",
  "option4": "6",
  "correct_answer": 2
}
```

### Step 6: Get Questions by Type
```
GET http://localhost:8000/api/question-answers/type/1
```
(No auth required)

### Step 7: Update Question Answer
```json
PUT http://localhost:8000/api/question-answers/1
Authorization: Bearer <token>
{
  "question": "What is 2+3?",
  "correct_answer": 1
}
```

### Step 8: Delete Question Answer
```
DELETE http://localhost:8000/api/question-answers/1
Authorization: Bearer <token>
```

---

## 🔑 Important Notes

1. **Authentication**: Protected routes require `Authorization: Bearer <token>` header
2. **Correct Answer**: Must be 1, 2, 3, or 4 (representing option1, option2, option3, or option4)
3. **File Upload**: Register endpoint accepts `multipart/form-data` for profile image
4. **Partial Updates**: Update endpoints accept partial data - only send fields you want to change
5. **Type ID**: Must exist in question_types table before adding questions
6. **Cascade Delete**: Deleting a question type will automatically delete all its questions

