<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\TicketCommentController;
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
        return $request->user()->load('department');
    });

    Route::get('tickets/stats', [TicketController::class, 'stats'])->name('tickets.stats');
    Route::apiResource('tickets', TicketController::class);
    Route::apiResource('users', UserController::class);

    Route::get('users/department/{departmentId}', [UserController::class, 'department'])->name('users.department');
    Route::apiResource('users', UserController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('tickets/{ticket}/comments', TicketCommentController::class)->except(['show']);
    // Replies
    Route::get('comments/{comment}/replies', [TicketCommentController::class, 'replies'])->name('comments.replies');
    Route::post('comments/{comment}/replies', [TicketCommentController::class, 'storeReply'])->name('comments.replies.store');
    Route::put('comments/{comment}/replies/{reply}', [TicketCommentController::class, 'updateReply'])->name('comments.replies.update');
    Route::delete('comments/{comment}/replies/{reply}', [TicketCommentController::class, 'destroyReply'])->name('comments.replies.destroy');

    // Ticket Comments
    Route::get('/tickets/{ticket}/comments', [TicketCommentController::class, 'index']);
    Route::get('/tickets/{ticket}/comments/{comment}/replies', [TicketCommentController::class, 'getReplies']);
    Route::post('/tickets/{ticket}/comments', [TicketCommentController::class, 'store']);
    Route::put('/tickets/{ticket}/comments/{comment}', [TicketCommentController::class, 'update']);
    Route::delete('/tickets/{ticket}/comments/{comment}', [TicketCommentController::class, 'destroy']);
});
