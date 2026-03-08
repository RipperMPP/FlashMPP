let nbCopies = 1;

function ajouterCopie() {
  const liste = document.getElementById("liste_copies");
  const div = document.createElement("div");
  div.className = "copie-item";
  div.id = "copie_" + nbCopies;
  div.innerHTML = `
    <div class="champ"><label>Grade</label>
      <select class="copie_grade">
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
        <option value="Colonel|13">Colonel</option>
      </select>
    </div>
    <div class="champ"><label>Pseudo</label><input type="text" class="copie_pseudo" placeholder="Pseudo" /></div>
    <div class="champ"><label>Fonction</label><input type="text" class="copie_fonction" placeholder="Ex: Chef de Centre Adjoint" /></div>
    <div class="champ"><label>Caserne</label><input type="text" class="copie_caserne" placeholder="Ex: CIS Lambesc" /></div>
  `;
  liste.appendChild(div);
  nbCopies++;
}

function supprimerCopie() {
  if (nbCopies <= 1) return;
  nbCopies--;
  const el = document.getElementById("copie_" + nbCopies);
  if (el) el.remove();
}

function genererSanction() {
  const niveau        = document.getElementById("niveau_sanction").value;
  const motif         = document.getElementById("motif").value;
  const date_sanction = document.getElementById("date_sanction").value;
  const date_prec     = document.getElementById("date_precedente").value;
  const nds_texte     = document.getElementById("nds_texte").value;
  const dest_brut     = document.getElementById("dest_grade").value;
  const dest_grade    = dest_brut.split("|")[0];
  const dest_num      = dest_brut.split("|")[1];
  const dest_pseudo   = document.getElementById("dest_pseudo").value;
  const dest_fonction = document.getElementById("dest_fonction").value;
  const sig_brut      = document.getElementById("sig_grade").value;
  const sig_grade     = sig_brut.split("|")[0];
  const sig_num       = sig_brut.split("|")[1];
  const sig_pseudo    = document.getElementById("sig_pseudo").value;
  const sig_fonction  = document.getElementById("sig_fonction").value;
  const caserne_brut  = document.getElementById("sig_caserne").value;
  const sig_caserne   = caserne_brut.split("|")[0];

  if (!dest_pseudo || !sig_pseudo || !date_sanction) {
    alert("⚠️ Merci de remplir le pseudo destinataire, émetteur et la date.");
    return;
    incrementerCompteur();
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
    epi: "attribution d'EPI sans demande de renouvellement préalable",
  };

  const motifsCorps = {
    planning:     "En effet, vous n'avez pas débloqué votre planning dans les délais prévus et ceux malgré une relance amicale de votre hiérarchie.",
    poste:        "En effet, votre poste n'a pas été tenu correctement ce mois-ci, malgré les rappels effectués par votre hiérarchie.",
    formation:    "En effet, vous n'avez pas libéré vos heures de formation / visite médicale dans les délais impartis, et ceux malgré une relance amicale de votre hiérarchie.",
    budget:       "En effet, la gestion du budget qui vous est confié n'a pas été effectuée correctement, mettant en difficulté le bon fonctionnement du centre.",
    vehicule:     "En effet, un véhicule est passé indisponible suite à une mauvaise gestion de votre poste, impactant la capacité opérationnelle du centre.",
    comportement: "En effet, votre comportement au sein du CIS n'est pas en adéquation avec les règles en vigueur et les valeurs attendues de tout agent.",
    statistiques: "En effet, vos statistiques sont inférieures à 10% ce mois-ci, ce qui est en dessous du seuil minimum requis par les NDS en vigueur.",
  epi: "En effet, vous avez obtenu des EPI sans avoir effectué de demande de renouvellement, contrairement à la procédure en vigueur.",
  };

  // Destinataire
  const destFonctionStr = dest_fonction ? ` - ${dest_fonction}` : "";
  const destinataire = `[b] [s]Destinataire :[/s] [img taille=20]https://monpompier.com/templates/images/grades/svg/grade${dest_num}.svg[/img] ${dest_pseudo}${destFonctionStr} [/b]`;

  // Date précédente
  const datePrecStr = date_prec
    ? `[b] [couleur=red]${date_prec}[/couleur] [/b]`
    : `[b] [couleur=red]//[/couleur] [/b]`;
  const datePrecedente = `[couleur=cyan] [b] [s]Date de la précédente sanction :[/s] [/b] [/couleur] ${datePrecStr}`;

  // Émetteur
  const emetteur = `[droite] [b] [couleur=blue] [s]Émetteur :[/s] 
[img taille=20]https://monpompier.com/templates/images/grades/svg/grade${sig_num}.svg[/img] ${sig_pseudo} - ${sig_fonction} - ${sig_caserne}[/b] [/couleur] [/droite]`;

  // Copies
  const copieItems = document.querySelectorAll(".copie-item");
  let copiesStr = "";
  copieItems.forEach(item => {
    const cGradeBrut = item.querySelector(".copie_grade").value;
    const cNum       = cGradeBrut.split("|")[1];
    const cPseudo    = item.querySelector(".copie_pseudo").value;
    const cFonction  = item.querySelector(".copie_fonction").value;
    const cCaserne   = item.querySelector(".copie_caserne").value;
    if (cPseudo) {
      copiesStr += `[img taille=20]https://monpompier.com/templates/images/grades/svg/grade${cNum}.svg[/img] ${cPseudo} - ${cFonction} - ${cCaserne}\n`;
    }
  });
  const copies = `[droite] [b] [couleur=cyan] [s]En copies :[/s] 
${copiesStr}[/couleur] [/b] [/droite]`;

  // Objet
  const objet = `[b] [s]Objet:[/s] [/b] [b] [couleur=red]${niveauNom}[/couleur] [/b]`;

  // NDS
  const ndsBloc = nds_texte
    ? `[quote=Note de Service]${nds_texte}[/quote]\n`
    : "";

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
}

function copierTexte() {
  const texte = document.getElementById("corps-sanction").innerText;
  navigator.clipboard.writeText(texte).then(() => alert("✅ Texte copié !"));
}

function resetSanction() {
  document.getElementById("niveau_sanction").selectedIndex = 0;
  document.getElementById("motif").selectedIndex = 0;
  document.getElementById("date_sanction").value = "";
  document.getElementById("date_precedente").value = "";
  document.getElementById("nds_texte").value = "";
  document.getElementById("dest_grade").selectedIndex = 0;
  document.getElementById("dest_pseudo").value = "";
  document.getElementById("dest_fonction").value = "";
  document.getElementById("resultat").className = "formulaire-cache";

  const liste = document.getElementById("liste_copies");
  liste.innerHTML = `
    <div class="copie-item" id="copie_0">
      <div class="champ"><label>Grade</label>
        <select class="copie_grade">
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
          <option value="Colonel|13">Colonel</option>
        </select>
      </div>
      <div class="champ"><label>Pseudo</label><input type="text" class="copie_pseudo" placeholder="Pseudo" /></div>
      <div class="champ"><label>Fonction</label><input type="text" class="copie_fonction" placeholder="Ex: Chef de Centre Adjoint" /></div>
      <div class="champ"><label>Caserne</label><input type="text" class="copie_caserne" placeholder="Ex: CIS Lambesc" /></div>
    </div>`;
  nbCopies = 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function incrementerCompteur() {
  const url = "https://flashmpp-default-rtdb.europe-west1.firebasedatabase.app/compteur/avis.json";
  fetch(url).then(r => r.json()).then(val => {
    fetch(url, {
      method: "PUT",
      body: JSON.stringify((val || 0) + 1)
    });
  });
}
