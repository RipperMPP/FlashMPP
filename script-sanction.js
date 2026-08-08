let nbCopies = 1;

// ── Snippets HTML réutilisables ──────────────────────────────────────────────

const FONCTIONS_OPTIONS = `
  <option value="">Aucune</option>
  <optgroup label="--- Caserne ---">
    <option value="Responsable Pharmacie">Responsable Pharmacie</option>
    <option value="Responsable Matériel">Responsable Matériel</option>
    <option value="Responsable Habillement">Responsable Habillement</option>
    <option value="Responsable Véhicules">Responsable Véhicules</option>
    <option value="Chef de Section">Chef de Section</option>
    <option value="Responsable Formation Caserne">Responsable Formation Caserne</option>
    <option value="Chef de Centre Adjoint">Chef de Centre Adjoint</option>
    <option value="Chef de Centre">Chef de Centre</option>
  </optgroup>
  <optgroup label="--- Groupement ---">
    <option value="Responsable Technique Adjoint">Responsable Technique Adjoint</option>
    <option value="Responsable Technique">Responsable Technique</option>
    <option value="Responsable RH Adjoint">Responsable RH Adjoint</option>
    <option value="Responsable des Ressources Humaines">Responsable des Ressources Humaines</option>
    <option value="Responsable Opérations-Prévisions Adjoint">Responsable Opérations-Prévisions Adjoint</option>
    <option value="Responsable Opérations-Prévisions">Responsable Opérations-Prévisions</option>
    <option value="Responsable Formation Adjoint">Responsable Formation Adjoint</option>
    <option value="Responsable Formation">Responsable Formation</option>
    <option value="Chef de Groupement Adjoint">Chef de Groupement Adjoint</option>
    <option value="Chef de Groupement">Chef de Groupement</option>
  </optgroup>
  <optgroup label="--- Direction ---">
    <option value="Directeur Ressources Humaines Adjoint">Directeur Ressources Humaines Adjoint</option>
    <option value="Directeur Ressources Humaines">Directeur Ressources Humaines</option>
    <option value="Directeur Départemental Adjoint">Directeur Départemental Adjoint</option>
    <option value="Directeur Départemental">Directeur Départemental</option>
  <optgroup label="--- État-Major ---">
    <option value="CASDIS">CASDIS</option>
  </optgroup>`;

const CASERNES_OPTIONS = `
  <optgroup label="--- SDIS 13 — Bouches-du-Rhône ---">
    <option value="CIS Alpilles-Durance">CIS Alpilles-Durance</option>
    <option value="CIS Chateaurenard">CIS Chateaurenard</option>
    <option value="CIS Eyguières">CIS Eyguières</option>
    <option value="CIS Istres">CIS Istres</option>
    <option value="CIS Lambesc">CIS Lambesc</option>
    <option value="CIS Mallemort">CIS Mallemort</option>
    <option value="CIS Salon-de-Provence">CIS Salon-de-Provence</option>
    <option value="CIS Vallée des Baux">CIS Vallée des Baux</option>
    <option value="Groupement Centre">Groupement Centre</option>
    <option value="Groupement Nord">Groupement Nord</option>
  </optgroup>
  <optgroup label="--- SDIS 67 — Bas-Rhin ---">
    <option value="CIS Bischwiller">CIS Bischwiller</option>
    <option value="CIS Molsheim">CIS Molsheim</option>
    <option value="CIS Petersbach">CIS Petersbach</option>
    <option value="CIS Saverne">CIS Saverne</option>
    <option value="CIS Strasbourg Ouest">CIS Strasbourg Ouest</option>
    <option value="CIS Truchtersheim">CIS Truchtersheim</option>
    <option value="CIS Val de Moder">CIS Val de Moder</option>
    <option value="CIS Wasselonne">CIS Wasselonne</option>
    <option value="Groupement Nord">Groupement Nord</option>
    <option value="Groupement Sud">Groupement Sud</option>
  </optgroup>
  <optgroup label="--- Autre ---">
    <option value="Direction SDIS 13">Direction SDIS 13</option>
    <option value="Direction SDIS 67">Direction SDIS 67</option>
  <optgroup label="--- État-Major ---">
    <option value="CASDIS">CASDIS</option>
  </optgroup>`;

