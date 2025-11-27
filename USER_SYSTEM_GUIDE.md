# Unified User System - Role-Based Validation

## Overview
The user system has been refactored to use a single `User` entity with role-based field requirements. Fields are validated based on the user's role.

## User Roles & Required Fields

| Role | Required Fields |
|------|----------------|
| **Patient** | `name`, `phone`, `password` |
| **Doctor** | `name`, `phone`, `bmdcCode`, `password` |
| **Admin** | `name`, `email`, `password` |

## Database Schema

The `User` entity includes:
- `id` - Primary key (auto-generated)
- `name` - Required for all users
- `passwordHash` - Required for all users
- `role` - Enum: `patient`, `doctor`, `admin`
- `email` - Required for admin, optional for others (unique)
- `phone` - Required for patient and doctor (unique)
- `bmdcCode` - Required for doctor only (unique)
- `createdAt` - Auto-generated timestamp
- `updatedAt` - Auto-updated timestamp
- `medications` - Relationship to medications

## API Endpoints

### 1. Create Patient
```http
POST /users/patients
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+8801712345678",
  "password": "password123"
}
```

**Validation:**
- ✅ Name is required
- ✅ Phone is required (and must be unique)
- ✅ Password is required (min 6 characters)

---

### 2. Create Doctor
```http
POST /users/doctors
Content-Type: application/json

{
  "name": "Dr. John Smith",
  "email": "doctor@example.com",
  "phone": "+8801712345678",
  "bmdcCode": "A-12345",
  "password": "password123"
}
```

**Validation:**
- ✅ Name is required
- ✅ Email is required (valid email format, unique)
- ✅ Phone is required (unique)
- ✅ BMDC code is required (unique)
- ✅ Password is required (min 6 characters)

---

### 3. Create Admin
```http
POST /users/admins
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

**Validation:**
- ✅ Name is required
- ✅ Email is required (valid email format, unique)
- ✅ Password is required (min 6 characters)

---

### 4. Create Generic User (with role)
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "password": "password123",
  "role": "patient",
  "phone": "+8801712345678"
}
```

**Dynamic Validation:**
- The API validates required fields based on the `role` field
- If `role` is `patient`, then `phone` is required
- If `role` is `doctor`, then `phone` and `bmdcCode` are required
- If `role` is `admin`, then `email` is required

## Error Handling

### Missing Required Field
If a required field is missing, you'll get a `400 Bad Request`:
```json
{
  "statusCode": 400,
  "message": "Phone is required for patient users",
  "error": "Bad Request"
}
```

### Duplicate Credentials
If email, phone, or BMDC code already exists:
```json
{
  "statusCode": 400,
  "message": "Phone number already exists",
  "error": "Bad Request"
}
```

## Service Methods

### Creating Users
```typescript
// Create patient
const patient = await usersService.createPatient({
  name: 'Jane Doe',
  phone: '+8801712345678',
  password: 'password123'
});

// Create doctor
const doctor = await usersService.createDoctor({
  name: 'Dr. John Smith',
  email: 'doctor@example.com',
  phone: '+8801712345678',
  bmdcCode: 'A-12345',
  password: 'password123'
});

// Create admin
const admin = await usersService.createAdmin({
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123'
});

// Create generic user with role
const user = await usersService.createUser({
  name: 'John Doe',
  password: 'password123',
  role: UserRole.PATIENT,
  phone: '+8801712345678'
});
```

### Finding Users
```typescript
// Find by email (admin)
const user = await usersService.findByEmail('admin@example.com');

// Find by phone (patient/doctor)
const user = await usersService.findByPhone('+8801712345678');

// Find by BMDC code (doctor)
const doctor = await usersService.findByBmdcCode('A-12345');

// Find by ID
const user = await usersService.findById(1);

// Find all users
const allUsers = await usersService.findAllUsers();

// Find by role
const patients = await usersService.findAllPatients();
const doctors = await usersService.findAllDoctors();
const admins = await usersService.findAllAdmins();
```

## Migration Notes

### What Changed
1. ✅ Unified `User` entity replaces separate `Patient`, `Doctor`, and `Admin` entities
2. ✅ Added `UserRole` enum for type-safe role management
3. ✅ Role-based field validation in DTOs and service layer
4. ✅ Automatic duplicate checking for email, phone, and BMDC code
5. ✅ Password hashing handled automatically in service methods

### What to Do Next
1. **Optional:** Delete old entity files:
   - `src/users/entities/patient.entity.ts`
   - `src/users/entities/doctor.entity.ts`
   
2. **Required:** Run database migration to create the new `users` table:
   ```bash
   npm run migration:generate -- src/migrations/UnifiedUserEntity
   npm run migration:run
   ```

3. **Optional:** Update any existing authentication logic to use the unified entity

## Example Usage in Controllers

```typescript
@Post('patients')
async createPatient(@Body() createPatientDto: CreatePatientDto) {
  return this.usersService.createPatient(createPatientDto);
}

@Post('doctors')
async createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
  return this.usersService.createDoctor(createDoctorDto);
}

@Post('admins')
async createAdmin(@Body() createAdminDto: CreateAdminDto) {
  return this.usersService.createAdmin(createAdminDto);
}

@Post()
async createUser(@Body() createUserDto: CreateUserDto) {
  return this.usersService.createUser(createUserDto);
}
```

## Benefits

1. **Single Source of Truth** - One entity manages all user types
2. **Type Safety** - TypeScript enum ensures valid roles
3. **Automatic Validation** - Role-based field requirements enforced at creation
4. **Cleaner Code** - Less duplication across entities
5. **Flexible** - Easy to add new roles or fields in the future
