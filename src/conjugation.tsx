function findVoice(lang: String) {
	return speechSynthesis.getVoices().filter(v => v.lang == lang)[0]
}

export function speak(text: String) {
	let v = findVoice()

	let u = new SpeechSynthesisUtterance(text)
	speechSynthesis.speak(u)
}



export const TEMPS = [
	{mode: "indicatif",    temps: "présent"},
	{mode: "indicatif",    temps: "passé composé"},
	{mode: "indicatif",    temps: "imparfait"},
	{mode: "indicatif",    temps: "plus que parfait"},
	{mode: "indicatif",    temps: "futur simple"},
	{mode: "indicatif",    temps: "passé simple"},
	{mode: "indicatif",    temps: "futur antérieur"},
	{mode: "indicatif",    temps: "passé antérieur"},
	{mode: "conditionnel", temps: "présent"},
	{mode: "conditionnel", temps: "passé"},
	{mode: "subjonctif",   temps: "présent"},
	{mode: "subjonctif",   temps: "passé"},
	{mode: "subjonctif",   temps: "imparfait"},
	{mode: "subjonctif",   temps: "plus que parfait"},
	{mode: "imperatif",    temps: "présent"},
	{mode: "imperatif",    temps: "passé"},
	{mode: "participe",    temps: "présent"},
	{mode: "participe",    temps: "passé"},
]

