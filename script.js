const champsParPoste = {
  responsable_materiel:           ["tenue_poste", "indispo_vehicule", "budget"],
  responsable_pharmacie:          ["tenue_poste", "indispo_vehicule", "desinfection", "budget"],
  responsable_habillement:        ["tenue_poste", "controle_vestiaires", "budget"],
  responsable_vehicule:           ["tenue_poste", "indispo_vehicule", "budget"],
  chef_section:                   ["tenue_poste", "crss", "avis_section", "promotions_section", "plannings_section"],
  responsable_formation_caserne:  ["tenue_poste", "traitement_formations", "transmission_formations"],
  chef_centre_adjoint:            ["tenue_poste", "budget", "surveillance_subordonnes", "promotions_exclusions", "crss", "avis_responsables", "equilibrage_sections", "repartition_taches"],
  chef_centre:                    ["tenue_poste", "budget", "surveillance_subordonnes", "promotions_exclusions", "crss", "avis_responsables", "equilibrage_sections", "repartition_taches"],
  chef_groupement:                ["tenue_poste", "budget", "surveillance_subordonnes"],
  chef_groupement_adjoint:        ["tenue_poste", "budget", "surveillance_subordonnes"],
  responsable_formation:          ["tenue_poste", "traitement_formations"],
  responsable_formation_adjoint:  ["tenue_poste", "traitement_formations"],
  responsable_operations:         ["tenue_poste", "crss"],
  responsable_operations_adjoint: ["tenue_poste", "crss"],
  responsable_rh:                 ["tenue_poste", "promotions_exclusions", "surveillance_subordonnes"],
  responsable_rh_adjoint:         ["tenue_poste", "promotions_exclusions", "surveillance_subordonnes"],
  responsable_technique:          ["tenue_poste", "budget", "surveillance_subordonnes"],
  responsable_technique_adjoint:  ["tenue_poste", "budget", "surveillance_subordonnes"],
};

const tousLesBlocs = [
  "tenue_poste", "indispo_vehicule", "desinfection", "controle_vestiaires",
  "budget", "crss", "avis_section", "promotions_section", "plannings_section",
  "traitement_formations", "transmission_formations", "surveillance_subordonnes",
  "promotions_exclusions", "avis_responsables", "equilibrage_sections", "repartition_taches"
];

function afficherPoste() {
  const aPoste = document.getElementById("aPoste").value;
  const bloc = document.getElementById("blocPoste");
  bloc.className = aPoste === "oui" ? "formulaire-visible" : "formulaire-cache";
  if (aPoste === "oui") afficherChampPoste();
}

function afficherChampPoste() {
  const poste = document.getElementById("poste").value;
  const champsActifs = champsParPoste[poste] || [];
  tousLesBlocs.forEach(champ => {
    const el = document.getElementById("bloc_" + champ);
    if (el) el.style.display = champsActifs.includes(champ) ? "flex" : "none";
  });
}

