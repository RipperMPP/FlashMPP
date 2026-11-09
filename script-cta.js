// ── Réglages ─────────────────────────────────────────────────────────────────

const SEUIL_PRESENCE = 95; // % de présence attendu au CTA

const postesCTA = {
  chef_centre:         { label: "chef de centre",         tenue: true  },
  chef_centre_adjoint: { label: "chef de centre adjoint", tenue: true  },
  chef_salle:          { label: "chef de salle",          tenue: true  },
  operateur:           { label: "opérateur CTA",          tenue: false },
};

// ── Utilitaires ──────────────────────────────────────────────────────────────

function pl(n, mot) {
  return `${n} ${mot}${n > 1 ? "s" : ""}`;
}

function formaterTaux(t) {
  const r = Math.round(t * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(".", ",");
}

function calculerTaux(appels, erreurs) {
  if (!(appels > 0) || erreurs < 0 || erreurs > appels) return null;
  return ((appels - erreurs) / appels) * 100;
}

// ── Affichage dynamique ──────────────────────────────────────────────────────

function afficherChampPoste() {
  const poste = document.getElementById("poste").value;
  document.getElementById("bloc_tenue_poste").style.display =
    postesCTA[poste].tenue ? "" : "none";
}

function majTaux() {
  const appels  = parseInt(document.getElementById("appels").value, 10);
  const erreurs = parseInt(document.getElementById("erreurs").value, 10) || 0;
  const el      = document.getElementById("taux-preview");
  if (!(appels > 0)) { el.textContent = "—"; return; }
  const t = calculerTaux(appels, erreurs);
  el.textContent = t === null ? "Erreurs supérieures aux appels" : `${formaterTaux(t)} %`;
}

// ── Construction du texte (pure, testable) ───────────────────────────────────

function construireAvis(d) {
  const info    = postesCTA[d.poste];
  const article = (d.grade.startsWith("A") || d.grade.startsWith("O")) ? "L'" : "Le ";
  const intro   = `${article}${d.grade} ${d.nom}, ${info.label},`;
  const taux    = calculerTaux(d.appels, d.erreurs);
  const parties = [];

  // Garde + présence
  let activite = "";
  if (d.nbGarde > 0) {
    activite = d.typeGarde === "heures"
      ? `a effectué ${pl(d.nbGarde, "heure")} de garde CTA`
      : `a posé ${pl(d.nbGarde, "garde")} CTA`;
  }
  parties.push(activite
    ? `${intro} ${activite}, avec une présence assurée à ${d.presence} %.`
    : `${intro} affiche une présence de ${d.presence} %.`);

  // Appels
  if (taux !== null) {
    const debut      = activite ? "Durant cette période," : "Ce mois-ci,";
    const erreursTxt = d.erreurs === 0 ? "sans aucune erreur" : `pour ${pl(d.erreurs, "erreur")}`;
    parties.push(`${debut} ${d.nom} a traité ${pl(d.appels, "appel")} ${erreursTxt}, soit un taux de réussite de ${formaterTaux(taux)} %.`);
  }

  // Statistiques
  const valeurs = [d.dpa, d.cp, d.humeur];
  const tous    = seuil => valeurs.every(v => v >= seuil);
  const statsNote =
    tous(100) ? "excellentes" :
    tous(90)  ? "très bonnes" :
    tous(75)  ? "bonnes" :
    tous(50)  ? "correctes" : "insuffisantes";
  parties.push(`Ses statistiques sont ${statsNote}, avec ${formaterTaux(d.dpa)} % de DPA, ${d.cp} % de CP et ${d.humeur} % en humeur.`);

  // Obligations
  parties.push(d.fma === "ajour"
    ? "FMA à jour."
    : "FMA non à jour, ce point doit être régularisé rapidement.");

  parties.push(d.epi === "correct"
    ? "Les EPI sont complets."
    : "Les EPI sont incomplets ou mal entretenus, ce point doit être amélioré.");

  parties.push(d.planning === "oui"
    ? "Les plannings sont débloqués en temps et en heure."
    : "Les plannings ne sont pas débloqués dans les temps, ce point doit être corrigé.");

  // Poste
  if (info.tenue) parties.push({
    parfait:     "La gestion du poste est parfaite et en autonomie totale.",
    bien:        "Le poste est bien tenu.",
    moyen:       "Le poste est tenu de manière passable, des améliorations sont attendues.",
    insuffisant: "Le poste est insuffisamment tenu, une remise en question est nécessaire.",
  }[d.tenuePoste]);

  // Communication
  parties.push({
    excellente: "La communication générale est excellente.",
    tres_bonne: "La communication générale est très bonne.",
    bonne:      "La communication générale est bonne.",
    passable:   "La communication générale est passable et doit être améliorée.",
    mauvaise:   "La communication générale est insuffisante et doit impérativement être améliorée.",
  }[d.communication]);

  // Rappels
  parties.push({
    aucun:           `${d.nom} n'a fait l'objet d'aucun rappel ni avertissement ce mois-ci.`,
    rappel_officiel: "Un rappel officiel a été émis ce mois-ci.",
    avert1:          "Un avertissement de niveau 1 a été émis ce mois-ci.",
    avert2:          "Un avertissement de niveau 2 a été émis ce mois-ci.",
    avert3:          "Un avertissement de niveau 3 a été émis ce mois-ci.",
    avert4:          "Un avertissement de niveau 4 a été émis ce mois-ci.",
  }[d.rappels]);

  // Remarque libre
  if (d.remarque) parties.push(d.remarque);

  // Bilan
  const positif    = d.ensemble === "excellent" || d.ensemble === "bon";
  const presenceOk = d.presence >= SEUIL_PRESENCE;
  const bilanBase  = {
    excellent: "Très bon mois",
    bon:       "Bon mois",
    passable:  "Mois passable",
    mauvais:   "Mauvais mois",
  }[d.ensemble];

  const details = [];
  if (positif) {
    if (d.presence >= 98)        details.push("une excellente présence");
    else if (presenceOk)         details.push("une bonne présence");
    if (taux !== null) {
      if (taux >= 98)            details.push("un excellent taux de réussite");
      else if (taux >= 95)       details.push("un très bon taux de réussite");
      else if (taux >= 90)       details.push("un taux de réussite correct");
    }
  }

  let bilan = `${bilanBase} dans l'ensemble`;
  if (details.length) bilan += `, avec ${details.join(" et ")}`;
  bilan += ".";

  if (!presenceOk) {
    const prefixe = positif ? "Attention toutefois au" : "Attention au";
    const prep    = /^[aeiouéèêh]/i.test(info.label) ? "d'" : "de ";
    bilan += ` ${prefixe} taux de présence, qui reste inférieur aux ${SEUIL_PRESENCE} % attendus pour le poste ${prep}${info.label}.`;
  }

  bilan += " " + {
    excellent: presenceOk ? "Il faut continuer ainsi." : "Continuer ainsi tout en augmentant la présence.",
    bon:       presenceOk ? "Il faut continuer ainsi." : "Continuer ainsi tout en augmentant la présence.",
    passable:  "Des efforts sont attendus pour le mois prochain.",
    mauvais:   "Une amélioration significative est attendue.",
  }[d.ensemble];

  parties.push(bilan);
  return parties.join(" ");
}

// ── Génération ───────────────────────────────────────────────────────────────

function genererAvis() {
  const val = id => document.getElementById(id).value;

  const d = {
    grade:         val("grade"),
    nom:           val("nom").trim(),
    poste:         val("poste"),
    typeGarde:     val("type_garde"),
    nbGarde:       parseFloat(val("nb_garde")) || 0,
    presence:      parseFloat(val("presence")),
    appels:        parseInt(val("appels"), 10) || 0,
    erreurs:       parseInt(val("erreurs"), 10) || 0,
    dpa:           parseFloat(val("dpa")),
    cp:            parseFloat(val("cp")),
    humeur:        parseFloat(val("humeur")),
    tenuePoste:    val("tenue_poste"),
    fma:           val("fma"),
    epi:           val("epi"),
    planning:      val("planning"),
    communication: val("communication"),
    rappels:       val("rappels"),
    ensemble:      val("ensemble"),
    remarque:      val("remarque").trim(),
  };

  if (!d.nom || isNaN(d.presence) || isNaN(d.dpa) || isNaN(d.cp) || isNaN(d.humeur)) {
    afficherToast("⚠️ Pseudo, présence, DPA, CP et humeur sont requis.");
    return;
  }
  if (d.appels > 0 && d.erreurs > d.appels) {
    afficherToast("⚠️ Les erreurs dépassent le nombre d'appels traités.");
    return;
  }

  let avis = construireAvis(d);

  // En-tête et signature
  const sigGrade     = val("sig_grade");
  const sigPseudo    = val("sig_pseudo").trim();
  const sigFonction  = val("sig_fonction");
  const [sigCaserne, sigSdis] = val("sig_caserne").split("|");

  const maintenant = new Date();
  const moisNoms = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const jour    = String(maintenant.getDate()).padStart(2, "0");
  const moisNum = String(maintenant.getMonth() + 1).padStart(2, "0");
  const annee   = maintenant.getFullYear();

  if (document.getElementById("opt_entete").checked) {
    avis = `[Avis CTA ${moisNoms[maintenant.getMonth()]} ${annee}]\n\n${avis}`;
  }
  if (document.getElementById("opt_signature").checked) {
    const identite = [`${sigGrade} ${sigPseudo}`, sigFonction, sigCaserne, sigSdis ? `SDIS ${sigSdis}` : ""]
      .filter(Boolean).join(", ");
    avis += `\n\n- Le ${jour}/${moisNum}/${annee} - ${identite}`;
  }

  const resultat = document.getElementById("resultat");
  resultat.className = "formulaire-visible";
  resultat.innerHTML = `
    <h2>✅ Avis généré</h2>
    <div class="texte-genere"></div>
    <button class="btn-copier" onclick="copierTexte()">📋 Copier le texte</button>
  `;
  resultat.querySelector(".texte-genere").textContent = avis;
  resultat.scrollIntoView({ behavior: "smooth" });

  incrementerCompteur();
}

// ── Copie / toast ────────────────────────────────────────────────────────────

function copierTexte() {
  const texte = document.querySelector(".texte-genere").innerText;
  navigator.clipboard.writeText(texte).then(() => afficherToast("✅ Texte copié !"));
}

function afficherToast(msg) {
  const t = document.getElementById("toast-copie");
  t.textContent = msg;
  t.classList.add("visible");
  setTimeout(() => t.classList.remove("visible"), 2000);
}

// ── Reset ────────────────────────────────────────────────────────────────────

function resetFormulaire() {
  const idx0 = ["grade", "poste", "type_garde", "tenue_poste", "fma", "epi", "planning", "communication", "rappels", "ensemble"];
  idx0.forEach(id => { document.getElementById(id).selectedIndex = 0; });

  document.getElementById("nom").value       = "";
  document.getElementById("nb_garde").value  = "";
  document.getElementById("presence").value  = 100;
  document.getElementById("appels").value    = "";
  document.getElementById("erreurs").value   = 0;
  document.getElementById("dpa").value       = 100;
  document.getElementById("cp").value        = 100;
  document.getElementById("humeur").value    = 100;
  document.getElementById("remarque").value  = "";
  document.getElementById("opt_entete").checked    = false;
  document.getElementById("opt_signature").checked = false;
  document.getElementById("resultat").className = "formulaire-cache";

  afficherChampPoste();
  majTaux();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Compteur Firebase ────────────────────────────────────────────────────────

function incrementerCompteur() {
  const url = "https://flashmpp-default-rtdb.europe-west1.firebasedatabase.app/compteur/avis.json";
  fetch(url).then(r => r.json()).then(val => {
    fetch(url, { method: "PUT", body: JSON.stringify((val || 0) + 1) });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  afficherChampPoste();
  majTaux();
});