// verbs by descending frequency
export const VERBES = ["être","avoir","faire","dire","aller","pouvoir","voir","savoir","vouloir","venir","prendre","devoir","falloir","passer","parler","mettre","regarder","demander","trouver","suivre","croire","donner","penser","laisser","aimer","rester","tenir","arriver","entendre","sentir","attendre","connaître","sortir","comprendre","sembler","devenir","ouvrir","revenir","partir","porter","rendre","répondre","appeler","arrêter","vivre","chercher","paraître","tomber","lever","commencer","finir","retrouver","poser","monter","entrer","asseoir","mourir","tirer","perdre","tourner","écrire","reprendre","jouer","jeter","marcher","lire","rire","quitter","écouter","descendre","essayer","retourner","pousser","oublier","apprendre","servir","continuer","manger","rentrer","montrer","boire","courir","sourire","raconter","dormir","garder","changer","imaginer","crier","expliquer","apercevoir","glisser","reconnaître","ajouter","recevoir","occuper","agir","tendre","souvenir","décider","offrir","serrer","compter","travailler","remettre","rappeler","traverser","répéter","découvrir","manquer","fermer","coucher","approcher","avancer","toucher","rencontrer","permettre","disparaître","battre","cacher","gagner","cesser","envoyer","valoir","importer","foutre","empêcher","tuer","frapper","lancer","rouler","pleurer","installer","remonter","suffire","apporter","apparaître","aider","ressembler","bouger","parvenir","pencher","oser","préparer","refuser","payer","acheter","exister","accepter","conduire","retenir","remarquer","fixer","couper","plaire","taire","revoir","mener","embrasser","saisir","présenter","espérer","rejoindre","sauter","annoncer","choisir","couvrir","préférer","éloigner","échapper","demeurer","abandonner","rêver","éprouver","tenter","atteindre","assurer","appuyer","chanter","réveiller","relever","accompagner","murmurer","traîner","hésiter","charger","réussir","emporter","couler","amuser","proposer","naître","souffrir","intéresser","surprendre","étonner","secouer","allumer","observer","baisser","arracher","soulever","mêler","habiter","deviner","entourer","étendre","éviter","former","séparer","ramener","ignorer","craindre","obliger","coller","poursuivre","prier","emmener","songer","enfoncer","brûler","élever","respirer","placer","durer","promettre","entraîner","marquer","éclater","terminer","accrocher","dresser","risquer","sauver","maintenir","retirer","adresser","promener","tromper","juger","avouer","diriger","engager","trembler","amener","casser","vendre","danser","sonner","appartenir","écarter","refermer","profiter","défendre","écraser","allonger","agiter","lâcher","réfléchir","hurler","voler","filer","douter","repartir","considérer","pénétrer","prêter","plonger","prononcer","éclairer","représenter","livrer","fumer","reposer","caresser","souffler","recommencer","disposer","inviter","posséder","souhaiter","jurer","crever","achever","remplir","briller","supporter","obtenir","commander","peindre","dessiner","partager","dépasser","enlever","imposer","prévoir","éteindre","fuir","croiser","planter","regretter","arranger","forcer","attirer","ramasser","claquer","distinguer","convenir","prévenir","évoquer","déclarer","endormir","surgir","interroger","exprimer","protéger","hausser","attacher","gêner","inquiéter","presser","peser","vider","attaquer","effacer","ressentir","causer","traiter","enfermer","inventer","confier","laver","recouvrir","reculer","produire","admirer","rassurer","chasser","ranger","taper","accorder","plaindre","balancer","saluer","prétendre","habiller","insister","téléphoner","précipiter","désigner","détacher","soupirer","avaler","marier","piquer","franchir","nourrir","contempler","renoncer","redresser","interrompre","creuser","flotter","vêtir","affirmer","repousser","étaler","remuer","déposer","détester","supposer","rapporter","nommer","assister","désirer","excuser","parcourir","briser","céder","soutenir","transformer","contenter","remplacer","révéler","exiger","dîner","admettre","étouffer","épouser","ennuyer","contenir","discuter","retomber","échanger","dégager","pendre","établir","envahir","constater","figurer","réunir","fournir","signer","attraper","éveiller","accomplir","conserver","essuyer","détourner","créer","accueillir","rapprocher","mériter","remercier","constituer","interdire","surveiller","efforcer","régler","indiquer","verser","confondre","subir","déchirer","rassembler","construire","rompre","menacer","prouver","détruire","résister","visiter","mentir","conclure","grimper","dissimuler","guetter","examiner","abattre","dominer","réduire","concerner","moquer","plier","frotter","incliner","regagner","emplir","réclamer","fatiguer","débarrasser","provoquer","lutter","libérer","mordre","préciser","coûter","appliquer","entreprendre","rejeter","composer","fabriquer","gonfler","réserver","régner","écrier","mesurer","signifier","fouiller","organiser","pleuvoir","déplacer","grandir","envelopper","entretenir","habituer","convaincre","employer","lier","opposer","obéir","cracher","calmer","inspirer","user","enfiler","reprocher","adorer","condamner","pardonner","noter","répandre","exercer","apprécier","baiser","déranger","raser","faillir","utiliser","blesser","jaillir","soigner","inscrire","priver","renvoyer","coiffer","tracer","rougir","percer","ôter","foncer","veiller","trahir","baigner","imiter","précéder","hocher","percevoir","transporter","refaire","sécher","vérifier","étirer","décrire","siffler","participer","accuser","goûter","dérouler","renverser","rattraper","suspendre","emparer","jouir","heurter","mouiller","noyer","protester","redouter","gratter","pointer","tordre","consacrer","exposer","fondre","satisfaire","manifester","troubler","situer","virer","exécuter","avertir","dévorer","estimer","tailler","enfuir","redevenir","soumettre","balayer","luire","émouvoir","commettre","craquer","résoudre","gémir","persuader","dépendre","combattre","consulter","approuver","écrouler","déjeuner","justifier","méfier","réaliser","haïr","ordonner","bondir","intervenir","apaiser","destiner","prolonger","conseiller","fonder","soupçonner","border","bousculer","consentir","supplier","tarder","chuchoter","débarquer","longer","traduire","cogner","repasser","publier","rigoler","animer","pourvoir","succéder","respecter","déboucher","aborder","consoler","figer","replier","épuiser","bouffer","embarquer","projeter","découper","joindre","défiler","envisager","marrer","nouer","barrer","défaire","vieillir","tremper","unir","résonner","récupérer","ressortir","déborder","grogner","recueillir","basculer","consister","clore","emprunter","délivrer","orner","repérer","ralentir","fréquenter","agacer","coincer","ricaner","comporter","introduire","crisper","décrocher","encombrer","étudier","déployer","guérir","immobiliser","émerger","adopter","effrayer","envoler","chauffer","acquérir","entrevoir","apprêter","louer","attarder","démarrer","ficher","soulager","entasser","aspirer","fasciner","absorber","enterrer","fendre","réciter","armer","redescendre","ronger","imprimer","nettoyer","surmonter","sursauter","procurer","ravir","concevoir","distraire","entamer","survivre","plaquer","confirmer","encourager","mépriser","viser","aviser","signaler","tâcher","voyager","plaisanter","bourrer","errer","gueuler","dérober","citer","emmerder","bouleverser","envier","enfouir","aligner","soucier","écouler","exciter","communiquer","pisser","débattre","loger","abriter","déshabiller","guider","raccrocher","revêtir","comparer","empoigner","épargner","procéder","aboutir","circuler","cueillir","relire","effondrer","glacer","effleurer","nager","témoigner","vaincre","réjouir","distribuer","frôler","semer","affecter","combler","retentir","suggérer","réfugier","réparer","accroupir","irriter","évanouir","contraindre","trancher","dévisager","féliciter","pratiquer","accumuler","bâtir","opérer","vibrer","venger","fonctionner","renifler","transmettre","lasser","encadrer","frémir","impressionner","renseigner","bavarder","brouiller","exploser","flatter","hâter","expédier","énerver","ménager","pincer","détendre","fourrer","nier","boucler","isoler","réagir","ébranler","agenouiller","calculer","susciter","vomir","vanter","tousser","bloquer","lécher","enseigner","déclencher","multiplier","doubler","dépêcher","mélanger","égarer","gronder","rater","acharner","chier","exagérer","souligner","affronter","enchanter","rechercher","hisser","rétablir","engloutir","refléter","séduire","réchauffer","rédiger","brandir","disputer","étrangler","fâcher","attribuer","pourrir","saigner","enchaîner","planquer","rabattre","abîmer","décevoir","informer","buter","tâter","feuilleter","développer","recommander","accabler","boucher","feindre","flanquer","préserver","cerner","contrôler","attendrir","augmenter","autoriser","débrouiller","ruer","émerveiller","coudre","revivre","déplaire","piétiner","échouer","affoler","dépouiller","relier","cuire","frissonner","résigner","cirer","élancer","décorer","sacrifier","punir","célébrer","rôder","illuminer","commenter","négliger","parfaire","arroser","décoller","intriguer","éblouir","courber","exaspérer","parer","peupler","contourner","dissiper","entrouvrir","raidir","grincer","correspondre","déplier","rouiller","clouer","ramper","renouveler","convoquer","sombrer","élargir","afficher","limiter","tasser","triompher","violer","masquer","pressentir","ruisseler","accourir","dénoncer","exclamer","bénir","concentrer","identifier","préoccuper","vouer","cligner","compliquer","disperser","modifier","contrer","puer","engouffrer","bâiller","gâcher","sucer","rouvrir","graver","insulter","fusiller","ronfler","contribuer","abaisser","bercer","garer","accélérer","applaudir","ressusciter","répliquer","renforcer","caler","accouder","imprégner","conquérir","agripper","dégoûter","passionner","désespérer","fouetter","faufiler","assommer","dater","indigner","émettre","gravir","intimider","subsister","geler","déguiser","étreindre","adosser","enrouler","esquisser","garantir","sacrer","dévaler","diviser","compromettre","planer","tapoter","fleurir","obstiner","plisser","tacher","garnir","proclamer","baptiser","diminuer","incarner","péter","reconstituer","tourmenter","exclure","manier","accentuer","agrandir","corriger","fêter","reproduire","salir","enlacer","froncer","gifler","questionner","épier","déchiffrer","empiler","maquiller","progresser","souiller","gésir","reparaître","chausser","dessécher","embêter","parier","stopper","bander","braquer","formuler","grouiller","interpeller","scruter","survenir","aveugler","décourager","choquer","dépenser","persister"]

