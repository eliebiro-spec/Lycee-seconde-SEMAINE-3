/* Semaine 3 — Seconde : matières, modules, microcompétences.
 * Source pédagogique : exclusivement le brief de la semaine 3 (aucun contenu extérieur). */
R.data.defineWeek({
  key: 'seconde/semaine-03',
  level: 'seconde',
  levelLabel: 'Classe de Seconde',
  weekLabel: 'Semaine 3',
  title: 'Révisions',

  subjects: [
    { id: 'physique', label: 'Physique-Chimie', short: 'Physique-Chimie', icon: '🧪', color: 'var(--pc)' },
    { id: 'maths', label: 'Mathématiques', short: 'Maths', icon: '➗', color: 'var(--maths)' },
    { id: 'espagnol', label: 'Espagnol', short: 'Espagnol', icon: '🇪🇸', color: 'var(--espagnol)' },
    { id: 'anglais', label: 'Anglais Euro', short: 'Anglais Euro', icon: '🇬🇧', color: 'var(--anglais)' },
    { id: 'francais', label: 'Français', short: 'Français', icon: '📚', color: 'var(--francais)' },
  ],

  modules: [
    { id: 'PC01', subject: 'physique', label: 'Composition des mélanges' },
    { id: 'PC02', subject: 'physique', label: 'Changements d’état' },
    { id: 'M01', subject: 'maths', label: 'Pair / impair' },
    { id: 'M02', subject: 'maths', label: 'Multiples' },
    { id: 'M03', subject: 'maths', label: 'Diviseurs' },
    { id: 'M04', subject: 'maths', label: 'Démonstration et divisibilité' },
    { id: 'E01', subject: 'espagnol', label: 'SER / ESTAR' },
    { id: 'E02', subject: 'espagnol', label: 'Le sens change' },
    { id: 'A01', subject: 'anglais', label: 'Expression rapide' },
    { id: 'A02', subject: 'anglais', label: 'Reformulation' },
    { id: 'A03', subject: 'anglais', label: 'Speaking cards' },
    { id: 'F01', subject: 'francais', label: 'Paragraphe interprétatif' },
    { id: 'F02', subject: 'francais', label: 'Connecteurs' },
    { id: 'F03', subject: 'francais', label: 'Autoportrait poétique' },
    { id: 'F04', subject: 'francais', label: 'Le blason' },
  ],

  skills: [
    // Physique-Chimie
    { id: 'pc-total', subject: 'physique', module: 'PC01', label: 'Volume ou masse totale' },
    { id: 'pc-volumique', subject: 'physique', module: 'PC01', label: 'Composition volumique' },
    { id: 'pc-massique', subject: 'physique', module: 'PC01', label: 'Composition massique' },
    { id: 'pc-unites', subject: 'physique', module: 'PC01', label: 'Unités et grandeurs' },
    { id: 'pc-etats-noms', subject: 'physique', module: 'PC02', label: 'Nom des changements d’état' },
    { id: 'pc-etats-sens', subject: 'physique', module: 'PC02', label: 'Reconnaître le changement' },
    // Mathématiques
    { id: 'm-parite-def', subject: 'maths', module: 'M01', label: 'Écrire pair / impair' },
    { id: 'm-parite-somme', subject: 'maths', module: 'M01', label: 'Somme de pairs / impairs' },
    { id: 'm-parite-produit', subject: 'maths', module: 'M01', label: 'Produit de pairs / impairs' },
    { id: 'm-mult-ecriture', subject: 'maths', module: 'M02', label: 'Écrire des multiples consécutifs' },
    { id: 'm-mult-resolution', subject: 'maths', module: 'M02', label: 'Mettre en équation et résoudre' },
    { id: 'm-div-liste', subject: 'maths', module: 'M03', label: 'Trouver les diviseurs' },
    { id: 'm-contre-exemple', subject: 'maths', module: 'M03', label: 'Contre-exemple et exemples' },
    { id: 'm-divisibilite', subject: 'maths', module: 'M04', label: 'Sens de « divisible par »' },
    { id: 'm-demo-guidee', subject: 'maths', module: 'M04', label: 'Démonstration guidée' },
    { id: 'm-demo-sans-aide', subject: 'maths', module: 'M04', label: 'Démonstration sans aide' },
    // Espagnol
    { id: 'e-choix', subject: 'espagnol', module: 'E01', label: 'Choisir SER ou ESTAR' },
    { id: 'e-conjugaison', subject: 'espagnol', module: 'E01', label: 'Conjuguer SER et ESTAR' },
    { id: 'e-gerondif', subject: 'espagnol', module: 'E01', label: 'ESTAR + gérondif' },
    { id: 'e-sens', subject: 'espagnol', module: 'E02', label: 'Changement de sens' },
    // Anglais
    { id: 'a-expression', subject: 'anglais', module: 'A01', label: 'Expression rapide' },
    { id: 'a-reformulation', subject: 'anglais', module: 'A02', label: 'Reformuler en anglais' },
    { id: 'a-speaking', subject: 'anglais', module: 'A03', label: 'Parler 30 secondes' },
    // Français
    { id: 'f-structure', subject: 'francais', module: 'F01', label: 'Structure du paragraphe' },
    { id: 'f-analyse', subject: 'francais', module: 'F01', label: 'Affirmation, exemple, analyse' },
    { id: 'f-connecteurs', subject: 'francais', module: 'F02', label: 'Choisir le bon connecteur' },
    { id: 'f-autoportrait', subject: 'francais', module: 'F03', label: 'Formulation poétique' },
    { id: 'f-blason', subject: 'francais', module: 'F04', label: 'Définir le blason' },
  ],

  // Écran « Ce que j'ai travaillé » (informatif)
  worked: [
    { subject: 'physique', text: 'Composition des mélanges · Changements d’état' },
    { subject: 'maths', text: 'Pairs/impairs · Multiples · Diviseurs · Divisibilité · Démonstration' },
    { subject: 'espagnol', text: 'SER / ESTAR · Changements de sens' },
    { subject: 'anglais', text: 'Identity · Self-image · Oral interaction' },
    { subject: 'francais', text: 'Paragraphe interprétatif · Argumentation · Autoportrait poétique · Blason' },
  ],
});
