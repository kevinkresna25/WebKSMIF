<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('admin/login');
    }

    public function login(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ], [
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Rate limiting
        $this->incrementLoginAttempts($request);

        if ($this->hasTooManyLoginAttempts($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Too many login attempts. Please try again in a few minutes.'
            ], 429);
        }

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('rememberMe', false);

        // Attempt authentication
        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();

            // Check if user is admin
            if (!$this->isAdmin($user)) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.'
                ], 403);
            }

            // Check if account is active
            if (Schema::hasColumn('users', 'is_active') && !$user->is_active) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been deactivated. Please contact administrator.'
                ], 403);
            }

            // Regenerate session
            $request->session()->regenerate();
            $this->clearLoginAttempts($request);

            // Update last login info
            $this->updateLastLogin($user, $request);

            // Log activity
            $this->logActivity($user, $request, 'Admin logged in');

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'redirect' => route('admin.dashboard'),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'admin'
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials. Please check your email and password.'
        ], 401);
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        $user = Auth::user();

        // Log activity (optional - you can remove this)
        // if ($user) {
        //     $this->logActivity($user, $request, 'Admin logged out');
        // }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Return JSON response untuk AJAX request
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully',
                'redirect' => route('admin.login')
            ]);
        }

        // Redirect untuk request biasa
        return redirect()->route('admin.login')->with('message', 'Logged out successfully');
    }

    /**
     * Check authentication status
     */
    public function checkAuth(Request $request)
    {
        $user = Auth::user();

        if ($user && $this->isAdmin($user)) {
            return response()->json([
                'authenticated' => true,
                'is_admin' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'admin'
                ]
            ]);
        }

        return response()->json([
            'authenticated' => false,
            'is_admin' => false
        ]);
    }

    /**
     * Increment login attempts
     */
    protected function incrementLoginAttempts(Request $request)
    {
        $key = $this->throttleKey($request);
        $attempts = (int) Cache::get($key, 0);
        Cache::put($key, $attempts + 1, now()->addMinutes(5));
    }

    /**
     * Check if user has too many login attempts
     */
    protected function hasTooManyLoginAttempts(Request $request)
    {
        $key = $this->throttleKey($request);
        $attempts = (int) Cache::get($key, 0);
        return $attempts >= 5; // Max 5 attempts
    }

    /**
     * Clear login attempts
     */
    protected function clearLoginAttempts(Request $request)
    {
        $key = $this->throttleKey($request);
        Cache::forget($key);
    }

    /**
     * Get throttle key for rate limiting
     */
    protected function throttleKey(Request $request)
    {
        return Str::lower($request->input('email')) . '|' . $request->ip();
    }

    /**
     * Check if user is admin
     */
    protected function isAdmin($user)
    {
        // Method 1: Check role field
        if (Schema::hasColumn('users', 'role')) {
            return in_array($user->role, ['admin', 'super_admin']);
        }

        // Method 2: Check is_admin field
        if (Schema::hasColumn('users', 'is_admin')) {
            return $user->is_admin;
        }

        // Method 3: Check using Spatie Permission (if installed)
        if (method_exists($user, 'hasRole')) {
            return $user->hasRole(['admin', 'super-admin']);
        }

        // Method 4: Check specific admin emails (fallback)
        $adminEmails = [
            'admin@ksm-if.com',
            'satyaaryaputrawigiyanto@gmail.com',
            // Add more admin emails as needed
        ];

        return in_array($user->email, $adminEmails);
    }

    /**
     * Update last login information
     */
    protected function updateLastLogin($user, Request $request)
    {
        try {
            $updateData = [];

            if (Schema::hasColumn('users', 'last_login_at')) {
                $updateData['last_login_at'] = now();
            }

            if (Schema::hasColumn('users', 'last_login_ip')) {
                $updateData['last_login_ip'] = $request->ip();
            }

            if (Schema::hasColumn('users', 'last_login_user_agent')) {
                $updateData['last_login_user_agent'] = $request->userAgent();
            }

            if (!empty($updateData)) {
                $user->update($updateData);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to update last login info: ' . $e->getMessage());
        }
    }

    /**
     * Log user activity (OPTIONAL - you can completely remove this method)
     */
    protected function logActivity($user, Request $request, $description)
    {
        // Simple version - just log to Laravel log file
        Log::info("Admin Activity: $description", [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip(),
        ]);
    }
}
