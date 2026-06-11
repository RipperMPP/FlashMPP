// Notes courantes par critère
const notes = {
  communication: 0,
  presence:      0,
  travail:       0,
  comportement:  0,
};

// Textes explicatifs par critère et par note
const commentaires = {
  communication: [
    "La communication est inexistante, aucun échange avec la hiérarchie ou le personnel du CIS.",
    "La communication est très insuffisante et doit impérativement être améliorée.",
    "La communication est insuffisante et nécessite des efforts notables.",
    "La communication est correcte mais peut encore progresser.",
    "La communication est bonne, les échanges avec la hiérarchie et le personnel sont de qualité.",
    "La communication est excellente, tant avec la hiérarchie qu'avec l'ensemble du personnel du CIS.",
  ],
  presence: [
    "Aucune présence constatée ce mois-ci.",
    "La présence est très insuffisante, quasi-absente.",
    "La présence est insuffisante, des efforts sont nécessaires.",
    "La présence est correcte mais irrégulière.",
    "La présence est bonne et régulière.",
    "La présence est exemplaire et quotidienne, un point très positif.",
  ],
  travail: [
    "Aucun travail fourni ni investissement constaté.",
    "Le travail fourni est très insuffisant et l'investissement est quasi nul.",
    "Le travail fourni et l'investissement sont insuffisants, des efforts sont attendus.",
    "Le travail fourni et l'investissement sont corrects et dans les attentes.",
    "Le travail est bien fourni et l'investissement au sein du CIS est appréciable.",
    "Le travail est excellent et l'investissement est exemplaire au sein du CIS.",
  ],
  comportement: [
    "Le comportement est inacceptable et ne respecte pas les valeurs du CIS.",
    "Le comportement est très insuffisant, des mesures correctives sont nécessaires.",
    "Le comportement est insuffisant, des progrès significatifs sont attendus.",
    "Le comportement est correct et dans les normes attendues.",
    "Le comportement est très bon et le savoir-être au sein du CIS est apprécié.",
    "Le comportement est exemplaire et le savoir-être est irréprochable.",
  ],
};

// Mention globale selon la note /20
function mentionGlobale(total) {
  if (total <= 4)  return "Insuffisant";
  if (total <= 8)  return "Passable";
  if (total <= 12) return "Correct";
  if (total <= 16) return "Bien";
  if (total <= 19) return "Très bien";
  return "Excellent";
}

// Gestion des boutons de note
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".note-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const critere = btn.dataset.critere;
      const val     = parseInt(btn.dataset.val);
      notes[critere] = val;

      // Mise à jour visuelle des boutons
      document.querySelectorAll(`.note-btn[data-critere="${critere}"]`).forEach(b => {
        b.classList.toggle("active", parseInt(b.dataset.val) === val);
        b.classList.toggle("selected", parseInt(b.dataset.val) === val);
      });

      // Mise à jour score affiché
      document.getElementById(`score_${critere}`).textContent = `${val} / 5`;

      // Note globale
      const total = Object.values(notes).reduce((a, b) => a + b, 0);
      document.getElementById("note-globale-val").textContent = total;

      updateProgress();
    });
  });

  updateProgress();
});

function updateProgress() {
  const steps = [
    !!document.getElementById("nom").value.trim(),
    true, // notes toujours définies (0 par défaut)
    !!document.getElementById("sig_pseudo").value.trim(),
  ];
  const done = steps.filter(Boolean).length;
  const pct  = Math.round((done / steps.length) * 100);
  const fill = document.getElementById("progress-fill");
  fill.style.width      = pct + "%";
  fill.style.background = pct === 100
    ? "#238636"
    : "linear-gradient(90deg, #e63946, #ff6b6b)";
  document.getElementById("progress-pct").textContent = pct + "%";
}

