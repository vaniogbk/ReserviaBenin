<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Code de vérification — Reservia Bénin</title>
</head>
<body style="margin:0;padding:0;background:#F5EFE0;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EFE0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(30,24,16,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1E1810;padding:32px 40px;">
              <p style="margin:0;font-size:26px;font-weight:700;color:#C8A97A;letter-spacing:-0.5px;">
                Réser<em style="color:#C4603A;">via</em>
                <span style="font-size:11px;font-weight:400;color:#C8A97A;opacity:.6;letter-spacing:2px;margin-left:4px;">BÉNIN</span>
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1E1810;">
                Vérifiez votre adresse e-mail
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#C8A97A;line-height:1.6;">
                Bonjour <strong style="color:#1E1810;">{{ $user->prenom }}</strong>,<br>
                Voici votre code de vérification à 6 chiffres. Il expire dans <strong>15 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:24px 0;">
                    <div style="display:inline-block;background:#F5EFE0;border-radius:16px;padding:20px 40px;border:2px dashed #C8A97A;">
                      <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C8A97A;">Code de vérification</p>
                      <p style="margin:0;font-size:42px;font-weight:800;color:#1E1810;letter-spacing:12px;font-family:monospace;">{{ $otp }}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#C8A97A;line-height:1.6;">
                Si vous n'avez pas créé de compte sur Reservia Bénin, ignorez cet e-mail.<br>
                Ce code est strictement confidentiel — ne le partagez avec personne.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F5EFE0;padding:20px 40px;border-top:1px solid #e8e0d0;">
              <p style="margin:0;font-size:12px;color:#C8A97A;text-align:center;">
                Reservia Bénin · contact@reservia.bj · www.reservia.bj
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