const VERBE_GROUPES = {
	2: [4,5,6,8,9,12,14,22,33,36,40,45,49,64,66,67,78,81,83,99,112,115,126,130,157,161,200,218,224,258,287,301,339,435,495,502,528,537,541,572,583,768,787,826,831],
	3: [1,2,15,98,386,767],
}

export const VERBES_GROUPE_3 = VERBE_GROUPES[3].map(i => VERBES[i - 1])
export const VERBES_GROUPE_2 = VERBE_GROUPES[2].map(i => VERBES[i - 1])
export const VERBES_GROUPE_1 = VERBES.filter(v => VERBES_GROUPE_2.indexOf(v) < 0 && VERBES_GROUPE_3.indexOf(v) < 0)

export const VERBE_MENU = [
	{group: "Top 10", verbes: new Set(VERBES.slice(0, 10))},
	{group: "Top 100", verbes: new Set(VERBES.slice(0, 100))},
	{group: "1er groupe (-er)", verbes: new Set(VERBES_GROUPE_1)},
	{group: "2e groupe (-ir)", verbes: new Set(VERBES_GROUPE_2)},
	{group: "3e groupe (-ir, -re)", verbes: new Set(VERBES_GROUPE_3)},
]

for (let verbe of VERBES) {
	VERBE_MENU.push({infinitif: verbe})
}

import CONJUGASIONS from '../public/conjugasions.json'

export {CONJUGASIONS}

function randomItem(array) {
	return array[Math.floor(Math.random()*array.length)]
}

export function chooseRandom({personnes, temps, verbes}) {
	return {
		personne: randomItem(personnes),
		temps: randomItem(temps),
		verbe: randomItem(verbes),
	}
}

export function conjugate({personne, temps, verbe}) {
	let t = temps.temps.replaceAll(' ', '_')
	let conj = CONJUGASIONS[verbe]![temps.mode][t][personne]
	return conj
}

export const PERSONNES = [
	{personne: 1, plureil: false, pronom: "je"},
	{personne: 2, plureil: false, pronom: "tu"},
	{personne: 3, plureil: false, pronom: "il"},
	{personne: 3, plureil: false, pronom: "elle"},
	{personne: 3, plureil: false, pronom: "on"},
	{personne: 1, plureil: true,  pronom: "nous"},
	{personne: 2, plureil: true,  pronom: "vous"},
	{personne: 3, plureil: true,  pronom: "ils"},
	{personne: 3, plureil: true,  pronom: "elles"},
]