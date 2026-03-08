const gradesMap = {
  "Sapeur":           "Caporal",
  "Caporal":          "Caporal-Chef",
  "Caporal-Chef":     "Sergent",
  "Sergent":          "Sergent-Chef",
  "Sergent-Chef":     "Adjudant",
  "Adjudant":         "Adjudant-Chef",
  "Adjudant-Chef":    "Lieutenant",
  "Lieutenant":       "Capitaine",
  "Capitaine":        "Commandant",
  "Commandant":       "Lieutenant-Colonel",
  "Lieutenant-Colonel": "Colonel",
};

const postesNoms = {
  responsable_materiel:           "Responsable Matériel",
  responsable_pharmacie:          "Responsable Pharmacie",
  responsable_habillement:        "Responsable Habillement",
  responsable_vehicule:           "Responsable Véhicules",
  chef_section:                   "Chef de Section",
  responsable_formation_caserne:  "Responsable Formation Caserne",
  chef_centre_adjoint:            "Chef de Centre Adjoint",
  chef_centre:                    "Chef de Centre",
  chef_groupement:                "Chef de Groupement",
  chef_groupement_adjoint:        "Chef de Groupement Adjoint",
  responsable_formation:          "Responsable Formation",
  responsable_formation_adjoint:  "Responsable Formation Adjoint",
  responsable_operations:         "Responsable Opérations-Prévisions",
  responsable_operations_adjoint: "Responsable Opérations-Prévisions Adjoint",
  responsable_rh:                 "Responsable des Ressources Humaines",
  responsable_rh_adjoint:         "Responsable RH Adjoint",
  responsable_technique:          "Responsable Technique",
  responsable_technique_adjoint:  "Responsable Technique Adjoint",
};

function afficherPoste() {
  const aPoste = document.getElementById("aPoste").value;
  const bloc = document.getElementById("blocPoste");
  bloc.className = aPoste === "oui" ? "formulaire-visible" : "formulaire-cache";
}

