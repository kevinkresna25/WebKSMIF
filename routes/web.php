<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
});

Route::get('/team', function () {
    return Inertia::render('team');
});

Route::get('/gallery', function () {
    return Inertia::render('gallery');
});

Route::get('/lsta', function () {
    return Inertia::render('lsta');
});
