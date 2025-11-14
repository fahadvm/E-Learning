export enum MESSAGES {
  COMPANY_FETCHED = 'Company fetched',
  LEARNING_PATHS_FETCHED ="Learning paths fetched",
  LEARNING_PATH_ASSIGNED = "Learning path assigned",
  LEARNING_PATH_UNASSIGNED = "Learning path unassigned",
  COMPANY_FOUND = 'Company found',
  REQUEST_SENT = 'Request sent',
  REQUEST_CANCELLED = 'Request cancelled',
  LEFT_COMPANY = 'Left company',
  REQUESTED_EMPLOYEES_FETCHED = 'Requested employees fetched successfully',
  EMPLOYEE_REQUEST_APPROVED = 'Employee request approved successfully',
  EMPLOYEE_REQUEST_REJECTED = 'Employee request rejected',
  GOOGLE_TOKEN_INVALID = 'Invalid Google token',
  GOOGLE_TOKEN_MISSING_FIELDS = 'Google token missing required fields',
  USER_NOT_LINKED_GOOGLE = 'User is not linked to Google',
  ALREADY_REQUESTED_COMPANY = 'You have already requested a company',
  ALREADY_REQUESTED_VERIFICATION = 'You have already requested verification',
  COMPLETE_PROFILE = 'Please complete your profile details',
  ALREADY_VERIFIED = 'You have already verified',
  NO_REQUEST_FOUND = 'No request found',
  NOT_PART_OF_COMPANY = 'Not part of any company',
  ORDERS_NOT_FOUND = 'No orders found',
  COMPANY_ORDERS_FETCHED = 'Company orders fetched successfully',
  STUDENT_ORDERS_FETCHED = 'Student orders fetched successfully',
  AVAILABILITY_FETCHED = 'Teacher availability fetched successfully.',
  BOOKING_CREATED = 'Booking created successfully.',
  BOOKING_CANCELLED = 'Booking cancelled successfully.',
  BOOKING_RESCHEDULLED = 'Booking cancelled Reschedulled.',
  BOOKING_APPROVED = 'Booking approved successfully.',
  PAYMENT_SUCCESS = 'Payment processed successfully.',
  HISTORY_FETCHED = 'Booking history fetched successfully.',
  TEACHER_AVAILABILITY_FETCHED = 'Teacher availability fetched successfully.',
  TEACHER_AVAILABILITY_NOT_FOUND = 'Teacher availability not found.',
  AVAILABLE_SLOTS_FETCHED = 'Teacher available slots fetched successfully.',
  COMPLETD_LESSON_MARKED = 'Lesson completed marked successfully.',
  CODE_RUN_SUCCESSFULLY = 'Code completed run successfully.',
  NOTE_SAVED_SUCCESSFULLY = 'Note saved successfully.',
  RECORD_CREATION_FAILED = "Failed to update or create learning record",
  
  COMPANY_VERIFICATION_SUBMITTED = "company verification submitted successfully",
  STREAK_FAILED = "Failed to update or create streak",

  NOTIFICATION_MARKED_AS_READ= 'Notification marked as read successfully.',
  NOTIFICATION_ID_REQUIRED= 'Notification ID is required.',
  MAX_4_ALLOWED= 'Max 4 slots allowed per day.',
  CREATED_SUCCESS= 'Learning Path created successfully.',
  FETCHED_SUCCESS= 'Learning Path fetched successfully.',
  UPDATED_SUCCESS= 'Learning Path updated successfully.',
  PROFILE_UPDATE_FAILED= 'Profile updatation failed.',
  DELETED_SUCCESS= 'Learning Path deleted successfully.',
  LEARNING_PATH_ALREADY_ASSIGNED = "Learning Path already assigned",
  LEARNING_PATH_ASSIGNMENT_NOT_FOUND = "Learning Path Assignment not found",
  LEARNING_PATH_NOT_FOUND = "Learning Path not found",
  COURSES_ALREADY_PURCHASED = "Some courses are already purchased by this company.",
 









  NOTIFICATIONS_FETCHED = 'Notifications fetched successfully.',
  NOTIFICATION_MARKED_READ = 'Notification marked as read.',
  NOTIFICATION_DELETED = 'Notification deleted successfully.',
  NOTIFICATION_CREATED = 'New notification created.',
  NOTIFICATION_NOT_FOUND = 'Notification not found.',


  //------------------ CALL REQUEST ---------------------
  CALL_REQUESTS_FETCHED = 'Call requests fetched successfully',
  CALL_REQUEST_DETAILS_FETCHED = 'Call request details fetched successfully',
  CALL_REQUEST_APPROVED = 'Call request approved successfully',
  CALL_REQUEST_REJECTED = 'Call request rejected successfully',
  ACCEPTED_CALL_REQUESTS_FETCHED = 'Accepted call requests fetched successfully',
  CALL_REQUEST_NOT_FOUND = 'Call request not found',
  CALL_REQUEST_ALREADY_PROCESSED = 'This call request has already been processed',







  // -------------------- GENERAL --------------------
  ACCOUNT_BLOCKED = 'Account is blocked',
  ALL_FIELDS_REQUIRED = 'All fields are required',
  ID_REQUIRED = 'Id is required',
  FILE_REQUIRED = 'File is required',
  ALREADY_EXISTS = 'Resource already exists',
  BAD_REQUEST = 'Bad request',
  CREATED = 'Created successfully',
  DELETED = 'Deleted successfully',
  FAILED = 'Operation failed',
  FORBIDDEN = 'Forbidden access',
  INVALID_ID = 'Invalid ID provided',
  INVALID_PROFILE_DATA = 'Invalid profile data',
  NO_DATA = 'No data available',
  NO_RESULTS_FOUND = 'No results found',
  NOT_FOUND = 'Resource not found',
  OTP_NOT_VALID = 'OTP not valid',
  PAGE_OUT_OF_RANGE = 'Page number out of range',
  SERVER_ERROR = 'Internal server error',
  SUCCESS = 'Operation completed successfully',
  TEMP_USER_DATA_MISSING = 'Temporary user data missing',
  UNAUTHORIZED = 'Unauthorized access',
  UPDATED = 'Updated successfully',
  USER_BLOCKED = 'User is blocked',
  VERIFY_EMAIL = 'Please verify your email',

  // -------------------- STATUS ACTIONS --------------------
  ACTIVATED = 'Activated successfully',
  APPROVED = 'Approved successfully',
  DEACTIVATED = 'Deactivated successfully',
  DISABLED = 'Disabled successfully',
  ENABLED = 'Enabled successfully',
  REJECTED = 'Rejected successfully',
  UNVERIFIED = 'Marked as unverified',
  VERIFIED = 'Verified successfully',

  // -------------------- AUTH --------------------
  EMAIL_OTP_REQUIRED = 'Email and OTP are required',
  EMAIL_PASSWORD_REQUIRED = 'Email and password are required',
  EMAIL_PURPOSE_REQUIRED = 'Email and purpose are required',
  EMAIL_REQUIRED = 'Email is required',
  GOOGLE_AUTH_REQUIRED = 'Google authentication details are required',
  INVALID_GOOGLE_DATA = 'Invalid authentication data',
  GOOGLE_AUTH_SUCCESS = 'Google authentication successfully',
  INVALID_CREDENTIALS = 'Invalid credentials',
  LOGIN_SUCCESS = 'Login successful',
  LOGOUT_SUCCESS = 'Logout successful',
  PASSWORD_CHANGED = 'Password changed successfully',
  NEW_PASSWORD_SAME_AS_OLD = 'New password and old password are same',
  PASSWORD_INCORRECT = 'Incorrect password',
  PASSWORD_RESET_FAILED = 'Password reset failed',
  PASSWORD_RESET_SUCCESS = 'Password reset successful',
  REGISTER_SUCCESS = 'Registration successful',
  TOKEN_EXPIRED = 'Authentication token has expired',
  TOKEN_REFRESHED = 'Tokens refreshed successfully',
  TOKEN_INVALID = 'Authentication token is invalid',
  TOKEN_MISSING = 'Authentication token is missing',

  // -------------------- OTP --------------------
  NO_OTP_FOUND = 'No OTP found',
  OTP_EXPIRED = 'OTP has expired',
  OTP_INVALID = 'Invalid OTP',
  OTP_PURPOSE_MISMATCH = 'OTP purpose mismatch',
  OTP_RESENT = 'OTP resent successfully',
  OTP_SENT = 'OTP sent successfully',
  OTP_VERIFIED = 'OTP verified successfully',

  // -------------------- STUDENT --------------------
  STUDENT_ALREADY_EXISTS = 'Student already exists',
  STUDENT_BLOCKED = 'Student blocked successfully',
  STUDENT_CREATED = 'Student created successfully',
  STUDENT_DELETED = 'Student deleted successfully',
  STUDENT_DETAILS_FETCHED = 'Student details fetched successfully',
  STUDENT_NOT_FOUND = 'Student not found',
  ADMIN_NOT_FOUND = 'Admin not found',
  STUDENT_UNBLOCKED = 'Student unblocked successfully',
  STUDENT_UPDATED = 'Student updated successfully',
  STUDENTS_FETCHED = 'Students fetched successfully',
  CHAT_LIST_FETCHED = 'Students chats fetched successfully',
  CHAT_DETAILS_FETCHED = 'chat details fetched successfully',

  // -------------------- COMPANY --------------------
  COMPANIES_FETCHED = 'Companies fetched successfully',
  COMPANY_ALREADY_EXISTS = 'Company already exists',
  COMPANY_BLOCKED = 'Company blocked successfully',
  COMPANY_CREATED = 'Company created successfully',
  COMPANY_DELETED = 'Company deleted successfully',
  COMPANY_DETAILS_FETCHED = 'Company details fetched successfully',
  COMPANY_NOT_FOUND = 'Company not found',
  BOOKING_NOT_FOUND = 'Booking not found',
  COMPANY_UNBLOCKED = 'Company unblocked successfully',
  COMPANY_UPDATED = 'Company updated successfully',
  UNVERIFIED_COMPANIES_FETCHED = 'Unverified company fetched successfully',

  // -------------------- TEACHER --------------------
  TEACHER_ALREADY_EXISTS = 'Teacher already exists',
  TEACHER_BLOCKED = 'Teacher blocked successfully',
  TEACHER_CREATED = 'Teacher created successfully',
  TEACHER_DELETED = 'Teacher deleted successfully',
  TEACHER_VERIFIED = 'Teacher verified successfully',
  TEACHER_NOT_VERIFIED = 'Teacher unverified successfully',
  TEACHER_DETAILS_FETCHED = 'Teacher details fetched successfully',
  VERIFICATION_REQUESTED =  'Verification request sent successfully',
  VERIFICATION_FAILED =  'Verification request sent failed',
  TEACHER_COURSES_FETCHED = 'Teacher courses fetched successfully',
  TEACHER_NOT_FOUND = 'Teacher not found',
  TEACHER_UNBLOCKED = 'Teacher unblocked successfully',
  TEACHER_UPDATED = 'Teacher updated successfully',
  TEACHERS_FETCHED = 'Teachers fetched successfully',
  UNVERIFIED_TEACHERS_FETCHED = 'Unverified teachers fetched successfully',
  TEACHER_PROFILE_FETCHED = 'teacher profile fetched successfully',
  ADMIN_PROFILE_FETCHED = 'admin profile fetched successfully',

  // -------------------- EMPLOYEE --------------------
  EMPLOYEE_ALREADY_EXISTS = 'Employee already exists',
  EMPLOYEE_BLOCKED = 'Employee blocked successfully',
  EMPLOYEE_CREATED = 'Employee created successfully',
  EMPLOYEE_DELETED = 'Employee deleted successfully',
  EMPLOYEE_DETAILS_FETCHED = 'Employee details fetched successfully',
  EMPLOYEE_NOT_FOUND = 'Employee not found',
  ORDER_NOT_FOUND = 'Order not found',
  EMPLOYEE_UNBLOCKED = 'Employee unblocked successfully',
  EMPLOYEE_UPDATED = 'Employee updated successfully',
  EMPLOYEES_FETCHED = 'Employees fetched successfully',

  // -------------------- COURSE --------------------
  COURSE_ALREADY_EXISTS = 'Course already exists',
  COURSE_ASSIGNED = 'Course assigned successfully',
  COURSE_CREATED = 'Course created successfully',
  COURSE_CREATED_FAILED = 'Course created failed',
  COURSE_DELETED = 'Course deleted successfully',
  COURSE_DETAILS_FETCHED = 'Course details fetched successfully',
  RESOURCES_FETCHED = 'Resources fetched successfully',
  PROGRESS_FETCHED = 'Progress fetched successfully',
  LEARNING_RECORD_FETCHED = 'Learning record fetched successfully',
  RESOURCE_UPLOADED = 'Resource uploaded successfully',
  RESOURCE_DELETED = 'Resource deleted successfully',
  COURSE_NOT_FOUND = 'Course not found',
  COURSE_UNASSIGNED = 'Course unassigned successfully',
  COURSE_UPDATED = 'Course updated successfully',
  COURSES_FETCHED = 'Courses fetched successfully',
  COURSE_FETCHED = 'Course fetched successfully',


  // -------------------- SUBSCRIPTION PLAN --------------------
  SUBSCRIPTION_PLANS_FETCHED = 'Subscription plans fetched successfully',
  SUBSCRIPTION_PLAN_CREATED = 'Subscription plan created successfully',
  SUBSCRIPTION_PLAN_FETCHED = 'Subscription plan fetched successfully',
  SUBSCRIPTION_PLAN_UPDATED = 'Subscription plan updated successfully',
  SUBSCRIPTION_PLAN_DELETED = 'Subscription plan deleted successfully',
  SUBSCRIPTION_PLAN_NOT_FOUND = 'Subscription plan not found',
  ORDER_CREATED = 'Subscription order created successfully',
  PAYMENT_VERIFIED_SUCCESSFULLY = 'Payment verified successfully',
  PAYMENT_PAID_SUCCESSFULLY = 'Payment paid successfully',
  PAYMENT_VERIFICATION_FAILED = 'Payment verified failed',
  FREE_PLAN_ACTIVATED = 'Free subscription plan activated successfully',
  ACTIVE_SUBSCRIPTION_FETCHED = 'Active subscription fetched successfully',


  // --------------------Wishlist Messages--------------------
  WISHLIST_COURSE_ADDED = 'Course added to wishlist successfully',
  WISHLIST_FETCHED = 'Wishlist fetched successfully',
  WISHLIST_COURSE_REMOVED = 'Course removed from wishlist successfully',
  WISHLIST_ALREADY_EXISTS = 'Course is already in wishlist',
  INVALID_INPUT = 'StudentId and CourseId are required.',
  WISHLIST_ADD_FAIL = 'Failed to add course to wishlists.',
  WISHLIST_EMPTY = 'Wishlist is empty.',
  WISHLIST_NOT_FOUND = 'Wishlist not found for this student.',
  WISHLIST_COURSE_NOT_FOUND = 'Course not found in wishlist.',
  WISHLIST_REMOVE_FAIL = 'Failed to remove course from wishlist.',

  // --------------------Cart Messages--------------------
  CART_COURSE_ADDED = 'Course added to cart successfully',
  CART_FETCHED = 'Cart fetched successfully',
  CART_COURSE_REMOVED = 'Course removed from cart successfully',
  CART_CHECKOUT_SUCCESS = 'Checkout completed successfully',
  CART_ALREADY_EXISTS = 'Course is already in cart',
  CART_CLEARED = 'Cart cleared successfully',
  CART_UPDATED = 'Cart updated successfully',


  // -------------------- RELATIONSHIP ACTIONS --------------------
  ADDED_TO_GROUP = 'Added to group successfully',
  LINKED_SUCCESSFULLY = 'Linked successfully',
  REMOVED_FROM_GROUP = 'Removed from group successfully',
  UNLINKED_SUCCESSFULLY = 'Unlinked successfully',

  // -------------------- IMPORT/EXPORT --------------------
  EXPORT_FAILED = 'Data export failed',
  EXPORT_SUCCESS = 'Data exported successfully',
  IMPORT_FAILED = 'Data import failed',
  IMPORT_SUCCESS = 'Data imported successfully',

  // -------------------- SETTINGS --------------------
  PROFILE_PICTURE_UPDATED = 'Profile picture updated successfully',
  PROFILE_UPDATED = 'Profile updated successfully',
  SETTINGS_UPDATED = 'Settings updated successfully',

  // -------------------- NOTIFICATIONS --------------------
  NOTIFICATION_FAILED = 'Notification sending failed',
  NOTIFICATION_SENT = 'Notification sent successfully',

  // -------------------- VALIDATION --------------------
  INVALID_DATA = 'Invalid data provided',
  INVALID_EMAIL = 'Invalid email format',
  INVALID_PASSWORD = 'Invalid password format',
  REQUIRED_FIELDS_MISSING = 'Required fields are missing',
  VALIDATION_ERROR = 'Validation failed',

  // -------------------- FILE UPLOAD --------------------
  FILE_INVALID_TYPE = 'Invalid file type',
  FILE_TOO_LARGE = 'File size too large',
  FILE_UPLOADED = 'File uploaded successfully',
  FILE_UPLOAD_FAILED = 'File upload failed',

  // -------------------- SYSTEM --------------------
  DATABASE_ERROR = 'Database operation failed',
  RATE_LIMIT_EXCEEDED = 'Too many requests, please try again later',
  SERVICE_UNAVAILABLE = 'Service temporarily unavailable'


  , TITLE_DESCRIPTION_CATEGORY_REQUIRED = 'Title & description  & and category are required',
  AT_LEAST_ONE_MODULE_REQUIRED = 'At least one module is required',


  //order
  ORDER_CREATED_SUCCESSFULLY = 'Order created successfully',

}