const GRADES_OPTIONS = `
  <option value="Sapeur|2">Sapeur</option>
  <option value="Caporal|3">Caporal</option>
  <option value="Caporal-Chef|4">Caporal-Chef</option>
  <option value="Sergent|5">Sergent</option>
  <option value="Sergent-Chef|6">Sergent-Chef</option>
  <option value="Adjudant|7">Adjudant</option>
  <option value="Adjudant-Chef|8">Adjudant-Chef</option>
  <option value="Lieutenant|9">Lieutenant</option>
  <option value="Capitaine|10">Capitaine</option>
  <option value="Commandant|11">Commandant</option>
  <option value="Lieutenant-Colonel|12">Lieutenant-Colonel</option>
  <option value="Colonel|13">Colonel</option>`;

// ── Toggle motif autre ───────────────────────────────────────────────────────

function toggleMotifAutre() {
  const val = document.getElementById("motif").value;
  document.getElementById("bloc_motif_autre").className =
    val === "autre" ? "champ formulaire-visible" : "champ formulaire-cache";
}

// ── Ajout / suppression de copies ───────────────────────────────────────────

function ajouterCopie() {
  const liste = document.getElementById("liste_copies");
  const div   = document.createElement("div");
  div.className = "copie-item";
  div.id = "copie_" + nbCopies;
  div.innerHTML = `
    <div class="champ"><label>Grade</label>
      <select class="copie_grade">${GRADES_OPTIONS}</select>
    </div>
    <div class="champ"><label>Pseudo</label>
      <input type="text" class="copie_pseudo" placeholder="Pseudo" />
    </div>
    <div class="champ"><label>Fonction</label>
      <select class="copie_fonction">${FONCTIONS_OPTIONS}</select>
    </div>
    <div class="champ"><label>Caserne / Groupement</label>
      <select class="copie_caserne">${CASERNES_OPTIONS}</select>
    </div>`;
  liste.appendChild(div);
  nbCopies++;
}

function supprimerCopie() {
  if (nbCopies <= 1) return;
  nbCopies--;
  const el = document.getElementById("copie_" + nbCopies);
  if (el) el.remove();
}

// ── Génération ───────────────────────────────────────────────────────────────

