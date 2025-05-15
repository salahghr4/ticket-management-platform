<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use Illuminate\Support\Facades\Gate;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the departments.
     */
    public function index()
    {
        $departments = Department::all();
        return response()->json($departments);
    }

    /**
     * Store a newly created department.
     */
    public function store(Request $request)
    {
        Gate::authorize('create');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department = Department::create($validated);
        return response()->json([
            'message' => 'Department created successfully',
            'department' => $department,
            'success' => true
        ], 201);
    }

    /**
     * Display the specified department.
     */
    public function show(string $id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json([
                'message' => 'Department not found',
                'success' => false
            ], 404);
        }
        return response()->json([
            'message' => 'Department found',
            'department' => $department,
            'success' => true
        ], 200);
    }

    /**
     * Update the specified department.
     */
    public function update(Request $request, string $id)
    {
        $department = Department::find($id);
        Gate::authorize('update', $department);

        if (!$department) {
            return response()->json([
                'message' => 'Department not found',
                'success' => false
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department->update($validated);
        return response()->json([
            'message' => 'Department updated successfully',
            'department' => $department,
            'success' => true
        ], 200);
    }

    /**
     * Remove the specified department.
     */
    public function destroy(string $id)
    {
        $department = Department::find($id);
        Gate::authorize('delete', $department);

        if (!$department) {
            return response()->json([
                'message' => 'Department not found',
                'success' => false
            ], 404);
        }
        $department->delete();
        return response()->json([
            'message' => 'Department deleted successfully',
            'success' => true
        ], 200);
    }
}
