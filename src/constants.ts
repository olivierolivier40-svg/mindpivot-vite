import type { Ritual, Program, Badge, BadgeId } from './types.ts';

export const SOUND_OPTIONS: Record<'bol' | 'diapason' | 'gong' | 'none', { url: string }> = {
    bol: { url: 'https://www.magnetiseur-dax.fr/webapp/Bol.mp3' },
    diapason: { url: 'https://www.magnetiseur-dax.fr/webapp/Diapason.mp3' },
    gong: { url: 'https://www.magnetiseur-dax.fr/webapp/Gong.mp3' },
    none: { url: '' },
};

export const LABELS = {
    energie: ['label_energie_0', 'label_energie_1', 'label_energie_2', 'label_energie_3', 'label_energie_4'],
    humeur: ['label_humeur_0', 'label_humeur_1', 'label_humeur_2', 'label_humeur_3', 'label_humeur_4'],
    chargeMentale: ['label_chargeMentale_4', 'label_chargeMentale_3', 'label_chargeMentale_2', 'label_chargeMentale_1', 'label_chargeMentale_0'],
    tensionCorporelle: ['label_tensionCorporelle_4', 'label_tensionCorporelle_3', 'label_tensionCorporelle_2', 'label_tensionCorporelle_1', 'label_tensionCorporelle_0'],
    fatiguePhysique: ['label_fatiguePhysique_4', 'label_fatiguePhysique_3', 'label_fatiguePhysique_2', 'label_fatiguePhysique_1', 'label_fatiguePhysique_0'],
    agitation: ['label_agitation_4', 'label_agitation_3', 'label_agitation_2', 'label_agitation_1', 'label_agitation_0'],
    joie: ['label_joie_0', 'label_joie_1', 'label_joie_2', 'label_joie_3', 'label_joie_4'],
    tristesse: ['label_tristesse_4', 'label_tristesse_3', 'label_tristesse_2', 'label_tristesse_1', 'label_tristesse_0'],
    colere: ['label_colere_4', 'label_colere_3', 'label_colere_2', 'label_colere_1', 'label_colere_0'],
    peur: ['label_peur_4', 'label_peur_3', 'label_peur_2', 'label_peur_1', 'label_peur_0'],
    sensibilite: ['label_sensibilite_4', 'label_sensibilite_3', 'label_sensibilite_2', 'label_sensibilite_1', 'label_sensibilite_0'],
    clarteMentale: ['label_clarteMentale_0', 'label_clarteMentale_1', 'label_clarteMentale_2', 'label_clarteMentale_3', 'label_clarteMentale_4'],
    rumination: ['label_rumination_4', 'label_rumination_3', 'label_rumination_2', 'label_rumination_1', 'label_rumination_0'],
    orientationTemporelle: ['label_orientationTemporelle_0', 'label_orientationTemporelle_1', 'label_orientationTemporelle_2', 'label_orientationTemporelle_3', 'label_orientationTemporelle_4'],
    qualitePensees: ['label_qualitePensees_0', 'label_qualitePensees_1', 'label_qualitePensees_2', 'label_qualitePensees_3', 'label_qualitePensees_4'],
    vitesseMentale: ['label_vitesseMentale_4', 'label_vitesseMentale_3', 'label_vitesseMentale_2', 'label_vitesseMentale_1', 'label_vitesseMentale_0'],
    sentimentControle: ['label_sentimentControle_0', 'label_sentimentControle_1', 'label_sentimentControle_2', 'label_sentimentControle_3', 'label_sentimentControle_4'],
};

export const HELP_CONTENT = {
    energie: { title: 'help_energie_title', text: 'help_energie_text' },
    humeur: { title: 'help_humeur_title', text: 'help_humeur_text' },
    chargeMentale: { title: 'help_chargeMentale_title', text: 'help_chargeMentale_text' },
    tensionCorporelle: { title: 'help_tensionCorporelle_title', text: 'help_tensionCorporelle_text' },
    fatiguePhysique: { title: 'help_fatiguePhysique_title', text: 'help_fatiguePhysique_text' },
    agitation: { title: 'help_agitation_title', text: 'help_agitation_text' },
    joie: { title: 'help_joie_title', text: 'help_joie_text' },
    tristesse: { title: 'help_tristesse_title', text: 'help_tristesse_text' },
    colere: { title: 'help_colere_title', text: 'help_colere_text' },
    peur: { title: 'help_peur_title', text: 'help_peur_text' },
    sensibilite: { title: 'help_sensibilite_title', text: 'help_sensibilite_text' },
    clarteMentale: { title: 'help_clarteMentale_title', text: 'help_clarteMentale_text' },
    rumination: { title: 'help_rumination_title', text: 'help_rumination_text' },
    orientationTemporelle: { title: 'help_orientationTemporelle_title', text: 'help_orientationTemporelle_text' },
    qualitePensees: { title: 'help_qualitePensees_title', text: 'help_qualitePensees_text' },
    vitesseMentale: { title: 'help_vitesseMentale_title', text: 'help_vitesseMentale_text' },
    sentimentControle: { title: 'help_sentimentControle_title', text: 'help_sentimentControle_text' },
};

export const BADGE_CATEGORIES = {
    premiers_pas: 'badge_category_premiers_pas',
    constance: 'badge_category_constance',
    exploration: 'badge_category_exploration',
    maitrise: 'badge_category_maitrise',
    secrets: 'badge_category_secrets',
};

export const BADGES: Record<BadgeId, Badge> = {
    PREMIER_RITUEL: { name: 'badge_PREMIER_RITUEL_name', icon: '🌱', category: 'premiers_pas', description: 'badge_PREMIER_RITUEL_description', hint: 'badge_PREMIER_RITUEL_hint' },
    TROIS_JOURS_SUITE: { name: 'badge_TROIS_JOURS_SUITE_name', icon: '🔥', category: 'constance', description: 'badge_TROIS_JOURS_SUITE_description', hint: 'badge_TROIS_JOURS_SUITE_hint' },
    SEPT_JOURS_SUITE: { name: 'badge_SEPT_JOURS_SUITE_name', icon: '📅', category: 'constance', description: 'badge_SEPT_JOURS_SUITE_description', hint: 'badge_SEPT_JOURS_SUITE_hint' },
    TRENTE_JOURS_SUITE: { name: 'badge_TRENTE_JOURS_SUITE_name', icon: '🚀', category: 'constance', description: 'badge_TRENTE_JOURS_SUITE_description', hint: 'badge_TRENTE_JOURS_SUITE_hint' },
    DIX_ENTREES_JOURNAL: { name: 'badge_DIX_ENTREES_JOURNAL_name', icon: '✍️', category: 'exploration', description: 'badge_DIX_ENTREES_JOURNAL_description', hint: 'badge_DIX_ENTREES_JOURNAL_hint' },
    TROIS_CATEGORIES: { name: 'badge_TROIS_CATEGORIES_name', icon: '🎨', category: 'exploration', description: 'badge_TROIS_CATEGORIES_description', hint: 'badge_TROIS_CATEGORIES_hint' },
    DIX_RITUELS_DIFFERENTS: { name: 'badge_DIX_RITUELS_DIFFERENTS_name', icon: '🔍', category: 'exploration', description: 'badge_DIX_RITUELS_DIFFERENTS_description', hint: 'badge_DIX_RITUELS_DIFFERENTS_hint' },
    CENT_SESSIONS: { name: 'badge_CENT_SESSIONS_name', icon: '💯', category: 'maitrise', description: 'badge_CENT_SESSIONS_description', hint: 'badge_CENT_SESSIONS_hint' },
    RITUEL_AVANT_8H: { name: 'badge_RITUEL_AVANT_8H_name', icon: '🌅', category: 'secrets', description: 'badge_RITUEL_AVANT_8H_description', hint: 'badge_RITUEL_AVANT_8H_hint' },
    RITUEL_APRES_22H: { name: 'badge_RITUEL_APRES_22H_name', icon: '🦉', category: 'secrets', description: 'badge_RITUEL_APRES_22H_description', hint: 'badge_RITUEL_APRES_22H_hint' },
    PARCOURS_TERMINE: { name: 'badge_PARCOURS_TERMINE_name', icon: '🏔️', category: 'maitrise', description: 'badge_PARCOURS_TERMINE_description', hint: 'badge_PARCOURS_TERMINE_hint' },
};

export const PROGRAMS: Program[] = [
    {
        id: 'prog_anti_stress_7j',
        title: 'program_anti_stress_7j_title',
        icon: '🧘',
        durationDays: 7,
        description: 'program_anti_stress_7j_description',
        isPremium: false,
        ritualIds: ['rit.soupir_physio_120', 'rit.equilibre_5_5', 'rit.body_scan_180', 'rit.scan_54321', 'rit.eft_mini', 'rit.automassage_cervical', 'rit.pluie_interieure'],
        details: { objective: 'program_anti_stress_7j_details_objective', mechanism: 'program_anti_stress_7j_details_mechanism', benefits: 'program_anti_stress_7j_details_benefits' }
    },
    {
        id: 'prog_focus_performance_5j',
        title: 'program_focus_performance_5j_title',
        icon: '🎯',
        durationDays: 5,
        description: 'program_focus_performance_5j_description',
        isPremium: true,
        ritualIds: ['rit.trataka', 'rit.regard_infini', 'rit.box_4_4_4_4', 'rit.synchro_gamma', 'rit.nadi_shodhana_120'],
        details: { objective: 'program_focus_performance_5j_details_objective', mechanism: 'program_focus_performance_5j_details_mechanism', benefits: 'program_focus_performance_5j_details_benefits' }
    },
    {
        id: 'prog_liberation_emotionnelle_5j',
        title: 'program_liberation_emotionnelle_5j_title',
        icon: '🌊',
        durationDays: 5,
        description: 'program_liberation_emotionnelle_5j_description',
        isPremium: true,
        ritualIds: ['rit.fureur_tigre', 'rit.recyclage_emotionnel', 'rit.butterfly_hug', 'rit.etreinte_ombre', 'rit.vibration_tellurique'],
        details: { objective: 'program_liberation_emotionnelle_5j_details_objective', mechanism: 'program_liberation_emotionnelle_5j_details_mechanism', benefits: 'program_liberation_emotionnelle_5j_details_benefits' }
    },
    {
        id: 'prog_sommeil_serein_5j',
        title: 'program_sommeil_serein_5j_title',
        icon: '🌙',
        durationDays: 5,
        description: 'program_sommeil_serein_5j_description',
        isPremium: true,
        ritualIds: ['rit.calme_4_7_8', 'rit.vagale_dorsal', 'rit.priere_du_soir', 'rit.masque_tombe', 'rit.body_scan_180'],
        details: { objective: 'program_sommeil_serein_5j_details_objective', mechanism: 'program_sommeil_serein_5j_details_mechanism', benefits: 'program_sommeil_serein_5j_details_benefits' }
    },
    {
        id: 'prog_ancrage_stabilite_3j',
        title: 'program_ancrage_stabilite_3j_title',
        icon: '🌳',
        durationDays: 3,
        description: 'program_ancrage_stabilite_3j_description',
        isPremium: false,
        ritualIds: ['rit.scan_54321', 'rit.arbre_tempete', 'rit.porte_interieure'],
        details: { objective: 'program_ancrage_stabilite_3j_details_objective', mechanism: 'program_ancrage_stabilite_3j_details_mechanism', benefits: 'program_ancrage_stabilite_3j_details_benefits' }
    },
    {
        id: 'prog_confiance_energie_5j',
        title: 'program_confiance_energie_5j_title',
        icon: '⚡',
        durationDays: 5,
        description: 'program_confiance_energie_5j_description',
        isPremium: true,
        ritualIds: ['rit.power_posing', 'rit.bascule_vibratoire', 'rit.souffle_dragon', 'rit.salut_quantique', 'rit.activation_grace'],
        details: { objective: 'program_confiance_energie_5j_details_objective', mechanism: 'program_confiance_energie_5j_details_mechanism', benefits: 'program_confiance_energie_5j_details_benefits' }
    },
    {
        id: 'prog_sagesse_interieure_7j',
        title: 'program_sagesse_interieure_7j_title',
        icon: '📜',
        durationDays: 7,
        description: 'program_sagesse_interieure_7j_description',
        isPremium: true,
        ritualIds: ['rit.sagesse_tolteque', 'rit.sagesse_minute', 'rit.gratitude_90', 'rit.sourire_organes', 'rit.intention_glissante', 'rit.balancier_neutre', 'rit.connexion_holofractographique'],
        details: { objective: 'program_sagesse_interieure_7j_details_objective', mechanism: 'program_sagesse_interieure_7j_details_mechanism', benefits: 'program_sagesse_interieure_7j_details_benefits' }
    }
];