function genererNotation() {
  const grade       = document.getElementById("grade").value;
  const nom         = document.getElementById("nom").value.trim();
  const sig_grade   = document.getElementById("sig_grade").value;
  const sig_pseudo  = document.getElementById("sig_pseudo").value.trim();
  const sig_fonction= document.getElementById("sig_fonction").value;
  const caserneBrute= document.getElementById("sig_caserne").value;
  const sig_caserne = caserneBrute.split("|")[0];
  const sig_sdis    = caserneBrute.split("|")[1];
  const opt_entete  = document.getElementById("opt_entete").checked;
  const opt_sig     = document.getElementById("opt_signature").checked;

  if (!nom) {
    afficherToast("⚠️ Merci de remplir le pseudo du joueur.");
    return;
  }

  const total   = Object.values(notes).reduce((a, b) => a + b, 0);
  const mention = mentionGlobale(total);

  const article = (grade.startsWith("A") || grade.startsWith("O")) ? "L'" : "Le ";

  const maintenant   = new Date();
  const jour         = String(maintenant.getDate()).padStart(2, "0");
  const moisNum      = String(maintenant.getMonth() + 1).padStart(2, "0");
  const annee        = maintenant.getFullYear();
  const dateComplete = `${jour}/${moisNum}/${annee}`;

  let texte = "";

  if (opt_entete) {
    texte += `[Avis de Notation]\n\n`;
  }

  texte += `${article}${grade} ${nom} obtient la note globale de ${total}/20 — ${mention}.\n\n`;
  texte += `📡 Communication : ${notes.communication}/5 — ${commentaires.communication[notes.communication]}\n`;
  texte += `📅 Présence : ${notes.presence}/5 — ${commentaires.presence[notes.presence]}\n`;
  texte += `💼 Travail Fourni / Investissement : ${notes.travail}/5 — ${commentaires.travail[notes.travail]}\n`;
  texte += `🤝 Comportement / Savoir-être : ${notes.comportement}/5 — ${commentaires.comportement[notes.comportement]}\n`;
  texte += `\n[Votre commentaire personnalisé ici]\n`;

  if (opt_sig) {
    texte += `\n- Le ${dateComplete} - ${sig_grade} ${sig_pseudo}, ${sig_fonction}, ${sig_caserne}, SDIS ${sig_sdis}`;
  }

  const resultat = document.getElementById("resultat");
  resultat.className = "formulaire-visible";
  resultat.innerHTML = `
    <h2>✅ Avis généré</h2>
    <p style="color:#8b949e; font-size:13px; margin-bottom:12px;">Personnalisez le texte ci-dessous avant de copier.</p>
    <textarea class="texte-genere texte-editable" id="texte-notation">${texte}</textarea>
    <button class="btn-copier" onclick="copierTexte()">📋 Copier le texte</button>
    <button type="button" onclick="resetNotation()" style="background-color:#30363d; margin-top:10px;">🔄 Réinitialiser</button>
  `;
  resultat.scrollIntoView({ behavior: "smooth" });

  incrementerCompteur();
}

function copierTexte() {
  const texte = document.getElementById("texte-notation").value;
  navigator.clipboard.writeText(texte).then(() => afficherToast("✅ Texte copié !"));
}

function afficherToast(msg) {
  const t = document.getElementById("toast-copie");
  t.textContent = msg;
  t.classList.add("visible");
  setTimeout(() => t.classList.remove("visible"), 2000);
}

function resetNotation() {
  // Réinitialiser les notes
  Object.keys(notes).forEach(c => {
    notes[c] = 0;
    document.querySelectorAll(`.note-btn[data-critere="${c}"]`).forEach(b => {
      b.classList.toggle("active",    parseInt(b.dataset.val) === 0);
      b.classList.toggle("selected",  parseInt(b.dataset.val) === 0);
    });
    document.getElementById(`score_${c}`).textContent = "0 / 5";
  });
  document.getElementById("note-globale-val").textContent = "0";
  document.getElementById("nom").value           = "";
  document.getElementById("opt_entete").checked  = false;
  document.getElementById("opt_signature").checked = false;
  document.getElementById("resultat").className  = "formulaire-cache";
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function incrementerCompteur() {
  const url = "https://flashmpp-default-rtdb.europe-west1.firebasedatabase.app/compteur/avis.json";
  fetch(url).then(r => r.json()).then(val => {
    fetch(url, { method: "PUT", body: JSON.stringify((val || 0) + 1) });
  });
}