function genererSanction() {
  const niveau        = document.getElementById("niveau_sanction").value;
  const motif         = document.getElementById("motif").value;
  const motif_autre_texte = document.getElementById("motif_autre_texte").value.trim();
  const date_sanction = document.getElementById("date_sanction").value;
  const date_prec     = document.getElementById("date_precedente").value;
  const nds_titre     = document.getElementById("nds_titre").value.trim();
  const nds_texte     = document.getElementById("nds_texte").value.trim();
  const dest_brut     = document.getElementById("dest_grade").value;
  const dest_grade    = dest_brut.split("|")[0];
  const dest_num      = dest_brut.split("|")[1];
  const dest_pseudo   = document.getElementById("dest_pseudo").value.trim();
  const dest_fonction = document.getElementById("dest_fonction").value;
  const dest_caserne  = document.getElementById("dest_caserne").value;
  const sig_brut      = document.getElementById("sig_grade").value;
  const sig_grade     = sig_brut.split("|")[0];
  const sig_num       = sig_brut.split("|")[1];
  const sig_pseudo    = document.getElementById("sig_pseudo").value.trim();
  const sig_fonctionRaw = document.getElementById("sig_fonction").value;
  const sig_fonction    = sig_fonctionRaw ? ` - ${sig_fonctionRaw}` : "";
  const caserne_brut  = document.getElementById("sig_caserne").value;
  const sig_caserne   = caserne_brut.split("|")[0];

  if (!dest_pseudo || !sig_pseudo || !date_sanction) {
    afficherToast("⚠️ Pseudo destinataire, émetteur et date requis.");
    return;
  }

  // Formatage date
  const d = new Date(date_sanction);
  const dateFormatee = `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;

  // Niveaux
  const niveauxNoms = {
    rappel: "Rappel Officiel",
    avert1: "Avertissement de niveau 1",
    avert2: "Avertissement de niveau 2",
    avert3: "Avertissement de niveau 3",
    avert4: "Avertissement de niveau 4",
  };
  const niveauxSuivants = {
    rappel: "un Avertissement de niveau 1",
    avert1: "un Avertissement de niveau 2",
    avert2: "un Avertissement de niveau 3",
    avert3: "un Avertissement de niveau 4",
    avert4: "un licenciement",
  };
  const niveauNom     = niveauxNoms[niveau];
  const niveauSuivant = niveauxSuivants[niveau];

  // Motifs
  const motifsTexte = {
    planning:     "non déblocage de votre planning",
    poste:        "mauvaise gestion de votre poste",
    formation:    "non libération de vos heures de formation / visite médicale",
    budget:       "mauvaise gestion du budget",
    vehicule:     "indisponibilité d'un véhicule suite à une mauvaise gestion de votre poste",
    comportement: "comportement inapproprié au sein du CIS",
    statistiques: "statistiques inférieures à 10%",
    epi:          "attribution d'EPI sans demande de renouvellement préalable",
    autre:        "motif libre",
  };
  const motifsCorps = {
    planning:     "En effet, vous n'avez pas débloqué votre planning dans les délais prévus et ceux malgré une relance amicale de votre hiérarchie.",
    poste:        "En effet, votre poste n'a pas été tenu correctement ce mois-ci, malgré les rappels effectués par votre hiérarchie.",
    formation:    "En effet, vous n'avez pas libéré vos heures de formation / visite médicale dans les délais impartis, et ceux malgré une relance amicale de votre hiérarchie.",
    budget:       "En effet, la gestion du budget qui vous est confié n'a pas été effectuée correctement, mettant en difficulté le bon fonctionnement du centre.",
    vehicule:     "En effet, un véhicule est passé indisponible suite à une mauvaise gestion de votre poste, impactant la capacité opérationnelle du centre.",
    comportement: "En effet, votre comportement au sein du CIS n'est pas en adéquation avec les règles en vigueur et les valeurs attendues de tout agent.",
    statistiques: "En effet, vos statistiques sont inférieures à 10% ce mois-ci, ce qui est en dessous du seuil minimum requis par les NDS en vigueur.",
    epi:          "En effet, vous avez obtenu des EPI sans avoir effectué de demande de renouvellement, contrairement à la procédure en vigueur.",
    autre:        motif_autre_texte,
  };

  // Destinataire
  const destFonctionStr = dest_fonction ? ` - ${dest_fonction}` : "";
  const destinataire = `[b] [s]Destinataire :[/s] [img taille=20]https://monpompier.com/templates/images/grades/svg/grade${dest_num}.svg[/img] ${dest_pseudo}${destFonctionStr} - ${dest_caserne} [/b]`;

  // Date précédente
  const datePrecStr = date_prec
    ? `[b] [couleur=red]${date_prec}[/couleur] [/b]`
    : `[b] [couleur=red]//[/couleur] [/b]`;
  const datePrecedente = `[couleur=cyan] [b] [s]Date de la précédente sanction :[/s] [/b] [/couleur] ${datePrecStr}`;

  // Émetteur
  const emetteur = `[droite] [b] [couleur=blue] [s]Émetteur :[/s] 
[img taille=20]https://monpompier.com/templates/images/grades/svg/grade${sig_num}.svg[/img] ${sig_pseudo}${sig_fonction} - ${sig_caserne}[/b] [/couleur] [/droite]`;

  // Copies
  const copieItems = document.querySelectorAll(".copie-item");
  let copiesStr = "";
  copieItems.forEach(item => {
    const cGradeBrut = item.querySelector(".copie_grade").value;
    const cNum       = cGradeBrut.split("|")[1];
    const cPseudo    = item.querySelector(".copie_pseudo").value.trim();
    const cFonction  = item.querySelector(".copie_fonction").value;
    const cCaserne   = item.querySelector(".copie_caserne").value;
    if (cPseudo) {
      const cFonctionStr = cFonction ? ` - ${cFonction}` : "";
      copiesStr += `[img taille=20]https://monpompier.com/templates/images/grades/svg/grade${cNum}.svg[/img] ${cPseudo}${cFonctionStr} - ${cCaserne}\n`;
    }
  });
  const copies = `[droite] [b] [couleur=cyan] [s]En copies :[/s] 
${copiesStr}[/couleur] [/b] [/droite]`;

  // Objet
  const objet = `[b] [s]Objet:[/s] [/b] [b] [couleur=red]${niveauNom}[/couleur] [/b]`;

  // NDS
  let ndsBloc = "";
  if (nds_texte) {
    const ndsLabel = nds_titre ? `Note de Service — ${nds_titre}` : "Note de Service";
    ndsBloc = `[quote=${ndsLabel}]${nds_texte}[/quote]\n`;
  }

  // Corps
  const corps = `Bonjour,
Le [b] [i]${dateFormatee}[/i] [/b], vous êtes sanctionné(e) d'un ${niveauNom.toLowerCase()} pour ${motifsTexte[motif]}.
${motifsCorps[motif]}
${ndsBloc}Par ailleurs, en cas de nouveau manquement aux NDS en vigueur, la procédure continuera avec [couleur=red]${niveauSuivant}[/couleur], dans un délai de 7 jours.
Nous restons à votre disposition pour échanger et vous conseiller afin d'éviter une prochaine sanction.
Cordialement,`;

  // Assemblage BBCode
  const bbcode = `[centre] [h1] [couleur=red] [s]${niveauNom}[/s] [/couleur] [/h1] [/centre]
${destinataire}
${datePrecedente}
${emetteur}
${copies}
${objet}
${corps}`;

  // Affichage
  const resultat = document.getElementById("resultat");
  resultat.className = "formulaire-visible";
  resultat.innerHTML = `
    <h2>✅ Sanction générée</h2>
    <div class="texte-genere" id="corps-sanction">${bbcode}</div>
    <button class="btn-copier" onclick="copierTexte()">📋 Copier le texte</button>
  `;
  resultat.scrollIntoView({ behavior: "smooth" });

  incrementerCompteur();
}

