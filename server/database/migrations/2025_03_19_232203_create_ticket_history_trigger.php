<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create trigger for ticket creation
        DB::unprepared('
            CREATE TRIGGER after_ticket_created
            AFTER INSERT ON tickets
            FOR EACH ROW
            BEGIN
                INSERT INTO ticket_history (
                    ticket_id,
                    user_id,
                    action_type,
                    field_name,
                    new_value,
                    description,
                    created_at,
                    updated_at
                )
                VALUES (
                    NEW.id,
                    NEW.user_id,
                    "created",
                    NULL,
                    NULL,
                    "Ticket created",
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                );
            END
        ');

        // Create trigger for ticket updates
        DB::unprepared('
            CREATE TRIGGER after_ticket_updated
            AFTER UPDATE ON tickets
            FOR EACH ROW
            BEGIN
                -- Title change
                IF OLD.title != NEW.title THEN
                    INSERT INTO ticket_history (
                        ticket_id,
                        user_id,
                        action_type,
                        field_name,
                        old_value,
                        new_value,
                        description,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        NEW.id,
                        COALESCE(NEW.updated_by, NEW.user_id),
                        "updated",
                        "title",
                        OLD.title,
                        NEW.title,
                        "Title changed",
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;

                -- Description change
                IF OLD.description != NEW.description THEN
                    INSERT INTO ticket_history (
                        ticket_id,
                        user_id,
                        action_type,
                        field_name,
                        old_value,
                        new_value,
                        description,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        NEW.id,
                        COALESCE(NEW.updated_by, NEW.user_id),
                        "updated",
                        "description",
                        OLD.description,
                        NEW.description,
                        "Description updated",
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;

                -- Department change
                IF OLD.department_id != NEW.department_id THEN
                    INSERT INTO ticket_history (
                        ticket_id,
                        user_id,
                        action_type,
                        field_name,
                        old_value,
                        new_value,
                        description,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        NEW.id,
                        COALESCE(NEW.updated_by, NEW.user_id),
                        "updated",
                        "department_id",
                        OLD.department_id,
                        NEW.department_id,
                        "Department changed",
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;

                -- Status change
                IF OLD.status != NEW.status THEN
                    INSERT INTO ticket_history (
                        ticket_id,
                        user_id,
                        action_type,
                        field_name,
                        old_value,
                        new_value,
                        description,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        NEW.id,
                        COALESCE(NEW.updated_by, NEW.user_id),
                        "status_changed",
                        "status",
                        OLD.status,
                        NEW.status,
                        "Status changed",
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;

                -- Priority change
                IF OLD.priority != NEW.priority THEN
                    INSERT INTO ticket_history (
                        ticket_id,
                        user_id,
                        action_type,
                        field_name,
                        old_value,
                        new_value,
                        description,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        NEW.id,
                        COALESCE(NEW.updated_by, NEW.user_id),
                        "updated",
                        "priority",
                        OLD.priority,
                        NEW.priority,
                        "Priority changed",
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;

                -- Assigned to change
                IF (OLD.assigned_to IS NULL AND NEW.assigned_to IS NOT NULL) OR
                   (OLD.assigned_to IS NOT NULL AND NEW.assigned_to IS NULL) OR
                   (OLD.assigned_to != NEW.assigned_to) THEN
                    INSERT INTO ticket_history (
                        ticket_id,
                        user_id,
                        action_type,
                        field_name,
                        old_value,
                        new_value,
                        description,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        NEW.id,
                        COALESCE(NEW.updated_by, NEW.user_id),
                        "assigned_changed",
                        "assigned_to",
                        OLD.assigned_to,
                        NEW.assigned_to,
                        "Assigned to changed",
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;

                -- Due date change
                IF (OLD.due_date IS NULL AND NEW.due_date IS NOT NULL) OR
                   (OLD.due_date IS NOT NULL AND NEW.due_date IS NULL) OR
                   (OLD.due_date != NEW.due_date) THEN
                    INSERT INTO ticket_history (
                        ticket_id,
                        user_id,
                        action_type,
                        field_name,
                        old_value,
                        new_value,
                        description,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        NEW.id,
                        COALESCE(NEW.updated_by, NEW.user_id),
                        "updated",
                        "due_date",
                        OLD.due_date,
                        NEW.due_date,
                        "Due date changed",
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS after_ticket_created');
        DB::unprepared('DROP TRIGGER IF EXISTS after_ticket_updated');
    }
};
