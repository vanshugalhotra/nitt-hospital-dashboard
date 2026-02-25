export const OTP_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{appName}} - Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="440" cellpadding="0" cellspacing="0" 
          style="max-width:100%;background:#ffffff;border-radius:24px;padding:32px;box-shadow:0 4px 12px rgba(0,0,0,0.02);border:1px solid #f0f0f0;">
          
          <!-- Logo/App Name -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:20px;font-weight:600;color:#1a1a1a;letter-spacing:-0.02em;">
                {{appName}}
              </span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="color:#262626;font-size:15px;line-height:1.6;text-align:center;">
              Your verification code for<br /><strong style="color:#1a1a1a;">{{action}}</strong>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td height="24"></td></tr>

          <!-- OTP Code -->
          <tr>
            <td align="center">
              <div style="
                font-family:'SF Mono',Monaco,Consolas,'Liberation Mono','Courier New',monospace;
                font-size:32px;
                font-weight:500;
                letter-spacing:8px;
                color:#000000;
                background:#f8f8f8;
                padding:16px 24px;
                border-radius:12px;
                display:inline-block;
              ">
                {{otp}}
              </div>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td height="24"></td></tr>

          <!-- Validity Notice -->
          <tr>
            <td style="color:#6b6b6b;font-size:14px;text-align:center;">
              This code is valid for 5 minutes
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td height="8"></td></tr>

          <!-- Footer Note -->
          <tr>
            <td style="color:#999999;font-size:13px;text-align:center;">
              If you didn't request this code, you can safely ignore this email.
            </td>
          </tr>

          <!-- Divider -->
          <tr><td height="24"></td></tr>
          <tr>
            <td style="border-top:1px solid #f0f0f0;"></td>
          </tr>
          <tr><td height="16"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="color:#999999;font-size:12px;text-align:center;">
              © {{year}} {{appName}}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const OTP_TEXT_TEMPLATE = `
{{appName}}

Your OTP for {{action}} is: {{otp}}

This OTP will expire in {{expiryMinutes}} minutes.

If you did not request this, please ignore this email.

© {{year}} {{appName}}
`;
