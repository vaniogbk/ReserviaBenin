{{-- Point d'entrée backend — redirige vers le frontend Vercel --}}
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réservia Bénin — API</title>
  <style>
    body { margin: 0; background: #1E1810; color: #C8A97A; font-family: 'Segoe UI', Arial, sans-serif;
           display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #2a2218; border-radius: 16px; padding: 48px 56px; text-align: center; max-width: 480px; }
    h1 { margin: 0 0 4px; font-size: 2rem; color: #C8A97A; }
    h1 em { color: #C4603A; font-style: normal; }
    .sub { font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; opacity: .5; margin-bottom: 32px; }
    .badge { display: inline-block; background: #2d6a4f; color: #74c69d; padding: 4px 14px;
             border-radius: 20px; font-size: 0.8rem; margin-bottom: 28px; }
    p { color: #a89070; font-size: 0.9rem; line-height: 1.7; margin: 0 0 24px; }
    a { color: #C4603A; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .endpoints { background: #1a1208; border-radius: 8px; padding: 12px 18px; font-family: monospace;
                 font-size: 0.82rem; color: #e0c080; margin-top: 16px; text-align: left; line-height: 2; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Réser<em>via</em></h1>
    <p class="sub">Bénin</p>
    <span class="badge">✓ API opérationnelle — Laravel {{ app()->version() }}</span>
    <p>Plateforme de réservation d'hébergements et d'événements au Bénin.<br>
       Cette URL est le point d'entrée de l'API REST.</p>
    <div class="endpoints">
      GET /api/v1/health<br>
      GET /api/v1/hebergements<br>
      GET /api/v1/evenements
    </div>
    <p style="margin-top:28px; font-size:0.8rem;">
      Interface web →
      <a href="https://reserviabenin.vercel.app" target="_blank">reserviabenin.vercel.app</a>
    </p>
  </div>
</body>
</html>
