# Portfolio — Yuri Bausch

Site portfolio one-page (HTML / CSS / JS, sans framework).

## 🟢 Lancer le site en local
Double-clique sur `index.html`, ou pour un rendu parfait des polices :
```bash
python -m http.server 5511
```
puis ouvre http://localhost:5511

---

## 📸 1. Ajouter ta photo
1. Choisis ta photo de profil (format portrait, idéalement vertical 4:5).
2. Renomme-la **`photo.jpg`**.
3. Place-la dans le dossier **`assets/`** (donc `assets/photo.jpg`).

Tant qu'aucune photo n'est ajoutée, un visuel de remplacement s'affiche. Dès que
`assets/photo.jpg` existe, il est utilisé automatiquement (aucune autre modif à faire).

> Tu peux aussi me donner le nom du fichier dans tes Téléchargements et je l'intègre.

---

## ✉️ 2. Activer le formulaire de contact (Web3Forms — gratuit)
Le formulaire envoie les messages directement dans ta boîte mail. Mise en route en 2 min :

1. Va sur **https://web3forms.com**
2. Entre ton email (`yuri.bausch@gmail.com`) → tu reçois une **clé d'accès** (Access Key) par mail. *(Aucun compte à créer.)*
3. Ouvre **`index.html`**, cherche cette ligne :
   ```html
   <input type="hidden" name="access_key" value="VOTRE_CLE_WEB3FORMS" />
   ```
4. Remplace `VOTRE_CLE_WEB3FORMS` par ta clé. C'est tout ✅

Tant que la clé n'est pas renseignée, le formulaire affiche un message d'avertissement
au lieu d'envoyer (les coordonnées email / téléphone / Behance restent cliquables).

---

## 📄 3. Mettre à jour le CV / la disponibilité
- **Remplacer le CV** : écrase le fichier `assets/CV-Yuri-Bausch.pdf` par ta nouvelle version (garde le même nom). Les 3 boutons « CV » pointent automatiquement dessus.
- **Changer la date d'alternance** : cherche « septembre 2026 » dans `index.html` (badge du hero + section Contact) et « 2026 » dans la section Parcours, puis adapte.

---

## 🚀 4. Mettre le site en ligne (gratuit)
- **Netlify Drop** : va sur https://app.netlify.com/drop et glisse-dépose tout le dossier. En ligne en 30 s.
- **GitHub Pages** : pousse le dossier dans un repo, active Pages dans les réglages.

---

## 📁 Structure
```
index.html          → contenu et structure
styles.css          → design (couleurs, typo, mise en page)
script.js           → galeries, lightbox, menu mobile, formulaire
assets/
  photo.jpg         → TA PHOTO (à ajouter)
  photo-placeholder.svg
  gallery/          → images des projets (extraites du PDF)
  pages/            → rendu des pages du PDF (référence, non utilisé sur le site)
  images/           → images brutes extraites (référence)
```

> Les dossiers `assets/pages` et `assets/images` ne servent qu'à la référence et
> peuvent être supprimés pour alléger le site avant la mise en ligne.
