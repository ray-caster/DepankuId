/**
 * Admin Role Management
 * 
 * This module provides utilities for checking if a user has admin privileges.
 * 
 * SECURITY NOTE: This is client-side validation only. 
 * Always verify admin status on the backend for sensitive operations.
 */

import { User } from 'firebase/auth';

/**
 * List of admin email addresses
 * In production, this should be stored in Firebase Firestore
 * and managed through a secure admin interface.
 */
const ADMIN_EMAILS = [
  // Add your admin email addresses here
  // Example: 'admin@depanku.id',
  // Example: 'your-email@gmail.com',
];

/**
 * Check if a user is an admin based on their email
 * 
 * @param user - Firebase Auth user object
 * @returns boolean - true if user is an admin
 */
export function isAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

/**
 * Check if an email is an admin email
 * 
 * @param email - Email address to check
 * @returns boolean - true if email is in admin list
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Get admin status with additional checks
 * Checks both email list and custom claims (if available)
 * 
 * @param user - Firebase Auth user object
 * @returns Promise<boolean> - true if user is an admin
 */
export async function getAdminStatus(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  // Check email list
  if (isAdmin(user)) return true;
  
  // Check custom claims (if you've set them up in Firebase)
  try {
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.admin === true;
  } catch (error) {
    console.error('Error checking admin claims:', error);
    return false;
  }
}

/**
 * HOW TO SET UP ADMIN ROLES:
 * 
 * Method 1: Email List (Simple, Current Implementation)
 * - Add your email to ADMIN_EMAILS array above
 * - Quick and easy for small teams
 * - Requires code deployment to add new admins
 * 
 * Method 2: Firestore Collection (Recommended for Production)
 * - Create an 'admins' collection in Firestore
 * - Store admin user IDs or emails
 * - Dynamic, no code changes needed
 * 
 * Method 3: Firebase Custom Claims (Most Secure)
 * - Set custom claims on user accounts via Firebase Admin SDK
 * - Backend example:
 *   admin.auth().setCustomUserClaims(uid, { admin: true })
 * - Most secure, enforced by Firebase Security Rules
 * 
 * BACKEND IMPLEMENTATION:
 * 
 * In your backend API, add admin verification:
 * 
 * Python (Flask):
 * ```python
 * from firebase_admin import auth
 * 
 * def is_admin(uid):
 *     user = auth.get_user(uid)
 *     return user.email in ADMIN_EMAILS or \
 *            user.custom_claims.get('admin') == True
 * 
 * @require_auth
 * @require_admin
 * def admin_only_endpoint():
 *     # Your admin code here
 *     pass
 * ```
 * 
 * SECURITY RULES:
 * 
 * Add to firestore.rules:
 * ```
 * match /opportunities/{opportunityId} {
 *   // Allow anyone to read
 *   allow read: if true;
 *   
 *   // Only admins can write
 *   allow create, update, delete: if request.auth != null && 
 *     (request.auth.token.admin == true || 
 *      request.auth.token.email in ['admin@depanku.id']);
 * }
 * ```
 */

export default {
  isAdmin,
  isAdminEmail,
  getAdminStatus,
};