function genererPromotion() {
  const grade    = document.getElementById("grade").value;
  const nom      = document.getElementById("nom").value;
  const aPoste   = document.getElementById("aPoste").value;
  const pa       = document.getElementById("pa").value;
  const cp       = document.getElementById("cp").value;
  const humeur   = document.getElementById("humeur").value;
  const presence = document.getElementById("presence").value;
  const epi      = document.getElementById("epi").value;
  const fma      = document.getElementById("fma").value;
  const planning = document.getElementById("planning").value;
  const avis     = document.getElementById("avis").value;
  const sig_grade   = document.getElementById("sig_grade").value;
  const sig_pseudo  = document.getElementById("sig_pseudo").value;
  const sig_fonction= document.getElementById("sig_fonction").value;
  const caserneBrute= document.getElementById("sig_caserne").value;
  const sig_caserne = caserneBrute.split("|")[0];
  const sig_sdis    = caserneBrute.split("|")[1];

  if (!nom) {
    alert("⚠️ Merci de remplir le pseudo du joueur.");
    return;
  }

  // Date
  const maintenant = new Date();
  const jour    = String(maintenant.getDate()).padStart(2, "0");
  const moisNum = String(maintenant.getMonth() + 1).padStart(2, "0");
  const annee   = maintenant.getFullYear();
  const dateComplete = `${jour}/${moisNum}/${annee}`;

  // Article
  const articleDe = (grade.startsWith("A") || grade.startsWith("O")) ? "de l'" : "du ";
const gradeSuperieur = gradesMap[grade] || "grade supérieur";
const articleSup = (gradeSuperieur.startsWith("A") || gradeSuperieur.startsWith("O")) ? "d'" : "de ";
const articlePres = (grade.startsWith("A") || grade.startsWith("O")) ? "L'" : "Le ";

const decision = avis === "favorable"
  ? `Avis Favorable à la demande de promotion ${articleDe}${grade} ${nom} au grade ${articleSup}${gradeSuperieur}.`
  : `Avis Défavorable à la demande de promotion ${articleDe}${grade} ${nom} au grade ${articleSup}${gradeSuperieur}.`;

  // Présence
 const article = articlePres;
  const presenceTexte = {
    quotidienne: "La connexion est quotidienne.",
    reguliere:   "La connexion est régulière.",
    irreguliere: "La connexion est irrégulière.",
  }[presence];

  // Stats
  const statsNote = (pa == 100 && cp == 100 && humeur == 100) ? "parfaites" :
    (pa >= 75 && cp >= 75 && humeur >= 75) ? "bonnes" : "insuffisantes";
  const statsTexte = `Ses statistiques sont ${statsNote} : Condition Physique à ${cp}%, Humeur ${humeur}% et Dépenses des PA's ${pa}%.`;

  // EPI
  const epiTexte = epi === "complet"
    ? "Son habillement est complet, entretenu et renouvelé !"
    : "Son habillement est incomplet ou mal entretenu.";

  // FMA
  const fmaTexte = fma === "ajour"
    ? "La FMA est tenue à jour"
    : "La FMA n'est pas à jour";

  // Planning
  const planningTexte = planning === "oui"
    ? "les plannings sont débloqués en temps et en heure."
    : "les plannings ne sont pas débloqués dans les temps.";

  // Poste
  let posteTexte = "";
  if (aPoste === "oui") {
    const poste = document.getElementById("poste").value;
    const tenue = document.getElementById("tenue_poste").value;
    const nomPoste = postesNoms[poste] || poste;
    const tenueTexte = {
      parfait:     "parfaitement tenu et en autonomie, les tâches demandées sont réalisées dans les délais",
      bien:        "bien tenu, les tâches demandées sont réalisées",
      moyen:       "tenu de manière passable",
      insuffisant: "insuffisamment tenu",
    }[tenue];
    posteTexte = `Le poste de ${nomPoste} est ${tenueTexte} !`;
  }

  // Conclusion
  const conclusionTexte = avis === "favorable"
    ? "L'avis favorable est entièrement mérité."
    : "L'avis défavorable est émis avec bienveillance. Des efforts sont encouragés pour une prochaine demande.";

  // Signature
  const signature = `Le ${dateComplete} - ${sig_grade} ${sig_pseudo}, ${sig_fonction}, ${sig_caserne}, SDIS ${sig_sdis}`;

  // Assemblage
  let texte = `[Avis de promotion] ${decision} ${presenceTexte} ${statsTexte} ${epiTexte} ${fmaTexte} et ${planningTexte}`;
  if (posteTexte) texte += ` ${posteTexte}`;
  texte += ` ${conclusionTexte} ${signature}`;

  // Affichage
  const resultat = document.getElementById("resultat");
  resultat.className = "formulaire-visible";
  resultat.innerHTML = `
    <h2>✅ Avis généré</h2>
    <div class="texte-genere">${texte}</div>
    <button class="btn-copier" onclick="copierTexte()">📋 Copier le texte</button>
  `;
  resultat.scrollIntoView({ behavior: "smooth" });
}

function copierTexte() {
  const texte = document.querySelector(".texte-genere").innerText;
  navigator.clipboard.writeText(texte).then(() => {
    alert("✅ Texte copié dans le presse-papier !");
  });
}

function resetPromotion() {
  document.getElementById("grade").selectedIndex = 0;
  document.getElementById("nom").value = "";
  document.getElementById("aPoste").selectedIndex = 0;
  document.getElementById("blocPoste").className = "formulaire-cache";
  document.getElementById("pa").value = 100;
  document.getElementById("cp").value = 100;
  document.getElementById("humeur").value = 100;
  document.getElementById("presence").selectedIndex = 0;
  document.getElementById("epi").selectedIndex = 0;
  document.getElementById("fma").selectedIndex = 0;
  document.getElementById("planning").selectedIndex = 0;
  document.getElementById("avis").selectedIndex = 0;
  document.getElementById("resultat").className = "formulaire-cache";
  window.scrollTo({ top: 0, behavior: "smooth" });
}