<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::get('tickets/stats', [TicketController::class, 'stats'])->name('tickets.stats');
    Route::apiResource('tickets', TicketController::class);
    Route::apiResource('users', UserController::class);

    Route::get('users/department/{departmentId}', [UserController::class, 'department'])->name('users.department');
    Route::apiResource('departments', DepartmentController::class);
});