export const MORNING_INTENTIONS = [
    'morning_intention_1', 'morning_intention_2', 'morning_intention_3', 'morning_intention_4', 'morning_intention_5',
    'morning_intention_6', 'morning_intention_7', 'morning_intention_8', 'morning_intention_9', 'morning_intention_10',
    'morning_intention_11', 'morning_intention_12', 'morning_intention_13', 'morning_intention_14', 'morning_intention_15',
    'morning_intention_16', 'morning_intention_17', 'morning_intention_18', 'morning_intention_19', 'morning_intention_20',
    'morning_intention_21', 'morning_intention_22', 'morning_intention_23', 'morning_intention_24', 'morning_intention_25',
    'morning_intention_26', 'morning_intention_27', 'morning_intention_28', 'morning_intention_29', 'morning_intention_30',
    'morning_intention_31', 'morning_intention_32', 'morning_intention_33'
];

export const CITATIONS = [
    { q: "Le seul moment où l'on peut agir, c'est maintenant.", a: "Eckhart Tolle" },
    { q: "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur.", a: "Bouddha" },
    { q: "Ce que tu penses, tu le deviens. Ce que tu ressens, tu l'attires. Ce que tu imagines, tu le crées.", a: "Bouddha" },
    { q: "Au milieu de l'hiver, j'ai découvert en moi un invincible été.", a: "Albert Camus" },
    { q: "La meilleure façon de prédire l'avenir est de le créer.", a: "Peter Drucker" },
    { q: "La vie n'est pas d'attendre que les orages passent, c'est d'apprendre à danser sous la pluie.", a: "Sénèque" },
    { q: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.", a: "Dalaï Lama" },
    { q: "Ne laisse pas le bruit des opinions des autres étouffer ta voix intérieure.", a: "Steve Jobs" },
    { q: "On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.", a: "Antoine de Saint-Exupéry" },
    { q: "Tout voyage de mille lieues commence par un premier pas.", a: "Lao Tseu" }
];

export const BENTO_MANTRAS = {
  "classique": {
    "name": "bento_mantra_classic",
    "short": {
      "inhale": "bento_mantra_classic_short_inhale",
      "exhale": "bento_mantra_classic_short_exhale"
    },
    "long": {
      "inhale": "bento_mantra_classic_long_inhale",
      "exhale": "bento_mantra_classic_long_exhale"
    }
  },
  "confiance": {
    "name": "bento_mantra_confidence",
    "short": {
      "inhale": "bento_mantra_confidence_short_inhale",
      "exhale": "bento_mantra_confidence_short_exhale"
    },
    "long": {
      "inhale": "bento_mantra_confidence_long_inhale",
      "exhale": "bento_mantra_confidence_long_exhale"
    }
  },
  "réussite": {
    "name": "bento_mantra_success",
    "short": {
      "inhale": "bento_mantra_success_short_inhale",
      "exhale": "bento_mantra_success_short_exhale"
    },
    "long": {
      "inhale": "bento_mantra_success_long_inhale",
      "exhale": "bento_mantra_success_long_exhale"
    }
  },
  "apaisement": {
    "name": "bento_mantra_calm",
    "short": {
      "inhale": "bento_mantra_calm_short_inhale",
      "exhale": "bento_mantra_calm_short_exhale"
    },
    "long": {
      "inhale": "bento_mantra_calm_long_inhale",
      "exhale": "bento_mantra_calm_long_exhale"
    }
  },
  "ancrage": {
    "name": "bento_mantra_grounding",
    "short": {
      "inhale": "bento_mantra_grounding_short_inhale",
      "exhale": "bento_mantra_grounding_short_exhale"
    },
    "long": {
      "inhale": "bento_mantra_grounding_long_inhale",
      "exhale": "bento_mantra_grounding_long_exhale"
    }
  },
  "gratitude": {
    "name": "bento_mantra_gratitude",
    "short": {
      "inhale": "bento_mantra_gratitude_short_inhale",
      "exhale": "bento_mantra_gratitude_short_exhale"
    },
    "long": {
      "inhale": "bento_mantra_gratitude_long_inhale",
      "exhale": "bento_mantra_gratitude_long_exhale"
    }
  },
  "sommeil": {
    "name": "bento_mantra_sleep",
    "short": {
      "inhale": "bento_mantra_sleep_short_inhale",
      "exhale": "bento_mantra_sleep_short_exhale"
    },
    "long": {
      "inhale": "bento_mantra_sleep_long_inhale",
      "exhale": "bento_mantra_sleep_long_exhale"
    }
  }
};

export const ORGANES = [
    { name: 'organ_heart', icon: '❤️' },
    { name: 'organ_lungs', icon: '🫁' },
    { name: 'organ_liver', icon: '🍃' },
    { name: 'organ_kidneys', icon: '💧' },
    { name: 'organ_spleen', icon: '☀️' }
];

export const RITUAL_INSTRUCTIONS: Record<string, {time: number, text: string}[]> = {
    'rit.gratitude_90': [
        { time: 0, text: 'ritual_instruct_gratitude_90_1' },
        { time: 30, text: 'ritual_instruct_gratitude_90_2' },
        { time: 60, text: 'ritual_instruct_gratitude_90_3' }
    ]
};

export const RITUELS: Ritual[] = [
    // --- NEURO --- (Strict order N1 to N28)
    {
        id: 'rit.sprint_concentration',
        label: 'ritual_sprint_concentration_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['focus', 'procrastination', 'mindset', 'productivité'],
        isPremium: false,
        options: { extend5min: true, id5min: 'rit.sprint_concentration_5m' },
        data: {
          phases: [
            { type: 'texte', instruction: 'ritual_sprint_concentration_phase_1', duration: 20 },
            { type: 'fixation', instruction: 'ritual_sprint_concentration_phase_2', duration: 100 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sprint_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sprint_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sprint_es.wav',
        },
        modal: {
            titre: 'ritual_sprint_concentration_modal_title',
            icon: '🎯',
            sections: {
                pourquoi: 'ritual_sprint_concentration_modal_why',
                comment: 'ritual_sprint_concentration_modal_how',
                conseils: 'ritual_sprint_concentration_modal_tips',
                enSavoirPlus: 'ritual_sprint_concentration_modal_learn_more',
                pourAllerPlusLoin: 'ritual_sprint_concentration_modal_go_further'
            }
        }
    },
    {
        id: 'rit.frequences_sacrees',
        label: 'ritual_frequences_sacrees_label',
        category: 'neuro',
        playerType: 'frequency-healing',
        dureeSec: 60,
        donut: 'off',
        haptique: {},
        tags: ['son', 'vibration', 'apaiser', 'spiritualité', 'récupération'],
        isPremium: true,
        data: {
            frequencies: [
                { hz: 396, label: 'ritual_freq_396_label', desc: 'ritual_freq_396_desc' },
                { hz: 417, label: 'ritual_freq_417_label', desc: 'ritual_freq_417_desc' },
                { hz: 528, label: 'ritual_freq_528_label', desc: 'ritual_freq_528_desc' },
                { hz: 639, label: 'ritual_freq_639_label', desc: 'ritual_freq_639_desc' },
                { hz: 741, label: 'ritual_freq_741_label', desc: 'ritual_freq_741_desc' },
                { hz: 852, label: 'ritual_freq_852_label', desc: 'ritual_freq_852_desc' },
                { hz: 963, label: 'ritual_freq_963_label', desc: 'ritual_freq_963_desc' }
            ]
        },
        modal: {
            titre: 'ritual_frequences_sacrees_modal_title',
            icon: '🔊',
            sections: {
                pourquoi: 'ritual_frequences_sacrees_modal_why',
                comment: 'ritual_frequences_sacrees_modal_how',
                conseils: 'ritual_frequences_sacrees_modal_tips',
                enSavoirPlus: 'ritual_frequences_sacrees_modal_learn_more',
                pourAllerPlusLoin: 'ritual_frequences_sacrees_modal_go_further'
            }
        }
    },
    {
        id: 'rit.acupression_calme',
        label: 'ritual_acupression_calme_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['apaiser', 'stress', 'douleur', 'acupression', 'somatique'],
        isPremium: true,
        data: {
          phases: [
            {
              type: 'image',
              name: 'ritual_acupression_calme_phase_1_name',
              instruction: 'ritual_acupression_calme_phase_1_instruction',
              duration: 60,
              imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/Laogong.png',
            },
            {
              type: 'image',
              name: 'ritual_acupression_calme_phase_2_name',
              instruction: 'ritual_acupression_calme_phase_2_instruction',
              duration: 60,
              imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/Hegu.png',
            },
          ],
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/acupression_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/acupression_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/acupression_es.wav',
        },
        modal: {
          titre: 'ritual_acupression_calme_modal_title',
          icon: '🙌',
          sections: {
            pourquoi: 'ritual_acupression_calme_modal_why',
            comment: 'ritual_acupression_calme_modal_how',
            conseils: 'ritual_acupression_calme_modal_tips',
            enSavoirPlus: 'ritual_acupression_calme_modal_learn_more',
            pourAllerPlusLoin: 'ritual_acupression_calme_modal_go_further'
          },
        },
    },
    {
        id: 'rit.antidote_kinesique',
        label: 'ritual_antidote_kinesique_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 105,
        donut: 'off',
        haptique: {},
        tags: ['stress', 'émotions', 'lacher-prise', 'neuro', 'anxiete'],
        isPremium: true,
        data: {
            phases: [
                { type: 'texte', name: 'ritual_antidote_kinesique_phase_1_name', instruction: 'ritual_antidote_kinesique_phase_1_instruction', duration: 10 },
                { type: 'image', name: 'ritual_antidote_kinesique_phase_2_new_name', instruction: 'ritual_antidote_kinesique_phase_2_new_instruction', duration: 15, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/K27.jpg' },
                { type: 'animation', name: 'ritual_antidote_kinesique_phase_2_name', instruction: 'ritual_antidote_kinesique_phase_2_instruction', duration: 30 },
                { type: 'animation', name: 'ritual_antidote_kinesique_phase_3_name', instruction: 'ritual_antidote_kinesique_phase_3_instruction', duration: 20 },
                { type: 'texte', name: 'ritual_antidote_kinesique_phase_4_name', instruction: 'ritual_antidote_kinesique_phase_4_instruction', duration: 20 },
                { type: 'texte', name: 'ritual_antidote_kinesique_phase_5_name', instruction: 'ritual_antidote_kinesique_phase_5_instruction', duration: 10 },
            ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/antidote_kinesique_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/antidote_kinesique_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/antidote_kinesique_es.wav',
        },
        modal: {
            titre: 'ritual_antidote_kinesique_modal_title',
            icon: '🧠',
            sections: {
                pourquoi: 'ritual_antidote_kinesique_modal_why',
                comment: 'ritual_antidote_kinesique_modal_how',
                conseils: 'ritual_antidote_kinesique_modal_tips',
                enSavoirPlus: 'ritual_antidote_kinesique_modal_learn_more',
                pourAllerPlusLoin: 'ritual_antidote_kinesique_modal_go_further',
            },
        },
    },
    {
        id: 'rit.arbre_tempete',
        label: 'ritual_arbre_tempete_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['ancrage', 'stress', 'confiance', 'resilience', 'somatique'],
        isPremium: false,
        data: {
            phases: [
                { type: 'image', name: 'ritual_arbre_tempete_phase_1_name', instruction: 'ritual_arbre_tempete_phase_1_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/racines.png' },
                { type: 'video', name: 'ritual_arbre_tempete_phase_2_name', instruction: 'ritual_arbre_tempete_phase_2_instruction', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/arbre_tempete.mp4' },
                { type: 'image', name: 'ritual_arbre_tempete_phase_3_name', instruction: 'ritual_arbre_tempete_phase_3_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/stable.png' },
            ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/arbre_tempete_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/arbre_tempete_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/arbre_tempete_es.wav',
        },
        modal: {
            titre: 'ritual_arbre_tempete_modal_title',
            icon: '🌳',
            sections: {
                pourquoi: 'ritual_arbre_tempete_modal_why',
                comment: 'ritual_arbre_tempete_modal_how',
                conseils: 'ritual_arbre_tempete_modal_tips',
                enSavoirPlus: 'ritual_arbre_tempete_modal_learn_more',
                pourAllerPlusLoin: 'ritual_arbre_tempete_modal_go_further'
            },
        },
    },
    {
        id: 'rit.automassage_cervical',
        label: 'ritual_automassage_cervical_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['détente', 'douleur', 'somatique', 'récupération'],
        isPremium: false,
        data: {
          phases: [
            { type: 'image', name: 'ritual_automassage_cervical_phase_1a_name', instruction: 'ritual_automassage_cervical_phase_1_instruction', duration: 10, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/gd1.png' },
            { type: 'image', name: 'ritual_automassage_cervical_phase_1a_name', instruction: 'ritual_automassage_cervical_phase_1_instruction', duration: 10, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/gd.png' },
            { type: 'image', name: 'ritual_automassage_cervical_phase_2a_name', instruction: 'ritual_automassage_cervical_phase_2_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/epauled.png' },
            { type: 'image', name: 'ritual_automassage_cervical_phase_2b_name', instruction: 'ritual_automassage_cervical_phase_2b_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/epaule.png' },
            { type: 'image', name: 'ritual_automassage_cervical_phase_3_name', instruction: 'ritual_automassage_cervical_phase_3_instruction', duration: 20, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/dos2.png' },
            { type: 'image', name: 'ritual_automassage_cervical_phase_4_name', instruction: 'ritual_automassage_cervical_phase_4_instruction', duration: 20, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/dos.png' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/automassage_cervicale_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/automassage_cervicale_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/automassage_cervicale_es.wav',
        },
        modal: {
          titre: 'ritual_automassage_cervical_modal_title',
          icon: '💆',
          sections: {
            pourquoi: 'ritual_automassage_cervical_modal_why',
            comment: 'ritual_automassage_cervical_modal_how',
            conseils: 'ritual_automassage_cervical_modal_tips',
            enSavoirPlus: 'ritual_automassage_cervical_modal_learn_more_extra',
            pourAllerPlusLoin: 'ritual_automassage_cervical_modal_go_further'
          },
        },
    },
    {
        id: 'rit.balancier_neutre',
        label: 'ritual_balancier_neutre_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['protection', 'émotions', 'equilibre', 'mindset'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_balancier_neutre_phase_1_name', instruction: 'ritual_balancier_neutre_phase_1_instruction', duration: 30 },
            { type: 'texte', name: 'ritual_balancier_neutre_phase_2_name', instruction: 'ritual_balancier_neutre_phase_2_instruction', duration: 30 },
            { type: 'texte', name: 'ritual_balancier_neutre_phase_3_name', instruction: 'ritual_balancier_neutre_phase_3_instruction', duration: 30 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/balancier_neutre_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/balancier_neutre_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/balancier_neutre_es.wav',
        },
        modal: {
          titre: 'ritual_balancier_neutre_modal_title',
          icon: '⚖️',
          sections: {
            pourquoi: 'ritual_balancier_neutre_modal_why',
            comment: 'ritual_balancier_neutre_modal_how',
            conseils: 'ritual_balancier_neutre_modal_tips',
            enSavoirPlus: 'ritual_balancier_neutre_modal_learn_more',
            pourAllerPlusLoin: 'ritual_balancier_neutre_modal_go_further'
          },
        },
    },
    {
        id: 'rit.bascule_vibratoire',
        label: 'ritual_bascule_vibratoire_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 75,
        donut: 'off',
        haptique: {},
        tags: ['émotions', 'dynamiser', 'confiance', 'lacher-prise', 'somatique'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_bascule_vibratoire_phase_1_name', instruction: 'ritual_bascule_vibratoire_phase_1_instruction', duration: 15 },
            { type: 'video', name: 'ritual_bascule_vibratoire_phase_2_name', instruction: 'ritual_bascule_vibratoire_phase_2_instruction', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/basculevibratoire.mp4' },
            { type: 'image', name: 'ritual_bascule_vibratoire_phase_3_name', instruction: 'ritual_bascule_vibratoire_phase_3_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/wonder-woman.png' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/bascule_vibratoire_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/bascule_vibratoire_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/bascule_vibratoire_es.wav',
        },
        modal: {
          titre: 'ritual_bascule_vibratoire_modal_title',
          icon: '🤸',
          sections: {
            pourquoi: 'ritual_bascule_vibratoire_modal_why',
            comment: 'ritual_bascule_vibratoire_modal_how',
            conseils: 'ritual_bascule_vibratoire_modal_tips',
            enSavoirPlus: 'ritual_bascule_vibratoire_modal_learn_more',
            pourAllerPlusLoin: 'ritual_bascule_vibratoire_modal_go_further',
          },
        },
    },
    {
        id: 'rit.body_scan_180',
        label: 'ritual_body_scan_180_label',
        category: 'neuro',
        playerType: 'audio-guide',
        dureeSec: 180,
        donut: 'off',
        haptique: {},
        tags: ['détente', 'somatique', 'pleine-conscience', 'apaiser', 'sommeil'],
        isPremium: false,
        data: {
            audioUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/body-scan.mp3'
        },
        modal: {
            titre: 'ritual_body_scan_180_modal_title',
            icon: '🧘',
            sections: {
                pourquoi: 'ritual_body_scan_180_modal_why',
                comment: 'ritual_body_scan_180_modal_how',
                conseils: 'ritual_body_scan_180_modal_tips',
                enSavoirPlus: 'ritual_body_scan_180_modal_learn_more',
                pourAllerPlusLoin: 'ritual_body_scan_180_modal_go_further'
            }
        }
    },
    {
        id: 'rit.butterfly_hug',
        label: 'ritual_butterfly_hug_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['anxiete', 'apaiser', 'stress', 'compassion', 'somatique'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_butterfly_hug_phase_1_name', instruction: 'ritual_butterfly_hug_phase_1_instruction', duration: 15 },
            { type: 'video', name: 'ritual_butterfly_hug_phase_2_name', instruction: 'ritual_butterfly_hug_phase_2_instruction', duration: 60, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/papillon.mp4' },
            { type: 'video', name: 'ritual_butterfly_hug_phase_3_name', instruction: 'ritual_butterfly_hug_phase_3_instruction', duration: 15, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/papillon2.mp4' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/calin_papillon_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/calin_papillon_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/calin_papillon_es.wav',
        },
        modal: {
          titre: 'ritual_butterfly_hug_modal_title',
          icon: '🦋',
          sections: {
            pourquoi: 'ritual_butterfly_hug_modal_why',
            comment: 'ritual_butterfly_hug_modal_how',
            conseils: 'ritual_butterfly_hug_modal_tips',
            enSavoirPlus: 'ritual_butterfly_hug_modal_learn_more',
            pourAllerPlusLoin: 'ritual_butterfly_hug_modal_go_further'
          },
        },
    },
    {
        id: 'rit.connexion_holofractographique',
        label: 'ritual_connexion_holofractographique_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['spiritualité', 'visualisation', 'inspiration', 'lacher-prise'],
        isPremium: true,
        data: {
          phases: [
            { type: 'image', name: 'ritual_connexion_holofractographique_phase_1_name', instruction: 'ritual_connexion_holofractographique_phase_1_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pointlumiere.png' },
            { type: 'image', name: 'ritual_connexion_holofractographique_phase_2_name', instruction: 'ritual_connexion_holofractographique_phase_2_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/etoiles.png' },
            { type: 'image', name: 'ritual_connexion_holofractographique_phase_3_name', instruction: 'ritual_connexion_holofractographique_phase_3_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/etoiles2.png' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/connexion_holo_fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/connexion_holo_en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/connexion_holo_es.wav',
        },
        modal: {
          titre: 'ritual_connexion_holofractographique_modal_title',
          icon: '✨',
          sections: {
            pourquoi: 'ritual_connexion_holofractographique_modal_why',
            comment: 'ritual_connexion_holofractographique_modal_how',
            conseils: 'ritual_connexion_holofractographique_modal_tips',
            enSavoirPlus: 'ritual_connexion_holofractographique_modal_learn_more_extra',
            pourAllerPlusLoin: 'ritual_connexion_holofractographique_modal_go_further'
          },
        },
    },
    {
        id: 'rit.couleur_therapie',
        label: 'ritual_couleur_therapie_label',
        category: 'neuro',
        playerType: 'couleur',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['joie', 'calmer', 'énergie', 'créativité', 'visualisation'],
        isPremium: false,
        data: {
          colors: {
            '#FF4757': 'ritual_couleur_therapie_virtue_red',
            '#FF6B35': 'ritual_couleur_therapie_virtue_orange',
            '#FFC312': 'ritual_couleur_therapie_virtue_yellow',
            '#00B894': 'ritual_couleur_therapie_virtue_green',
            '#0066FF': 'ritual_couleur_therapie_virtue_blue',
            '#8E44AD': 'ritual_couleur_therapie_virtue_purple',
          }
        },
        modal: {
          titre: 'ritual_couleur_therapie_modal_title',
          icon: '🎨',
          sections: {
            pourquoi: 'ritual_couleur_therapie_modal_why',
            comment: 'ritual_couleur_therapie_modal_how',
            conseils: 'ritual_couleur_therapie_modal_tips',
            enSavoirPlus: 'ritual_couleur_therapie_modal_learn_more',
            pourAllerPlusLoin: 'ritual_couleur_therapie_modal_go_further'
          },
        },
    },
    {
        id: 'rit.eft_mini',
        label: 'ritual_eft_mini_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 150,
        donut: 'off',
        haptique: {},
        tags: ['anxiete', 'stress', 'émotions', 'lacher-prise'],
        isPremium: true,
        data: {
          phases: [
            { type: 'image', name: 'ritual_eft_mini_phase_1_name', instruction: 'ritual_eft_mini_phase_1_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/eft-karate.png' },
            { type: 'image', name: 'ritual_eft_mini_phase_2_name', instruction: 'ritual_eft_mini_phase_2_instruction', duration: 70, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/eft-ronde.png' },
            { type: 'image', name: 'ritual_eft_mini_phase_3_name', instruction: 'ritual_eft_mini_phase_1_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/eft-karate.png' },
            { type: 'texte', name: 'ritual_eft_mini_phase_4_name', instruction: 'ritual_eft_mini_phase_3_instruction', duration: 20 },
          ]
        },
        modal: {
          titre: 'ritual_eft_mini_modal_title',
          icon: '👆',
          sections: {
            pourquoi: 'ritual_eft_mini_modal_why',
            comment: 'ritual_eft_mini_modal_how',
            conseils: 'ritual_eft_mini_modal_tips',
            enSavoirPlus: 'ritual_eft_mini_modal_learn_more',
            pourAllerPlusLoin: 'ritual_eft_mini_modal_go_further'
          },
        },
    },
    {
        id: 'rit.etreinte_ombre',
        label: 'ritual_etreinte_ombre_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 180,
        donut: 'off',
        haptique: {},
        tags: ['compassion', 'acceptation', 'mindset', 'émotions'],
        isPremium: true,
        data: {
          phases: [
            { 
              type: 'image', 
              name: 'ritual_etreinte_ombre_phase_1_name', 
              instruction: 'ritual_etreinte_ombre_phase_1_instruction', 
              duration: 60, 
              imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/etreinte1.png' 
            },
            { type: 'texte', name: 'ritual_etreinte_ombre_phase_2_name', instruction: 'ritual_etreinte_ombre_phase_2_instruction', duration: 60 },
            { type: 'texte', name: 'ritual_etreinte_ombre_phase_3_name', instruction: 'ritual_etreinte_ombre_phase_3_instruction', duration: 60 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/etreinte-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/etreinte-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/etreinte-es.wav',
        },
        modal: {
          titre: 'ritual_etreinte_ombre_modal_title',
          icon: '🎭',
          sections: {
            pourquoi: 'ritual_etreinte_ombre_modal_why',
            comment: 'ritual_etreinte_ombre_modal_how',
            conseils: 'ritual_etreinte_ombre_modal_tips',
            enSavoirPlus: 'ritual_etreinte_ombre_modal_learn_more',
            pourAllerPlusLoin: 'ritual_etreinte_ombre_modal_go_further',
          },
        },
    },
    {
        id: 'rit.fureur_tigre',
        label: 'ritual_fureur_tigre_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['colere', 'lacher-prise', 'énergie', 'dynamiser'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_fureur_tigre_phase_1_name', instruction: 'ritual_fureur_tigre_phase_1_instruction', duration: 15 },
            { type: 'image', name: 'ritual_fureur_tigre_phase_2_name', instruction: 'ritual_fureur_tigre_phase_2_instruction', duration: 15, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/tigre2.png' },
            { type: 'video', name: 'ritual_fureur_tigre_phase_3_name', instruction: 'ritual_fureur_tigre_phase_3_instruction', duration: 40, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/tigre.mp4' },
            { type: 'image', name: 'ritual_fureur_tigre_phase_4_name', instruction: 'ritual_fureur_tigre_phase_4_instruction', duration: 20, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/tigre4.png' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/fureur_tigre-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/fureur_tigre-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/fureur_tigre-es.wav',
        },
        modal: {
          titre: 'ritual_fureur_tigre_modal_title',
          icon: '🐅',
          sections: {
            pourquoi: 'ritual_fureur_tigre_modal_why',
            comment: 'ritual_fureur_tigre_modal_how',
            conseils: 'ritual_fureur_tigre_modal_tips',
            enSavoirPlus: 'ritual_fureur_tigre_modal_learn_more',
            pourAllerPlusLoin: 'ritual_fureur_tigre_modal_go_further'
          },
        },
    },
    {
        id: 'rit.hakini_mudra',
        label: 'ritual_hakini_mudra_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['focus', 'clarifier', 'mémoire', 'neuro'],
        isPremium: true,
        data: {
            phases: [
                { type: 'image', name: 'ritual_hakini_mudra_phase_1_name', instruction: 'ritual_hakini_mudra_phase_1_instruction', duration: 90, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/hakini-mudra.jpg' },
            ]
        },
        modal: {
            titre: 'ritual_hakini_mudra_modal_title',
            icon: '👌',
            sections: {
                pourquoi: 'ritual_hakini_mudra_modal_why',
                comment: 'ritual_hakini_mudra_modal_how',
                conseils: 'ritual_hakini_mudra_modal_tips',
                enSavoirPlus: 'ritual_hakini_mudra_modal_learn_more',
                pourAllerPlusLoin: 'ritual_hakini_mudra_modal_go_further',
            },
        },
    },
    {
        id: 'rit.interrupteur_cosmique',
        label: 'ritual_interrupteur_cosmique_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 75,
        donut: 'off',
        haptique: {},
        tags: ['rumination', 'lacher-prise', 'visualisation', 'inspiration'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_interrupteur_cosmique_phase_1_name', instruction: 'ritual_interrupteur_cosmique_phase_1_instruction', duration: 25 },
            { type: 'texte', name: 'ritual_interrupteur_cosmique_phase_2_name', instruction: 'ritual_interrupteur_cosmique_phase_2_instruction', duration: 25 },
            { type: 'texte', name: 'ritual_interrupteur_cosmique_phase_3_name', instruction: 'ritual_interrupteur_cosmique_phase_3_instruction', duration: 25 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/interrupteur_cosmique-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/interrupteur_cosmique-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/interrupteur_cosmique-es.wav',
        },
        modal: {
          titre: 'ritual_interrupteur_cosmique_modal_title',
          icon: '🌌',
          sections: {
            pourquoi: 'ritual_interrupteur_cosmique_modal_why',
            comment: 'ritual_interrupteur_cosmique_modal_how',
            conseils: 'ritual_interrupteur_cosmique_modal_tips',
            enSavoirPlus: 'ritual_interrupteur_cosmique_modal_learn_more',
            pourAllerPlusLoin: 'ritual_interrupteur_cosmique_modal_go_further'
          },
        },
    },
    {
        id: 'rit.masque_tombe',
        label: 'ritual_masque_tombe_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['détente', 'stress', 'somatique', 'apaiser'],
        isPremium: true,
        data: {
          phases: [
            { type: 'image', name: 'ritual_masque_tombe_phase_1_name', instruction: 'ritual_masque_tombe_phase_1_instruction', duration: 20, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/grimace.png' },
            { type: 'image', name: 'ritual_masque_tombe_phase_2_name', instruction: 'ritual_masque_tombe_phase_2_instruction', duration: 10, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/detente.png' },
            { type: 'video', name: 'ritual_masque_tombe_phase_3_name', instruction: 'ritual_masque_tombe_phase_3_instruction', duration: 40, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/masque.mp4' },
            { type: 'texte', name: 'ritual_masque_tombe_phase_4_name', instruction: 'ritual_masque_tombe_phase_4_instruction', duration: 20 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/masque-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/masque-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/masque-es.wav',
        },
        modal: {
          titre: 'ritual_masque_tombe_modal_title',
          icon: '😊',
          sections: {
            pourquoi: 'ritual_masque_tombe_modal_why',
            comment: 'ritual_masque_tombe_modal_how',
            conseils: 'ritual_masque_tombe_modal_tips',
            enSavoirPlus: 'ritual_masque_tombe_modal_learn_more',
            pourAllerPlusLoin: 'ritual_masque_tombe_modal_go_further',
          },
        },
    },
    {
        id: 'rit.piege_souris_cosmique',
        label: 'ritual_piege_souris_cosmique_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['rumination', 'anxiete', 'lacher-prise', 'mindset'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_piege_souris_cosmique_phase_1_name', instruction: 'ritual_piege_souris_cosmique_phase_1_instruction', duration: 30 },
            { type: 'image', name: 'ritual_piege_souris_cosmique_phase_2_name', instruction: 'ritual_piege_souris_cosmique_phase_2_instruction', duration: 35, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/souris-fromage.png' },
            { type: 'texte', name: 'ritual_piege_souris_cosmique_phase_3_name', instruction: 'ritual_piege_souris_cosmique_phase_3_instruction', duration: 35 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/piege_souris_cosmique-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/piege_souris_cosmique-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/piege_souris_cosmique-es.wav',
        },
        modal: {
          titre: 'ritual_piege_souris_cosmique_modal_title',
          icon: '🐭',
          sections: {
            pourquoi: 'ritual_piege_souris_cosmique_modal_why',
            comment: 'ritual_piege_souris_cosmique_modal_how',
            conseils: 'ritual_piege_souris_modal_tips',
            enSavoirPlus: 'ritual_piege_souris_cosmique_modal_learn_more',
            pourAllerPlusLoin: 'ritual_piege_souris_cosmique_modal_go_further'
          },
        },
    },
    {
        id: 'rit.power_posing',
        label: 'ritual_power_posing_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['confiance', 'performance', 'stress', 'mindset'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_power_posing_phase_1_name', instruction: 'ritual_power_posing_phase_1_instruction', duration: 15 },
            { type: 'image', name: 'ritual_power_posing_phase_2_name', instruction: 'ritual_power_posing_phase_2_instruction', duration: 90, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/wonder-woman.png' },
            { type: 'texte', name: 'ritual_power_posing_phase_3_name', instruction: 'ritual_power_posing_phase_3_instruction', duration: 15 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/power_posing-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/power-posing-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/power-posing-es.wav',
        },
        modal: {
          titre: 'ritual_power_posing_modal_title',
          icon: '🦸',
          sections: {
            pourquoi: 'ritual_power_posing_modal_why',
            comment: 'ritual_power_posing_modal_how',
            conseils: 'ritual_power_posing_modal_tips',
            enSavoirPlus: 'ritual_power_posing_modal_learn_more',
            pourAllerPlusLoin: 'ritual_power_posing_modal_go_further'
          },
        },
    },
    {
        id: 'rit.recyclage_emotionnel',
        label: 'ritual_recyclage_emotionnel_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['émotions', 'lacher-prise', 'somatique', 'neuro'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_recyclage_emotionnel_phase_1_name', instruction: 'ritual_recyclage_emotionnel_phase_1_instruction', duration: 30 },
            { type: 'animation', name: 'ritual_recyclage_emotionnel_phase_2_name', instruction: 'ritual_recyclage_emotionnel_phase_2_instruction', duration: 60 },
            { type: 'texte', name: 'ritual_recyclage_emotionnel_phase_3_name', instruction: 'ritual_recyclage_emotionnel_phase_3_instruction', duration: 30 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/recyclage_emmotionnel-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/recyclage_emmotionnel-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/recyclage_emmotionnel-es.wav',
        },
        modal: {
          titre: 'ritual_recyclage_emotionnel_modal_title',
          icon: '♻️',
          sections: {
            pourquoi: 'ritual_recyclage_emotionnel_modal_why',
            comment: 'ritual_recyclage_emotionnel_modal_how',
            conseils: 'ritual_recyclage_emotionnel_modal_tips',
            enSavoirPlus: 'ritual_recyclage_emotionnel_modal_learn_more',
            pourAllerPlusLoin: 'ritual_recyclage_emotionnel_modal_go_further'
          },
        },
    },
    {
        id: 'rit.regard_infini',
        label: 'ritual_regard_infini_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 75,
        donut: 'off',
        haptique: {},
        tags: ['focus', 'détente', 'neuro', 'clarifier'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_regard_infini_phase_1_name', instruction: 'ritual_regard_infini_phase_1_instruction', duration: 25 },
            { type: 'texte', name: 'ritual_regard_infini_phase_2_name', instruction: 'ritual_regard_infini_phase_2_instruction', duration: 25 },
            { type: 'texte', name: 'ritual_regard_infini_phase_3_name', instruction: 'ritual_regard_infini_phase_3_instruction', duration: 25 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/regard_infini-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/regard_infini-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/regard_infini-es.wav',
        },
        modal: {
          titre: 'ritual_regard_infini_modal_title',
          icon: '👁️',
          sections: {
            pourquoi: 'ritual_regard_infini_modal_why',
            comment: 'ritual_regard_infini_modal_how',
            conseils: 'ritual_regard_infini_modal_tips',
            pourAllerPlusLoin: 'ritual_regard_infini_modal_go_further'
          },
        },
    },
    {
        id: 'rit.salut_quantique',
        label: 'ritual_salut_quantique_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['mindset', 'confiance', 'inspiration', 'visualisation'],
        isPremium: true,
        data: {
          phases: [
            { type: 'image', name: 'ritual_salut_quantique_phase_1_name', instruction: 'ritual_salut_quantique_phase_1_instruction', duration: 40, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/passe.png' },
            { type: 'image', name: 'ritual_salut_quantique_phase_2_name', instruction: 'ritual_salut_quantique_phase_2_instruction', duration: 40, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/double.png' },
            { type: 'image', name: 'ritual_salut_quantique_phase_3_name', instruction: 'ritual_salut_quantique_phase_3_instruction', duration: 40, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/double3.png' },
          ]
        },
        modal: {
          titre: 'ritual_salut_quantique_modal_title',
          icon: '⚛️',
          sections: {
            pourquoi: 'ritual_salut_quantique_modal_why',
            comment: 'ritual_salut_quantique_modal_how',
            conseils: 'ritual_salut_quantique_modal_tips',
            enSavoirPlus: 'ritual_salut_quantique_modal_learn_more',
            pourAllerPlusLoin: 'ritual_salut_quantique_modal_go_further'
          },
        },
    },
    {
        id: 'rit.synchro_gamma',
        label: 'ritual_synchro_gamma_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 228,
        donut: 'off',
        haptique: {},
        tags: ['focus', 'performance', 'clarifier', 'neuro', 'respiration'],
        isPremium: true,
        data: {
          phases: [
            { type: 'image', name: 'ritual_synchro_gamma_phase_1_name', instruction: 'ritual_synchro_gamma_phase_1_instruction', duration: 10, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/chaise.png' },
            { type: 'video', name: 'ritual_synchro_gamma_phase_2_name', instruction: 'ritual_synchro_gamma_phase_2_instruction', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/oeilgaucheferme.mp4' },
            { type: 'video', name: 'ritual_synchro_gamma_phase_3_name', instruction: 'ritual_synchro_gamma_phase_3_instruction', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/oeildroitferme.mp4' },
            { type: 'video', name: 'ritual_synchro_gamma_phase_4_name', instruction: 'ritual_synchro_gamma_phase_4_instruction', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/oeillouche.mp4' },
            { 
              type: 'respiration', 
              name: 'ritual_synchro_gamma_phase_5_name', 
              instruction: 'ritual_synchro_gamma_phase_5_instruction', 
              duration: 128,
              protocol: [
                { n: 'breathe_in', s: 4 },
                { n: 'hold_full', s: 4 },
                { n: 'breathe_out', s: 4 },
                { n: 'hold_empty', s: 4 },
              ]
            },
          ]
        },
        modal: {
          titre: 'ritual_synchro_gamma_modal_title',
          icon: '⚡',
          sections: {
            pourquoi: 'ritual_synchro_gamma_modal_why',
            comment: 'ritual_synchro_gamma_modal_how',
            conseils: 'ritual_synchro_gamma_modal_tips',
            enSavoirPlus: 'ritual_synchro_gamma_modal_learn_more',
            pourAllerPlusLoin: 'ritual_synchro_gamma_modal_go_further'
          },
        },
    },
    {
        id: 'rit.trataka',
        label: 'ritual_trataka_label',
        category: 'neuro',
        playerType: 'fixation',
        dureeSec: 60,
        donut: 'off',
        haptique: {},
        tags: ['focus', 'clarifier', 'calmer', 'presence'],
        isPremium: false,
        modal: {
          titre: 'ritual_trataka_modal_title',
          icon: '🎯',
          sections: {
            pourquoi: 'ritual_trataka_modal_why',
            comment: 'ritual_trataka_modal_how',
            conseils: 'ritual_trataka_modal_tips',
            enSavoirPlus: 'ritual_trataka_modal_learn_more',
            pourAllerPlusLoin: 'ritual_trataka_modal_go_further'
          },
        },
    },
    {
        id: 'rit.vibration_tellurique',
        label: 'ritual_vibration_tellurique_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 150,
        donut: 'off',
        haptique: {},
        tags: ['stress', 'lacher-prise', 'somatique', 'récupération', 'anxiete'],
        isPremium: true,
        data: {
          phases: [
            { type: 'image', name: 'ritual_vibration_tellurique_phase_1_name', instruction: 'ritual_vibration_tellurique_phase_1_instruction', duration: 15, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/vib1.png' },
            { type: 'image', name: 'ritual_vibration_tellurique_phase_3_name', instruction: 'ritual_vibration_tellurique_phase_3_instruction', duration: 10, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/vib2.png' },
            { type: 'image', name: 'ritual_vibration_tellurique_phase_4_name', instruction: 'ritual_vibration_tellurique_phase_4_instruction', duration: 60, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/vib3.png' },
            { type: 'texte', name: 'ritual_vibration_tellurique_phase_5_name', instruction: 'ritual_vibration_tellurique_phase_5_instruction', duration: 65 },
          ]
        },
        modal: {
          titre: 'ritual_vibration_tellurique_modal_title',
          icon: '🌍',
          sections: {
            pourquoi: 'ritual_vibration_tellurique_modal_why',
            comment: 'ritual_vibration_tellurique_modal_how',
            conseils: 'ritual_vibration_tellurique_modal_tips',
            enSavoirPlus: 'ritual_vibration_tellurique_modal_learn_more',
            pourAllerPlusLoin: 'ritual_vibration_tellurique_modal_go_further'
          },
        },
    },
    {
        id: 'rit.vagale_ventral',
        label: 'ritual_vagale_ventral_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 135,
        donut: 'off',
        haptique: {},
        tags: ['performance', 'focus', 'calmer', 'confiance', 'respiration', 'neuro'],
        isPremium: true,
        data: {
          phases: [
            { 
              type: 'image', 
              name: 'ritual_vagale_ventral_phase_1_name', 
              instruction: 'ritual_vagale_ventral_phase_1_instruction', 
              duration: 15,
              imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/debout.png'
            },
            {
              type: 'respiration',
              name: 'ritual_vagale_ventral_phase_2_name',
              instruction: 'ritual_vagale_ventral_phase_2_instruction',
              duration: 120,
              protocol: [
                { n: 'ritual_vagale_ventral_phase_2_step_1', s: 6 },
                { n: 'ritual_vagale_ventral_phase_2_step_2', s: 4 },
              ],
            },
          ],
        },
        modal: {
          titre: 'ritual_vagale_ventral_modal_title',
          icon: '🐬',
          sections: {
            pourquoi: 'ritual_vagale_ventral_modal_why',
            comment: 'ritual_vagale_ventral_modal_how',
            conseils: 'ritual_vagale_ventral_modal_tips',
            enSavoirPlus: 'ritual_vagale_ventral_modal_learn_more',
            pourAllerPlusLoin: 'ritual_vagale_ventral_modal_go_further'
          },
        },
    },
    {
        id: 'rit.pont_hemispherique',
        label: 'ritual_pont_hemispherique_label',
        category: 'neuro',
        playerType: 'phased-ritual',
        dureeSec: 180,
        donut: 'off',
        haptique: {},
        tags: ['focus', 'créativité', 'clarifier', 'mindset', 'neuro'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', instruction: 'ritual_pont_hemispherique_phase_1_inst', duration: 20 },
            { type: 'video', instruction: 'ritual_pont_hemispherique_phase_2_inst', duration: 25, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pontHemispherique1.mp4' },
            { type: 'video', instruction: 'ritual_pont_hemispherique_phase_3_inst', duration: 45, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pontHemispherique1.mp4' },
            { type: 'video', instruction: 'ritual_pont_hemispherique_phase_4_inst', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pontHemispherique2.mp4' },
            { type: 'image', instruction: 'ritual_pont_hemispherique_phase_5_inst', duration: 20, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pontHemispherique4.png' },
            { type: 'image', instruction: 'ritual_pont_hemispherique_phase_6_inst', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/chaise.png' },
            { type: 'image', instruction: 'ritual_pont_hemispherique_phase_7_inst', duration: 10, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pontHemispherique5.png' },
          ]
        },
        modal: {
            titre: 'ritual_pont_hemispherique_modal_titre',
            icon: '🌉',
            sections: {
                pourquoi: 'ritual_pont_hemispherique_modal_why',
                comment: 'ritual_pont_hemispherique_modal_how',
                conseils: 'ritual_pont_hemispherique_modal_tips',
                enSavoirPlus: 'ritual_pont_hemispherique_modal_learn_more',
                pourAllerPlusLoin: 'ritual_pont_hemispherique_modal_go_further'
            }
        }
    },
    // --- RESPIRATION ---
    {
        id: 'rit.box_4_4_4_4',
        label: 'ritual_box_4_4_4_4_label',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 128,
        donut: 'on_4_4_4_4',
        haptique: { onPhaseChange: true },
        tags: ['focus', 'calmer', 'stress', 'respiration', 'performance'],
        isPremium: false,
        modal: {
            titre: 'ritual_box_4_4_4_4_modal_title',
            icon: '📦',
            sections: {
                pourquoi: 'ritual_box_4_4_4_4_modal_why',
                comment: 'ritual_box_4_4_4_4_modal_how',
                conseils: 'ritual_box_4_4_4_4_modal_tips',
                enSavoirPlus: 'ritual_box_4_4_4_4_modal_learn_more',
                pourAllerPlusLoin: 'ritual_box_4_4_4_4_modal_go_further'
            }
        }
    },
    {
        id: 'rit.calme_4_7_8',
        label: 'ritual_calme_4_7_8_label',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 120,
        donut: 'on_4_7_8',
        haptique: { onPhaseChange: true },
        tags: ['sommeil', 'anxiete', 'apaiser', 'respiration'],
        isPremium: false,
        modal: {
            titre: 'ritual_calme_4_7_8_modal_title',
            icon: '🌙',
            sections: {
                pourquoi: 'ritual_calme_4_7_8_modal_why',
                comment: 'ritual_calme_4_7_8_modal_how',
                conseils: 'ritual_calme_4_7_8_modal_tips',
                enSavoirPlus: 'ritual_calme_4_7_8_modal_learn_more',
                pourAllerPlusLoin: 'ritual_calme_4_7_8_modal_go_further'
            }
        }
    },
    {
        id: 'rit.coherence_bento',
        label: 'ritual_coherence_bento_label',
        category: 'respiration',
        playerType: 'bento',
        dureeSec: 180,
        donut: 'on_custom',
        haptique: { onPhaseChange: true },
        tags: ['apaiser', 'focus', 'coherence', 'respiration', 'pleine-conscience'],
        isPremium: true,
        options: { perPhaseProgress: true },
        modal: {
          titre: 'ritual_coherence_bento_modal_title',
          icon: '🍱',
          sections: {
            pourquoi: 'ritual_coherence_bento_modal_why',
            comment: 'ritual_coherence_bento_modal_how',
            conseils: 'ritual_coherence_bento_modal_tips',
            enSavoirPlus: 'ritual_coherence_bento_modal_learn_more',
            pourAllerPlusLoin: 'ritual_coherence_bento_modal_go_further'
          },
        },
    },
    {
        id: 'rit.equilibre_5_5',
        label: 'ritual_equilibre_5_5_label',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 180,
        donut: 'on_5_5',
        haptique: { onPhaseChange: true },
        tags: ['apaiser', 'focus', 'equilibre', 'coherence', 'respiration'],
        isPremium: false,
        options: { extend5min: true, id5min: 'rit.equilibre_5_5_5m' },
        modal: {
            titre: 'ritual_equilibre_5_5_modal_title',
            icon: '⚖️',
            sections: {
                pourquoi: 'ritual_equilibre_5_5_modal_why',
                comment: 'ritual_equilibre_5_5_modal_how',
                conseils: 'ritual_equilibre_5_5_modal_tips',
                enSavoirPlus: 'ritual_equilibre_5_5_modal_learn_more',
                pourAllerPlusLoin: 'ritual_equilibre_5_5_modal_go_further'
            },
        },
    },
    {
        id: 'rit.equilibre_5_5_5m',
        label: 'ritual_equilibre_5_5_label_5m',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 300,
        donut: 'on_5_5',
        haptique: { onPhaseChange: true },
        tags: ['apaiser', 'focus', 'equilibre', 'coherence', 'respiration'],
        isPremium: false,
        modal: {
            titre: 'ritual_equilibre_5_5_modal_title',
            icon: '⚖️',
            sections: {
                pourquoi: 'ritual_equilibre_5_5_modal_why',
                comment: 'ritual_equilibre_5_5_modal_how',
                conseils: 'ritual_equilibre_5_5_modal_tips',
                enSavoirPlus: 'ritual_equilibre_5_5_modal_learn_more',
                pourAllerPlusLoin: 'ritual_equilibre_5_5_modal_go_further'
            },
        },
    },
    {
        id: 'rit.nadi_shodhana_120',
        label: 'ritual_nadi_shodhana_120_label',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 120,
        donut: 'on_custom',
        haptique: { onPhaseChange: true },
        tags: ['equilibre', 'clarifier', 'calmer', 'focus', 'respiration'],
        isPremium: true,
        data: {
          protocols: {
            apaisant: {
              protocolSteps: [
                { n: 'ritual_nadi_shodhana_120_apaisant_step_1', s: 4 }, { n: 'ritual_nadi_shodhana_120_apaisant_step_2', s: 6 },
                { n: 'ritual_nadi_shodhana_120_apaisant_step_3', s: 4 }, { n: 'ritual_nadi_shodhana_120_apaisant_step_4', s: 6 },
              ],
              imagesByPhase: {
                'ritual_nadi_shodhana_120_apaisant_step_1': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-droite-out.png', caption: 'ritual_nadi_shodhana_120_apaisant_caption_1' },
                'ritual_nadi_shodhana_120_apaisant_step_2': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-gauche-out.png', caption: 'ritual_nadi_shodhana_120_apaisant_caption_2' },
                'ritual_nadi_shodhana_120_apaisant_step_3': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-gauche-out.png', caption: 'ritual_nadi_shodhana_120_apaisant_caption_3' },
                'ritual_nadi_shodhana_120_apaisant_step_4': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-droite-out.png', caption: 'ritual_nadi_shodhana_120_apaisant_caption_4' },
              }
            },
            dynamisant: {
              protocolSteps: [
                { n: 'ritual_nadi_shodhana_120_dynamisant_step_1', s: 4 }, { n: 'ritual_nadi_shodhana_120_dynamisant_step_2', s: 6 },
                { n: 'ritual_nadi_shodhana_120_dynamisant_step_3', s: 4 }, { n: 'ritual_nadi_shodhana_120_dynamisant_step_4', s: 6 },
              ],
              imagesByPhase: {
                'ritual_nadi_shodhana_120_dynamisant_step_1': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-gauche-out.png', caption: 'ritual_nadi_shodhana_120_dynamisant_caption_1' },
                'ritual_nadi_shodhana_120_dynamisant_step_2': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-droite-out.png', caption: 'ritual_nadi_shodhana_120_dynamisant_caption_2' },
                'ritual_nadi_shodhana_120_dynamisant_step_3': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-gauche-out.png', caption: 'ritual_nadi_shodhana_120_dynamisant_caption_3' },
                'ritual_nadi_shodhana_120_dynamisant_step_4': { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasara-droite-out.png', caption: 'ritual_nadi_shodhana_120_dynamisant_caption_4' },
              }
            }
          }
        },
        modal: {
          titre: 'ritual_nadi_shodhana_120_modal_title',
          icon: '☯️',
          sections: {
            pourquoi: 'ritual_nadi_shodhana_120_modal_why',
            comment: 'ritual_nadi_shodhana_120_modal_how',
            conseils: 'ritual_nadi_shodhana_120_modal_tips',
            enSavoirPlus: 'ritual_nadi_shodhana_120_modal_learn_more',
            pourAllerPlusLoin: 'ritual_nadi_shodhana_120_modal_go_further'
          },
        },
    },
    {
        id: 'rit.respiration_freinee_udjai',
        label: 'ritual_respiration_freinee_udjai_label',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 120,
        donut: 'on_5_5',
        haptique: { onPhaseChange: true },
        tags: ['focus', 'calmer', 'respiration', 'pleine-conscience'],
        isPremium: true,
        instructions: 'ritual_respiration_freinee_udjai_instructions',
        modal: {
            titre: 'ritual_respiration_freinee_udjai_modal_title',
            icon: '🌊',
            sections: {
                pourquoi: 'ritual_respiration_freinee_udjai_modal_why',
                comment: 'ritual_respiration_freinee_udjai_modal_how',
                conseils: 'ritual_respiration_freinee_udjai_modal_tips',
                enSavoirPlus: 'ritual_respiration_freinee_udjai_modal_learn_more',
                pourAllerPlusLoin: 'ritual_respiration_freinee_udjai_modal_go_further'
            },
        },
    },
    {
        id: 'rit.souffle_dragon',
        label: 'ritual_souffle_dragon_label',
        category: 'respiration',
        playerType: 'phased-ritual',
        dureeSec: 75,
        donut: 'off',
        haptique: {},
        tags: ['colere', 'lacher-prise', 'énergie', 'dynamiser'],
        isPremium: true,
        data: {
          phases: [
            { type: 'image', name: 'ritual_souffle_dragon_phase_1_name', instruction: 'ritual_souffle_dragon_phase_1_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/brasciel.png' },
            { type: 'image', name: 'ritual_souffle_dragon_phase_2_name', instruction: 'ritual_souffle_dragon_phase_2_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/dragon2.png' },
            { type: 'texte', name: 'ritual_souffle_dragon_phase_3_name', instruction: 'ritual_souffle_dragon_phase_3_instruction', duration: 15 },
          ]
        },
        modal: {
          titre: 'ritual_souffle_dragon_modal_title',
          icon: '🐉',
          sections: {
            pourquoi: 'ritual_souffle_dragon_modal_why',
            comment: 'ritual_souffle_dragon_modal_how',
            conseils: 'ritual_souffle_dragon_modal_tips',
            enSavoirPlus: 'ritual_souffle_dragon_modal_learn_more',
            pourAllerPlusLoin: 'ritual_souffle_dragon_modal_go_further'
          },
        },
    },
    {
        id: 'rit.soupir_physio_120',
        label: 'ritual_soupir_physio_120_label',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 120,
        donut: 'on_custom_soupir',
        haptique: { onPhaseChange: true },
        tags: ['stress', 'anxiete', 'apaiser', 'respiration', 'calmer'],
        isPremium: false,
        modal: {
            titre: 'ritual_soupir_physio_120_modal_title',
            icon: '😮‍💨',
            sections: {
                pourquoi: 'ritual_soupir_physio_120_modal_why',
                comment: 'ritual_soupir_physio_120_modal_how',
                conseils: 'ritual_soupir_physio_120_modal_tips',
                enSavoirPlus: 'ritual_soupir_physio_120_modal_learn_more',
                pourAllerPlusLoin: 'ritual_soupir_physio_120_modal_go_further'
            },
        },
    },
    {
        id: 'rit.vagale_dorsal',
        label: 'ritual_vagale_dorsal_label',
        category: 'respiration',
        playerType: 'respiration',
        dureeSec: 192,
        donut: 'on_custom',
        haptique: { onPhaseChange: true },
        tags: ['sommeil', 'apaiser', 'détente', 'récupération', 'respiration'],
        isPremium: true,
        data: {
          protocolSteps: [
            { n: 'ritual_vagale_dorsal_step_1', s: 4 },
            { n: 'ritual_vagale_dorsal_step_2', s: 8 },
          ]
        },
        modal: {
          titre: 'ritual_vagale_dorsal_modal_title',
          icon: '🐢',
          sections: {
            pourquoi: 'ritual_vagale_dorsal_modal_why',
            comment: 'ritual_vagale_dorsal_modal_how',
            conseils: 'ritual_vagale_dorsal_modal_tips',
            enSavoirPlus: 'ritual_vagale_dorsal_modal_learn_more',
            pourAllerPlusLoin: 'ritual_vagale_dorsal_modal_go_further'
          },
        },
    },
    // --- MICRO-RITUEL ---
    {
        id: 'rit.activation_qi',
        label: 'ritual_activation_qi_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 130,
        donut: 'off',
        haptique: {},
        tags: ['énergie', 'dynamiser', 'somatique', 'corps'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', instruction: 'ritual_activation_qi_phase_1', duration: 20 },
            { type: 'texte', instruction: 'ritual_activation_qi_phase_2', duration: 25 },
            { type: 'texte', instruction: 'ritual_activation_qi_phase_3', duration: 30 },
            { type: 'texte', instruction: 'ritual_activation_qi_phase_4', duration: 35 },
            { type: 'texte', instruction: 'ritual_activation_qi_phase_5', duration: 20 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/activation_qi-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/activation_qi-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/activation_qi-es.wav',
        },
        modal: {
            titre: 'ritual_activation_qi_modal_title',
            icon: '⚡',
            sections: {
                pourquoi: 'ritual_activation_qi_why',
                comment: 'ritual_activation_qi_how',
                conseils: 'ritual_activation_qi_tips',
                enSavoirPlus: 'ritual_activation_qi_learn_more',
                pourAllerPlusLoin: 'ritual_activation_qi_go_further'
            },
        },
    },
    {
        id: 'rit.activation_grace',
        label: 'ritual_activation_grace_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 75,
        donut: 'off',
        haptique: {},
        tags: ['énergie', 'spiritualité', 'equilibre', 'dynamiser'],
        isPremium: false,
        data: {
          phases: [
            { type: 'image', name: 'ritual_activation_grace_phase_1_name', instruction: 'ritual_activation_grace_phase_1_instruction', duration: 25, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/activationgrace1.png' },
            { type: 'image', name: 'ritual_activation_grace_phase_2_name', instruction: 'ritual_activation_grace_phase_2_instruction', duration: 25, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/brasecartes.png' },
            { type: 'image', name: 'ritual_activation_grace_phase_3_name', instruction: 'ritual_activation_grace_phase_3_instruction', duration: 25, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/mainspriere2.png' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/activation_grace-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/activation_grace-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/activation_grace-es.wav',
        },
        modal: {
          titre: 'ritual_activation_grace_modal_title',
          icon: '🕊️',
          sections: {
            pourquoi: 'ritual_activation_grace_modal_why',
            comment: 'ritual_activation_grace_modal_how',
            conseils: 'ritual_activation_grace_modal_tips',
            enSavoirPlus: 'ritual_activation_grace_modal_learn_more',
            pourAllerPlusLoin: 'ritual_activation_grace_modal_go_further'
          },
        },
    },
    {
        id: 'rit.gratitude_90',
        label: 'ritual_gratitude_90_label',
        category: 'micro-rituel',
        playerType: 'texte-guide',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['joie', 'mindset', 'compassion', 'gratitude'],
        isPremium: false,
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/journal_gratitude_express-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/journal_gratitude_express-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/journal_gratitude_express-es.wav',
        },
        modal: {
            titre: 'ritual_gratitude_90_modal_title',
            icon: '🙏',
            sections: {
                pourquoi: 'ritual_gratitude_90_modal_why',
                comment: 'ritual_gratitude_90_modal_how',
                conseils: 'ritual_gratitude_90_modal_tips',
                enSavoirPlus: 'ritual_gratitude_90_modal_learn_more',
                pourAllerPlusLoin: 'ritual_gratitude_90_modal_go_further'
            },
        },
    },
    {
        id: 'rit.intention_glissante',
        label: 'ritual_intention_glissante_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['lacher-prise', 'confiance', 'mindset', 'intention'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_intention_glissante_phase_1_name', instruction: 'ritual_intention_glissante_phase_1_instruction', duration: 30 },
            { type: 'image', name: 'ritual_intention_glissante_phase_2_name', instruction: 'ritual_intention_glissante_phase_2_instruction', duration: 30, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/IG1.png' },
            { type: 'video', name: 'ritual_intention_glissante_phase_3_name', instruction: 'ritual_intention_glissante_phase_3_instruction', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/IG2.mp4' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/intentio_glissante-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/intentio_glissante-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/intentio_glissante-es.wav',
        },
        modal: {
          titre: 'ritual_intention_glissante_modal_title',
          icon: '🍃',
          sections: {
            pourquoi: 'ritual_intention_glissante_modal_why',
            comment: 'ritual_intention_glissante_modal_how',
            conseils: 'ritual_intention_glissante_modal_tips',
            enSavoirPlus: 'ritual_intention_glissante_modal_learn_more',
            pourAllerPlusLoin: 'ritual_intention_glissante_modal_go_further'
          },
        },
    },
    {
        id: 'rit.intention_matinale',
        label: 'ritual_intention_matinale_label',
        category: 'micro-rituel',
        playerType: 'intention',
        dureeSec: 60,
        donut: 'off',
        haptique: {},
        tags: ['mindset', 'intention', 'dynamiser', 'focus'],
        isPremium: false,
        instructions: 'ritual_intention_matinale_instructions',
        modal: {
          titre: 'ritual_intention_matinale_modal_title',
          icon: '🌅',
          sections: {
            pourquoi: 'ritual_intention_matinale_modal_why',
            comment: 'ritual_intention_matinale_modal_how',
            conseils: 'ritual_intention_matinale_modal_tips',
            enSavoirPlus: 'ritual_intention_matinale_modal_learn_more',
            pourAllerPlusLoin: 'ritual_intention_matinale_modal_go_further'
          },
        },
    },
    {
        id: 'rit.micro_awe',
        label: 'ritual_micro_awe_label',
        category: 'micro-rituel',
        playerType: 'slideshow',
        dureeSec: 60,
        donut: 'off',
        haptique: {},
        tags: ['joie', 'inspiration', 'lacher-prise', 'rumination'],
        isPremium: false,
        data: {
            images: [
                { url: 'https://images.pexels.com/photos/110854/pexels-photo-110854.jpeg', caption: 'ritual_micro_awe_caption_1', duration: 12 },
                { url: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg', caption: 'ritual_micro_awe_caption_2', duration: 12 },
                { url: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg', caption: 'ritual_micro_awe_caption_3', duration: 12 },
                { url: 'https://magnetiseur-dax.fr/webapp/Aura/flocon.png', caption: 'ritual_micro_awe_caption_4', duration: 12 },
                { url: 'https://magnetiseur-dax.fr/webapp/Aura/foret2.png', caption: 'ritual_micro_awe_caption_5', duration: 12 },
            ]
        },
        modal: {
            titre: 'ritual_micro_awe_modal_title',
            icon: '😮',
            sections: {
                pourquoi: 'ritual_micro_awe_modal_why',
                comment: 'ritual_micro_awe_modal_how',
                conseils: 'ritual_micro_awe_modal_tips',
                enSavoirPlus: 'ritual_micro_awe_modal_learn_more',
                pourAllerPlusLoin: 'ritual_micro_awe_modal_go_further'
            }
        }
    },
    {
        id: 'rit.pluie_interieure',
        label: 'ritual_pluie_interieure_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['détente', 'apaiser', 'somatique', 'visualisation'],
        isPremium: false,
        data: {
          phases: [
            { type: 'video', name: 'ritual_pluie_interieure_phase_1_name', instruction: 'ritual_instruct_pluie_interieure_1', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pluie.mp4' },
            { type: 'video', name: 'ritual_pluie_interieure_phase_2_name', instruction: 'ritual_instruct_pluie_interieure_2', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pluie2.mp4' },
            { type: 'video', name: 'ritual_pluie_interieure_phase_3_name', instruction: 'ritual_instruct_pluie_interieure_3', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pluie3.mp4' },
            { type: 'video', name: 'ritual_pluie_interieure_phase_4_name', instruction: 'ritual_instruct_pluie_interieure_4_new', duration: 30, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/pluie4.mp4' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/pluie_interieure-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/pluie_interieure-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/pluie_interieure-es.wav',
        },
        modal: {
          titre: 'ritual_pluie_interieure_modal_title',
          icon: '🌧️',
          sections: {
            pourquoi: 'ritual_pluie_interieure_modal_why',
            comment: 'ritual_pluie_interieure_modal_how',
            conseils: 'ritual_pluie_interieure_modal_tips',
            enSavoirPlus: 'ritual_pluie_interieure_modal_learn_more',
            pourAllerPlusLoin: 'ritual_pluie_interieure_modal_go_further'
          },
        },
    },
    {
        id: 'rit.porte_interieure',
        label: 'ritual_porte_interieure_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 90,
        donut: 'off',
        haptique: {},
        tags: ['ancrage', 'presence', 'pleine-conscience', 'calmer'],
        isPremium: true,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_porte_interieure_phase_1_name', instruction: 'ritual_porte_interieure_phase_1_instruction', duration: 30 },
            { type: 'texte', name: 'ritual_porte_interieure_phase_2_name', instruction: 'ritual_porte_interieure_phase_2_instruction', duration: 30 },
            { type: 'texte', name: 'ritual_porte_interieure_phase_3_name', instruction: 'ritual_porte_interieure_phase_3_instruction', duration: 30 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/porte_interieure-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/porte_interieure-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/porte_interieure-es.wav',
        },
        modal: {
          titre: 'ritual_porte_interieure_modal_title',
          icon: '🚪',
          sections: {
            pourquoi: 'ritual_porte_interieure_modal_why',
            comment: 'ritual_porte_interieure_modal_how',
            conseils: 'ritual_porte_interieure_modal_tips',
            enSavoirPlus: 'ritual_porte_interieure_modal_learn_more',
            pourAllerPlusLoin: 'ritual_porte_interieure_modal_go_further'
          },
        },
    },
    {
        id: 'rit.priere_du_soir',
        label: 'ritual_priere_du_soir_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 108,
        donut: 'off',
        haptique: {},
        tags: ['sommeil', 'lacher-prise', 'gratitude', 'compassion'],
        isPremium: true,
       data: {
        phases: [
         { type: 'texte', instruction: 'ritual_priere_soir_laic_step_1', duration: 12 },
    { type: 'texte', instruction: 'ritual_priere_soir_laic_step_2', duration: 12 },
    { type: 'texte', instruction: 'ritual_priere_soir_laic_step_3', duration: 12 },
    { type: 'texte', instruction: 'ritual_priere_soir_laic_step_4', duration: 12 },
    { type: 'texte', instruction: 'ritual_priere_soir_laic_step_5', duration: 12 },
    { type: 'texte', instruction: 'ritual_priere_soir_laic_step_6', duration: 12 },
    { type: 'texte', instruction: 'ritual_priere_soir_laic_step_7', duration: 12 },
    { type: 'texte', instruction: 'ritual_priere_soir_laic_step_8', duration: 12 },
        { type: 'texte', instruction: 'ritual_priere_soir_laic_step_9', duration: 12 },
      ]
    },
        modal: {
          titre: 'ritual_priere_du_soir_modal_title',
          icon: '🌃',
          sections: {
            pourquoi: 'ritual_priere_du_soir_modal_why',
            comment: 'ritual_priere_du_soir_modal_how',
            conseils: 'ritual_priere_du_soir_modal_tips',
            enSavoirPlus: 'ritual_priere_du_soir_modal_learn_more',
            pourAllerPlusLoin: 'ritual_priere_du_soir_modal_go_further'
          },
        },
    },
    {
        id: 'rit.sagesse_minute',
        label: 'ritual_sagesse_minute_label',
        category: 'micro-rituel',
        playerType: 'sagesse-minute',
        dureeSec: 60,
        donut: 'off',
        haptique: {},
        tags: ['sagesse', 'mindset', 'inspiration', 'intention'],
        isPremium: false,
        options: { perPhaseProgress: true },
        modal: {
          titre: 'ritual_sagesse_minute_modal_title',
          icon: '📜',
          sections: {
            pourquoi: 'ritual_sagesse_minute_modal_why',
            comment: 'ritual_sagesse_minute_modal_how',
            conseils: 'ritual_sagesse_minute_modal_tips',
            enSavoirPlus: 'ritual_sagesse_minute_modal_learn_more',
            pourAllerPlusLoin: 'ritual_sagesse_minute_modal_go_further'
          },
        },
    },
{
        id: 'rit.sourire_organes',
        label: 'ritual_sourire_organes_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 150,
        donut: 'off',
        haptique: {},
        tags: ['compassion', 'détente', 'somatique', 'joie', 'gratitude'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', instruction: 'ritual_sourire_organes_phase_intro', duration: 25 },
            { type: 'video', instruction: 'ritual_sourire_organes_phase_coeur', duration: 25, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/coeur.mp4' },
            { type: 'video', instruction: 'ritual_sourire_organes_phase_poumons', duration: 25, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/poumons.mp4' },
            { type: 'video', instruction: 'ritual_sourire_organes_phase_foie', duration: 25, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/foie.mp4' },
            { type: 'video', instruction: 'ritual_sourire_organes_phase_reins', duration: 25, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/reins.mp4' },
            { type: 'video', instruction: 'ritual_sourire_organes_phase_rate', duration: 25, videoUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/rate-pancreas.mp4' },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sourire_organes-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sourire_organes-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sourire_organes-es.wav',
        },
        modal: {
            titre: 'ritual_sourire_organes_modal_title',
            icon: '😊',
            sections: {
                pourquoi: 'ritual_sourire_organes_modal_why',
                comment: 'ritual_sourire_organes_modal_how',
                conseils: 'ritual_sourire_organes_modal_tips',
                enSavoirPlus: 'ritual_sourire_organes_modal_learn_more',
                pourAllerPlusLoin: 'ritual_sourire_organes_modal_go_further'
            },
        },
    },
    {
        id: 'rit.sagesse_tolteque',
        label: 'ritual_sagesse_tolteque_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 150,
        donut: 'off',
        haptique: {},
        tags: ['sagesse', 'mindset', 'acceptation', 'lacher-prise'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', instruction: 'ritual_sagesse_tolteque_accord_1', duration: 30 },
            { type: 'texte', instruction: 'ritual_sagesse_tolteque_accord_2', duration: 30 },
            { type: 'texte', instruction: 'ritual_sagesse_tolteque_accord_3', duration: 30 },
            { type: 'texte', instruction: 'ritual_sagesse_tolteque_accord_4', duration: 30 },
            { type: 'texte', instruction: 'ritual_sagesse_tolteque_accord_5', duration: 30 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sagesse_tolteque-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sagesse_tolteque-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/sagesse_tolteque-es.wav',
        },
        modal: {
          titre: 'ritual_sagesse_tolteque_modal_title',
          icon: '🦅',
          sections: {
            pourquoi: 'ritual_sagesse_tolteque_modal_why',
            comment: 'ritual_sagesse_tolteque_modal_how',
            conseils: 'ritual_sagesse_tolteque_modal_tips',
            enSavoirPlus: 'ritual_sagesse_tolteque_modal_learn_more',
            pourAllerPlusLoin: 'ritual_sagesse_tolteque_modal_go_further'
          },
        },
    },
    {
        id: 'rit.scan_54321',
        label: 'ritual_scan_54321_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['anxiete', 'stress', 'ancrage', 'presence', 'pleine-conscience'],
        isPremium: false,
        data: {
          phases: [
            { type: 'texte', name: 'ritual_scan_54321_phase_1_name', instruction: 'ritual_scan_54321_phase_1_instruction', duration: 25 },
            { type: 'texte', name: 'ritual_scan_54321_phase_2_name', instruction: 'ritual_scan_54321_phase_2_instruction', duration: 25 },
            { type: 'texte', name: 'ritual_scan_54321_phase_2_name', instruction: 'ritual_scan_54321_phase_2_instruction', duration: 25 },
            { type: 'texte', name: 'ritual_scan_54321_phase_4_name', instruction: 'ritual_scan_54321_phase_4_instruction', duration: 20 },
            { type: 'texte', name: 'ritual_scan_54321_phase_5_name', instruction: 'ritual_scan_54321_phase_5_instruction', duration: 15 },
            { type: 'texte', name: 'ritual_scan_54321_phase_6_name', instruction: 'ritual_scan_54321_phase_6_instruction', duration: 10 },
          ]
        },
        audioGuidance: {
          fr: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/scan_54321-fr.wav',
          en: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/scan_54321-en.wav',
          es: 'https://magnetiseur-dax.fr/webapp/Aura/guidance/scan_54321-es.wav',
        },
        modal: {
            titre: 'ritual_scan_54321_modal_title',
            icon: '🖐️',
            sections: {
                pourquoi: 'ritual_scan_54321_modal_why',
                comment: 'ritual_scan_54321_modal_how',
                conseils: 'ritual_scan_54321_modal_tips',
                enSavoirPlus: 'ritual_scan_54321_modal_learn_more',
                pourAllerPlusLoin: 'ritual_scan_54321_modal_go_further'
            },
        },
    },
    {
        id: 'rit.hooponopono',
        label: 'ritual_hooponopono_label',
        category: 'micro-rituel',
        playerType: 'phased-ritual',
        dureeSec: 120,
        donut: 'off',
        haptique: {},
        tags: ['pardon', 'lacher-prise', 'compassion', 'spiritualité'],
        isPremium: true,
        data: {
            phases: [
                { type: 'image', name: 'ritual_hooponopono_phase_1_name', instruction: 'ritual_hooponopono_phase_1_instruction', duration: 120, imageUrl: 'https://www.magnetiseur-dax.fr/webapp/Aura/Ho.png' },
            ]
        },
        modal: {
            titre: 'ritual_hooponopono_modal_title',
            icon: '💖',
            sections: {
                pourquoi: 'ritual_hooponopono_modal_why',
                comment: 'ritual_hooponopono_modal_how',
                conseils: 'ritual_hooponopono_modal_tips',
                enSavoirPlus: 'ritual_hooponopono_modal_learn_more',
                pourAllerPlusLoin: 'ritual_hooponopono_modal_go_further',
            },
        },
    },
];