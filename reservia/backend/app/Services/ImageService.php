<?php
// ================================================================
//  app/Services/ImageService.php
//  Gère upload, compression WebP et suppression des images
//  Compatible avec la structure : image_principale + autres_images
// ================================================================

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    const MAX_SIZE_BYTES   = 5 * 1024 * 1024;  // 5 Mo
    const ALLOWED_MIMES    = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX_WIDTH        = 1920;
    const MAX_HEIGHT       = 1080;
    const WEBP_QUALITY     = 85;

    // ---------------------------------------------------------------
    //  Upload un fichier image → retourne le chemin relatif (en DB)
    //  $dossier = 'hebergements' ou 'evenements'
    // ---------------------------------------------------------------
    public function upload(UploadedFile $fichier, string $dossier): string
    {
        $this->valider($fichier);

        $nomFichier = Str::uuid() . '.webp';
        $chemin     = $dossier . '/' . date('Y/m') . '/' . $nomFichier;

        // Utiliser GD (disponible par défaut en PHP) pour redimensionner
        $imageRedim = $this->redimensionner($fichier->getPathname(), $fichier->getMimeType());

        Storage::disk('public')->put($chemin, $imageRedim);

        return $chemin;
    }

    // ---------------------------------------------------------------
    //  Retourner l'URL publique complète
    // ---------------------------------------------------------------
    public static function url(?string $chemin): ?string
    {
        if (!$chemin) return null;

        // Si le chemin est déjà une URL complète (données migrées)
        if (str_starts_with($chemin, 'http')) return $chemin;

        return Storage::disk('public')->url($chemin);
    }

    // ---------------------------------------------------------------
    //  Supprimer une image du disque
    // ---------------------------------------------------------------
    public function supprimer(?string $chemin): void
    {
        if (!$chemin || str_starts_with($chemin, 'http')) return;

        if (Storage::disk('public')->exists($chemin)) {
            Storage::disk('public')->delete($chemin);
        }
    }

    // ---------------------------------------------------------------
    //  Supprimer une liste d'images (autres_images JSON)
    // ---------------------------------------------------------------
    public function supprimerListe(array $chemins): void
    {
        foreach ($chemins as $chemin) {
            $this->supprimer($chemin);
        }
    }

    // ---------------------------------------------------------------
    //  Redimensionner avec GD + encoder en WebP
    // ---------------------------------------------------------------
    private function redimensionner(string $path, string $mime): string
    {
        // Charger l'image source
        $source = match ($mime) {
            'image/jpeg', 'image/jpg' => imagecreatefromjpeg($path),
            'image/png'               => imagecreatefrompng($path),
            'image/webp'              => imagecreatefromwebp($path),
            default                   => imagecreatefromjpeg($path),
        };

        if (!$source) {
            throw new \RuntimeException('Impossible de lire le fichier image.');
        }

        [$largeurOrig, $hauteurOrig] = getimagesize($path);

        // Calcul du ratio pour ne pas dépasser MAX_WIDTH x MAX_HEIGHT
        $ratio    = min(self::MAX_WIDTH / $largeurOrig, self::MAX_HEIGHT / $hauteurOrig, 1.0);
        $largeur  = (int) round($largeurOrig * $ratio);
        $hauteur  = (int) round($hauteurOrig * $ratio);

        // Créer l'image redimensionnée
        $dest = imagecreatetruecolor($largeur, $hauteur);

        // Préserver la transparence pour PNG/WebP
        imagealphablending($dest, false);
        imagesavealpha($dest, true);
        $transparent = imagecolorallocatealpha($dest, 0, 0, 0, 127);
        imagefilledrectangle($dest, 0, 0, $largeur, $hauteur, $transparent);

        imagecopyresampled($dest, $source, 0, 0, 0, 0, $largeur, $hauteur, $largeurOrig, $hauteurOrig);

        // Encoder en WebP dans un buffer
        ob_start();
        imagewebp($dest, null, self::WEBP_QUALITY);
        $buffer = ob_get_clean();

        imagedestroy($source);
        imagedestroy($dest);

        return $buffer;
    }

    // ---------------------------------------------------------------
    //  Validation
    // ---------------------------------------------------------------
    private function valider(UploadedFile $fichier): void
    {
        if ($fichier->getSize() > self::MAX_SIZE_BYTES) {
            throw new \InvalidArgumentException(
                'Image trop lourde. Maximum autorisé : 5 Mo.'
            );
        }

        if (!in_array($fichier->getMimeType(), self::ALLOWED_MIMES, true)) {
            throw new \InvalidArgumentException(
                'Format non autorisé. Utilisez JPEG, PNG ou WebP.'
            );
        }

        // Vérifier que c'est une vraie image (pas un fichier renommé)
        if (!@getimagesize($fichier->getPathname())) {
            throw new \InvalidArgumentException('Fichier image invalide ou corrompu.');
        }
    }
}