function genererAvis() {
  const grade         = document.getElementById("grade").value;
  const nom           = document.getElementById("nom").value;
  const aPoste        = document.getElementById("aPoste").value;
  const ensemble      = document.getElementById("ensemble").value;
  const pa            = document.getElementById("pa").value;
  const cp            = document.getElementById("cp").value;
  const humeur        = document.getElementById("humeur").value;
  const presence      = document.getElementById("presence").value;
  const communication = document.getElementById("communication").value;
  const comportement  = document.getElementById("comportement").value;
  const investissement= document.getElementById("investissement").value;
  const planning      = document.getElementById("planning").value;
  const epi           = document.getElementById("epi").value;
  const fma           = document.getElementById("fma").value;
  const formation     = document.getElementById("formation").value;
  const rappels       = document.getElementById("rappels").value;
  const sig_grade     = document.getElementById("sig_grade").value;
  const sig_pseudo    = document.getElementById("sig_pseudo").value;
  const sig_fonction  = document.getElementById("sig_fonction").value;
  const caserneBrute = document.getElementById("sig_caserne").value;
const sig_caserne = caserneBrute.split("|")[0];
const sig_sdis = caserneBrute.split("|")[1];

  if (!nom || !pa || !cp || !humeur) {
    alert("⚠️ Merci de remplir au moins le pseudo et les statistiques.");
    return;
  incrementerCompteur();
  }

  // Date automatique
  const maintenant = new Date();
  const moisNoms = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const moisTexte  = moisNoms[maintenant.getMonth()];
  const annee      = maintenant.getFullYear();
  const jour       = String(maintenant.getDate()).padStart(2, "0");
  const moisNum    = String(maintenant.getMonth() + 1).padStart(2, "0");
  const dateComplete = `${jour}/${moisNum}/${annee}`;
  const entete     = `[Avis ${moisTexte} ${annee}]`;
  const signature = `- Le ${dateComplete} - ${sig_grade} ${sig_pseudo}, ${sig_fonction}, ${sig_caserne}, SDIS ${sig_sdis}`;

  // Présence
 const article = (grade.startsWith("A") || grade.startsWith("O")) ? "L'" : "Le ";
const presenceTexte = {
  quotidienne:  `${article}${grade} ${nom} a une présence quotidienne au sein du CIS.`,
  reguliere:    `${article}${grade} ${nom} a une présence régulière au sein du CIS.`,
  irreguliere:  `${article}${grade} ${nom} présente une présence irrégulière au sein du CIS.`,
  insuffisante: `${article}${grade} ${nom} présente une présence insuffisante au sein du CIS.`,
}[presence];

  // Stats
  const statsNote = (pa == 100 && cp == 100 && humeur == 100) ? "excellentes" :
    (pa >= 75 && cp >= 75 && humeur >= 75) ? "bonnes" :
    (pa >= 50 && cp >= 50 && humeur >= 50) ? "correctes" : "insuffisantes";
  const statsTexte = `Les statistiques sont ${statsNote} avec une dépense de PA's à ${pa}%, une Condition Physique à ${cp}% et son Humeur à ${humeur}%.`;

  // Communication
  const commTexte = {
    excellente: "La communication est excellente que ce soit avec le personnel du CIS ou la hiérarchie.",
    tres_bonne: "La communication est très bonne que ce soit avec le personnel du CIS ou la hiérarchie.",
    bonne:      "La communication est bonne avec le personnel du CIS et la hiérarchie.",
    passable:   "La communication reste passable et doit être améliorée.",
    mauvaise:   "La communication est insuffisante et doit impérativement être améliorée.",
  }[communication];

  // Comportement + investissement
  const investMap = { excellent: "excellent", tres_bon: "très bon", bon: "bon", passable: "passable", mauvais: "mauvais" };
  const comportTexte = {
    exemplaire: `Comportement exemplaire au sein du CIS et un investissement ${investMap[investissement]} pour sa carrière ainsi qu'au sein du CIS.`,
    tres_bon:   `Très bon comportement au sein du CIS et un investissement ${investMap[investissement]} pour sa carrière ainsi qu'au sein du CIS.`,
    bon:        `Bon comportement au sein du CIS et un investissement ${investMap[investissement]}.`,
    passable:   "Le comportement est passable et doit être amélioré.",
    mauvais:    "Le comportement est mauvais et constitue un point de vigilance important.",
  }[comportement];

  // Obligations
  const planningTexte = planning === "oui"
    ? "Les plannings sont débloqués en temps et en heure."
    : "Les plannings ne sont pas débloqués dans les temps, ce point doit être corrigé.";

  const epiTexte = epi === "correct"
    ? "L'entretien ainsi que la demande des EPI sont corrects."
    : "L'entretien et/ou la demande des EPI sont incorrects, ce point doit être amélioré.";

  const fmaTexte = fma === "ajour"
    ? "Les FMA sont réalisées en temps et en heure."
    : "Les FMA ne sont pas à jour, ce point doit être régularisé rapidement.";

  const formationTexte = {
    excellent:   "Le bagage formatif est excellent.",
    atteint:     "Le bagage de formation est atteint pour son grade.",
    insuffisant: "Le bagage formatif est insuffisant et doit être complété.",
  }[formation];

  // Rappels
const rappelsTexte = {
  aucun:          "Pas de rappel ni avertissement ce mois-ci.",
  rappel_officiel:"Un rappel officiel a été émis ce mois-ci.",
  avert1:         "Un avertissement de niveau 1 a été émis ce mois-ci.",
  avert2:         "Un avertissement de niveau 2 a été émis ce mois-ci.",
  avert3:         "Un avertissement de niveau 3 a été émis ce mois-ci.",
  avert4:         "Un avertissement de niveau 4 a été émis ce mois-ci.",
}[rappels] || "Pas de rappel ni avertissement ce mois-ci.";

  // Conclusion
  const conclusionTexte = {
    excellent: "Excellent mois, continue ainsi.",
    bon:       "Bon mois, continue dans cette voie.",
    passable:  "Mois passable, des efforts sont attendus pour le mois prochain.",
    mauvais:   "Mauvais mois, une amélioration significative est attendue.",
  }[ensemble];

  // Poste
  let posteTexte = "";
  if (aPoste === "oui") {
    const poste  = document.getElementById("poste").value;
    const champs = champsParPoste[poste] || [];
    const parties = [];

    const ajouter = (id, map) => {
      if (!champs.includes(id)) return;
      const el = document.getElementById(id);
      if (el && map[el.value]) parties.push(map[el.value]);
    };

    ajouter("tenue_poste", {
      parfait:     "Le poste est parfaitement tenu et en autonomie.",
      bien:        "Le poste est bien tenu.",
      moyen:       "Le poste est tenu de manière passable, des améliorations sont attendues.",
      insuffisant: "Le poste est insuffisamment tenu, une remise en question est nécessaire.",
    });

    if (champs.includes("indispo_vehicule")) {
      const v = document.getElementById("indispo_vehicule").value;
      if (v !== "aucune") parties.push({
        oui_geree:     "Une indisponibilité de véhicule a été constatée ce mois-ci et a été gérée correctement.",
        oui_mal_geree: "Une indisponibilité de véhicule a été constatée ce mois-ci et n'a pas été correctement gérée.",
      }[v]);
    }

    ajouter("desinfection", {
      correcte:      "La désinfection du VSAV est effectuée correctement.",
      partielle:     "La désinfection du VSAV est partiellement effectuée.",
      non_effectuee: "La désinfection du VSAV n'est pas effectuée, ce point doit être corrigé.",
    });

    ajouter("controle_vestiaires", {
      regulier:  "Le contrôle des vestiaires est effectué régulièrement.",
      irregulier:"Le contrôle des vestiaires est irrégulier et doit être amélioré.",
      absent:    "Le contrôle des vestiaires n'est pas effectué, ce point doit être corrigé.",
    });

    ajouter("budget", {
      bien:   "Le budget est bien tenu et les demandes sont effectuées dans les délais.",
      moyen:  "La gestion du budget est passable et doit être améliorée.",
      mauvais:"La gestion du budget est insuffisante, ce point doit être corrigé rapidement.",
    });

    ajouter("surveillance_subordonnes", {
      bien:   "La surveillance des subordonnés est bonne et régulière.",
      moyen:  "La surveillance des subordonnés est passable.",
      mauvais:"La surveillance des subordonnés est insuffisante.",
    });

    ajouter("promotions_exclusions", {
      bien:   "Les promotions et demandes d'exclusion sont traitées dans les délais.",
      moyen:  "Les promotions et demandes d'exclusion sont partiellement traitées.",
      mauvais:"Les promotions et demandes d'exclusion ne sont pas traitées.",
    });

    ajouter("crss", {
      bien:   "La gestion des CRSS est bonne.",
      moyen:  "La gestion des CRSS est passable et doit être améliorée.",
      mauvais:"Les CRSS ne sont pas traités, ce point doit être corrigé rapidement.",
    });

    ajouter("avis_section", {
      bien:   "Les avis ont bien été rédigés et posés dans les dossiers.",
      moyen:  "Les avis ont été partiellement rédigés.",
      mauvais:"Les avis n'ont pas été rédigés, ce point doit être corrigé.",
    });

    ajouter("promotions_section", {
      bien:   "Les promotions ont bien été rédigées et transmises dans les délais.",
      moyen:  "Les promotions ont été partiellement rédigées.",
      mauvais:"Les promotions n'ont pas été rédigées.",
    });

    ajouter("plannings_section", {
      bien:   "Les plannings de section sont bien réalisés et libérés dans les temps.",
      moyen:  "Les plannings de section sont partiellement réalisés.",
      mauvais:"Les plannings de section ne sont pas réalisés.",
    });

    ajouter("traitement_formations", {
      bien:   "Les candidatures aux formations sont traitées correctement et dans les délais.",
      moyen:  "Les candidatures aux formations sont partiellement traitées.",
      mauvais:"Les candidatures aux formations ne sont pas traitées.",
    });

    ajouter("transmission_formations", {
      bien:   "Les informations de formation sont correctement transmises à la caserne.",
      moyen:  "Les transmissions de formations sont partielles.",
      mauvais:"Les transmissions de formations ne sont pas effectuées.",
    });

    ajouter("avis_responsables", {
      bien:   "Les avis des responsables ont été fournis dans les délais.",
      moyen:  "Les avis des responsables ont été partiellement fournis.",
      mauvais:"Les avis des responsables n'ont pas été fournis.",
    });

    ajouter("equilibrage_sections", {
      bien:   "L'équilibrage des sections est bon.",
      moyen:  "L'équilibrage des sections est passable et doit être amélioré.",
      mauvais:"L'équilibrage des sections est insuffisant.",
    });

    ajouter("repartition_taches", {
      equilibree:        "La répartition des tâches avec l'adjoint est équilibrée.",
      desavantage_lui:   "La répartition des tâches est déséquilibrée avec un désavantage pour lui.",
      desavantage_autre: "La répartition des tâches est déséquilibrée avec un désavantage pour l'autre.",
    });

    if (parties.length > 0) {
      posteTexte = "Au niveau de la gestion du poste : " + parties.join(" ");
    }
  }

  // Assemblage final
  let avis = `${entete}\n\n${presenceTexte} ${statsTexte} ${commTexte} ${comportTexte} ${planningTexte} ${epiTexte} ${formationTexte} ${fmaTexte}`;
  if (posteTexte) avis += ` ${posteTexte}`;
  avis += ` ${rappelsTexte} ${conclusionTexte}`;
  avis += `\n\n${signature}`;

  const resultat = document.getElementById("resultat");
  resultat.className = "formulaire-visible";
  resultat.innerHTML = `
    <h2>✅ Avis généré</h2>
    <div class="texte-genere">${avis}</div>
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
function resetFormulaire() {
  document.getElementById("grade").selectedIndex = 0;
  document.getElementById("nom").value = "";
  document.getElementById("aPoste").selectedIndex = 0;
  document.getElementById("blocPoste").className = "formulaire-cache";
  document.getElementById("ensemble").selectedIndex = 0;
  document.getElementById("pa").value = 100;
  document.getElementById("cp").value = 100;
  document.getElementById("humeur").value = 100;
  document.getElementById("presence").selectedIndex = 0;
  document.getElementById("communication").selectedIndex = 0;
  document.getElementById("comportement").selectedIndex = 0;
  document.getElementById("investissement").selectedIndex = 0;
  document.getElementById("planning").selectedIndex = 0;
  document.getElementById("epi").selectedIndex = 0;
  document.getElementById("fma").selectedIndex = 0;
  document.getElementById("formation").selectedIndex = 0;
  document.getElementById("rappels").selectedIndex = 0;
  document.getElementById("resultat").className = "formulaire-cache";
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
