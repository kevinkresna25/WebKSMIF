<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('client/home');
});

Route::get('/team', function () {
    return Inertia::render('client/team');
});

Route::get('/gallery', function () {
    return Inertia::render('client/gallery');
});

Route::get('/lsta', function () {
    return Inertia::render('client/lsta');
});

Route::get('/login', function () {
    return Inertia::render('admin/login');
});
