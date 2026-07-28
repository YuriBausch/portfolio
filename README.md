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

## 🚀 4. Site en ligne
Le site est hébergé **gratuitement** sur **GitHub Pages** :

### 🌐 https://yuribausch.github.io/portfolio/

- **Dépôt** : https://github.com/YuriBausch/portfolio (branche `main`)
- **Hébergement** : GitHub Pages (gratuit, HTTPS automatique)

### Mettre à jour le site en ligne
Après avoir modifié un fichier en local, dans un terminal sur le dossier du projet :
```bash
git add -A
git commit -m "Mise à jour du portfolio"
git push
```
Le site se reconstruit tout seul en ~1 minute.

---

## 📊 5. Activer les statistiques de visite (GoatCounter — gratuit, sans cookie)
Pour savoir combien de recruteurs visitent ton site :
1. Va sur **https://www.goatcounter.com** → crée un compte gratuit et choisis un code (ex. `yuribausch`).
2. Ton adresse de stats sera `https://TONCODE.goatcounter.com`.
3. Dans **`index.html`** ET **`en/index.html`**, cherche `VOTRECODE` et remplace-le par ton code.
4. `git add -A && git commit -m "stats" && git push`. C'est actif ✅

Tant que `VOTRECODE` n'est pas remplacé, aucun script de stats n'est chargé (site 100 % propre).

---

## 🌍 Version bilingue
- **Français** : `index.html` → https://yuribausch.github.io/portfolio/
- **Anglais** : `en/index.html` → https://yuribausch.github.io/portfolio/en/
- Le bouton **FR / EN** en haut à droite bascule entre les deux.
- ⚠️ Si tu modifies un texte, pense à le changer **dans les deux fichiers**.

---

## 📁 Structure
```
index.html          → page FR (contenu + structure)
en/index.html       → page EN (traduction)
styles.css          → design (couleurs, typo, thème clair/sombre)
script.js           → galeries, lightbox, menu, formulaire, thème, stats
favicon.ico         → icône de l'onglet
404.html            → page d'erreur personnalisée
robots.txt, sitemap.xml → référencement
assets/
  photo.webp        → ta photo de profil
  CV-Yuri-Bausch.pdf→ ton CV (téléchargeable depuis le site)
  og-image.png      → aperçu lors du partage du lien
  favicon.svg, apple-touch-icon.png … → icônes
  gallery/          → images des projets (WebP, optimisées)
  films/            → visuels des projets audiovisuels
```
