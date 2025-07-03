<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
        $remember = $request->boolean('rememberMe', false); // Sesuai dengan form frontend

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

            // Check if account is active (jika ada field is_active)
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

            // Update last login info (jika kolom ada)
            $this->updateLastLogin($user, $request);

            // Log activity (jika package activity log tersedia)
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

        // Log activity
        if ($user) {
            $this->logActivity($user, $request, 'Admin logged out');
        }

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
}