// ── Copie ────────────────────────────────────────────────────────────────────

function copierTexte() {
  const texte = document.getElementById("corps-sanction").innerText;
  navigator.clipboard.writeText(texte).then(() => afficherToast("✅ Texte copié !"));
}

function afficherToast(msg) {
  const t = document.getElementById("toast-copie");
  t.textContent = msg;
  t.classList.add("visible");
  setTimeout(() => t.classList.remove("visible"), 2000);
}

// ── Progression ──────────────────────────────────────────────────────────────

function updateProgress() {
  const steps = [
    !!document.getElementById("date_sanction").value,
    !!document.getElementById("dest_pseudo").value.trim(),
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

// ── Reset ────────────────────────────────────────────────────────────────────

function resetSanction() {
  document.getElementById("niveau_sanction").selectedIndex = 0;
  document.getElementById("motif").selectedIndex           = 0;
  document.getElementById("motif_autre_texte").value      = "";
  document.getElementById("bloc_motif_autre").className   = "champ formulaire-cache";
  document.getElementById("date_sanction").value          = "";
  document.getElementById("date_precedente").value        = "";
  document.getElementById("nds_titre").value              = "";
  document.getElementById("nds_texte").value              = "";
  document.getElementById("dest_grade").selectedIndex     = 0;
  document.getElementById("dest_pseudo").value            = "";
  document.getElementById("dest_fonction").selectedIndex  = 0;
  document.getElementById("dest_caserne").selectedIndex   = 0;
  document.getElementById("sig_pseudo").value             = "";
  document.getElementById("sig_fonction").selectedIndex   = 0;
  document.getElementById("resultat").className           = "formulaire-cache";

  const liste = document.getElementById("liste_copies");
  liste.innerHTML = `
    <div class="copie-item" id="copie_0">
      <div class="champ"><label>Grade</label>
        <select class="copie_grade">${GRADES_OPTIONS}</select>
      </div>
      <div class="champ"><label>Pseudo</label>
        <input type="text" class="copie_pseudo" placeholder="Pseudo" />
      </div>
      <div class="champ"><label>Fonction</label>
        <select class="copie_fonction">${FONCTIONS_OPTIONS}</select>
      </div>
      <div class="champ"><label>Caserne / Groupement</label>
        <select class="copie_caserne">${CASERNES_OPTIONS}</select>
      </div>
    </div>`;
  nbCopies = 1;
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", updateProgress);

function incrementerCompteur() {
  const url = "https://flashmpp-default-rtdb.europe-west1.firebasedatabase.app/compteur/avis.json";
  fetch(url).then(r => r.json()).then(val => {
    fetch(url, { method: "PUT", body: JSON.stringify((val || 0) + 1) });
  });
}