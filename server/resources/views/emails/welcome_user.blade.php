<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Welcome to TYTICKET</title>
    <style>
        body {
            background: #ffffff;
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #111827;
        }
        .container {
            max-width: 480px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            padding: 32px 24px;
            text-align: center;
        }
        .logo img {
            width: 80px;
            height: auto;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 1.75rem;
            color: #3B005F;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 1.05rem;
            color: #4b5563;
            margin-bottom: 24px;
        }
        .credentials {
            background: #f3f4f6;
            border-radius: 10px;
            padding: 16px;
            text-align: left;
            display: inline-block;
            font-size: 1rem;
            color: #1f2937;
            margin: 24px 0;
        }
        .credentials strong {
            color: #3B005F;
        }
        a.button {
            display: inline-block;
            margin-top: 16px;
            background: #3B005F;
            color: #ffffff;
            padding: 12px 28px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            transition: background 0.2s ease-in-out;
        }
        a.button:hover {
            background: #2a0047;
        }
        .warning {
            margin-top: 16px;
            color: #dc2626;
            font-size: 0.95rem;
        }
        .footer {
            margin-top: 32px;
            color: #6b7280;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ $message->embed(asset('logo.png')) }}" alt="TYTICKET Logo" />
        </div>
        <h1>Welcome to TYTICKET!</h1>
        <div class="subtitle">
            Your account has been created.<br />
            We're excited to have you on board.
        </div>
        <div class="credentials">
            <div><strong>Email:</strong> {{ $email }}</div>
            <div><strong>Password:</strong> {{ $password }}</div>
        </div>
        <a href="{{ env('APP_FRONTEND_URL') }}" class="button">Go to TYTICKET</a>
        <p class="warning">Please change your password after logging in, for security reasons.</p>
        <div class="footer">
            If you have any questions, feel free to contact our support team.<br />
            &copy; {{ date('Y') }} TYTICKET. All rights reserved.
        </div>
    </div>
</body>
</html>
