<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class AttachmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Ticket $ticket)
    {
        return response()->json($ticket->attachments()->orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Ticket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'attachments.*' => 'required|mimes:jpg,jpeg,png,gif,svg,pdf,doc,docx,xls,xlsx,ppt,pptx,avif,webp,zip,rar|max:10240', // Max 10MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to attach files to the ticket',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->file('attachments') as $file) {

            try {
                $extension = $file->getClientOriginalExtension();

                $uploadedFile = Cloudinary::uploadApi()->upload($file->getRealPath(), [
                    'folder' => 'tickets/ticket-' . $ticket->id,
                    'resource_type' => 'auto',
                    'format' => $extension
                ]);

                $ticket->attachments()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $extension,
                    'file_url' => $uploadedFile['secure_url'],
                    'file_size' => $uploadedFile['bytes'],
                    'public_id' => $uploadedFile['public_id'],
                ]);

                $ticket->history()->create([
                    'action_type' => 'attachment_added',
                    'field_name' => 'attachments',
                    'old_value' => null,
                    'new_value' => $file->getClientOriginalName(),
                    'description' => 'Attachment added',
                    'user_id' => $request->user()->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

            } catch (\Throwable $th) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to attach files to the ticket',
                    'errors' => $th
                ], 422);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Attachment added successfully',
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket, Attachment $attachment)
    {
        try {
            $resourceType = in_array($attachment->file_type, ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rar', 'zip']) ? 'raw' : 'image';
            Cloudinary::uploadApi()->destroy($attachment->public_id, [
                'resource_type' => $resourceType,
            ]);

            $attachment->delete();

            $ticket->history()->create([
                'action_type' => 'attachment_deleted',
                'field_name' => 'attachments',
                'old_value' => $attachment->file_name,
                'new_value' => null,
                'description' => 'Attachment deleted',
                'user_id' => Auth::user()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Attachment deleted successfully',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete attachment ',
                'errors' => $th->getMessage()
            ], 422);
        }
    }
}
