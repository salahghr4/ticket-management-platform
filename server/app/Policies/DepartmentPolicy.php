<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DepartmentPolicy
{
    public function before(User $authUser): bool|null
    {
        if ($authUser->isAdmin()) {
            return true;
        }
        return null;
    }

    /**
     * Determine whether the user can create departments.
     */
    public function create(User $user): Response
    {
        return Response::deny('you are not allowed to create departments');
    }

    /**
     * Determine whether the user can update the department.
     */
    public function update(User $user, Department $department): Response
    {
        return Response::deny('you are not allowed to update this department');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Department $department): Response
    {
        return Response::deny('you are not allowed to delete this department');
    }
}
