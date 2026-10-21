import type { GameModule } from '../engine/types';

export const chroniclesOfAshenmoor: GameModule = {
  id: 'ashenmoor',
  title: 'Chronicles of Ashenmoor',
  tagline: 'A dark fantasy of ruin and remembrance',
  description:
    'The kingdom of Ashenmoor fell to the Ashen Blight seventy years ago. Now its ruins stir once more, and a scattered heir must return to claim — or break — the cursed crown that doomed it.',
  setting:
    'A grimdark medieval fantasy of fallen kingdoms, cursed relics, and the weight of legacy. You are an heir of Ashenmoor, called back to its blackened halls by a dream that will not end.',
  narrativeFont: "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
  palette: {
    accent: '#c4956a',
    accentSoft: '#d9b48a',
    bg: '#0f0d0b',
    surface: '#1a1612',
    border: '#3a2f23',
    text: '#e8ddc7',
    muted: '#9a8c73',
  },
  icon: 'Sword',
  stats: [
    { id: 'might', name: 'Might', short: 'MGT', description: 'Raw physical strength and force of arms.', initial: 5, min: 0, max: 20 },
    { id: 'agility', name: 'Agility', short: 'AGL', description: 'Speed, stealth, and sureness of hand.', initial: 5, min: 0, max: 20 },
    { id: 'lore', name: 'Lore', short: 'LOR', description: 'Knowledge of old rites, runes, and history.', initial: 4, min: 0, max: 20 },
    { id: 'resolve', name: 'Resolve', short: 'RSV', description: 'Willpower and resistance to dread and curse.', initial: 5, min: 0, max: 20 },
  ],
  items: [
    { id: 'rusty_blade', name: 'Rusty Blade', description: 'A notched sword once carried by a forgotten soldier.' },
    { id: 'ashen_talisman', name: 'Ashen Talisman', description: 'A scorched pendant that hums faintly near cursed ground.' },
    { id: 'rune_key', name: 'Rune-Key', description: 'A key etched with binding glyphs.' },
    { id: 'tome_of_ashes', name: 'Tome of Ashes', description: 'A ledger of the old kingdom\'s final rites.' },
    { id: 'blight_cure', name: 'Vial of Dawn-Water', description: 'Blessed water said to slow the Ashen Blight.' },
    { id: 'crown_shard', name: 'Crown Shard', description: 'A splinter of the cursed crown of Ashenmoor.' },
    { id: 'oath_pendant', name: 'Oath-Pendant', description: 'A token of the heir\'s forgotten vow.' },
    { id: 'warding_seal', name: 'Warding Seal', description: 'A wax seal that bars wraiths for a breath.' },
  ],
  characters: [
    {
      id: 'warden',
      name: 'The Warden',
      title: 'Sworn Sword of the Old Hall',
      description:
        'A soldier of a dying order, sworn to guard the ruins of Ashenmoor. You have trained with blade and shield your whole life, and your faith in the old oaths has not yet broken.',
      statBonuses: { might: 4, resolve: 3, agility: 1 },
      startingItems: ['rusty_blade', 'oath_pendant'],
      ability: 'Strong in arms and unshaken by dread.',
    },
    {
      id: 'scholar',
      name: 'The Scholar',
      title: 'Chronicler of the Ashen Order',
      description:
        'You spent your life copying the old tomes, and alone among your brothers you read the forbidden ledger of the kingdom\'s fall. The truth of the crown is yours — and so is its danger.',
      statBonuses: { lore: 6, resolve: 2, agility: 1 },
      startingItems: ['tome_of_ashes', 'ashen_talisman'],
      ability: 'Lore is your weapon; knowledge shields you.',
    },
    {
      id: 'exile',
      name: 'The Exile',
      title: 'Disinherited Heir Returned',
      description:
        'Cast out as a child when the Blight took your family, you survived in the wild marches by wit and knife. You return not as a conqueror but as a ghost come to settle a debt.',
      statBonuses: { agility: 5, might: 2, resolve: 2 },
      startingItems: ['rusty_blade', 'warding_seal'],
      ability: 'Swift and unseen; you slip where others break.',
    },
  ],
  startScene: 'approach',
  scenes: {
    approach: {
      id: 'approach',
      title: 'The Black Road',
      text: [
        'The road to Ashenmoor is black as a wound, and the trees on either side have been dead for seventy years. You remember none of it — and yet your feet know the way, as though the road remembers for you.',
        'Ahead, the broken towers of the old hall rise against a sky the colour of cold ash. A wind moves through the dead wood, and you hear, or think you hear, a bell toll once underground.',
        'A figure stands at the crossroads: a pilgrim in grey, face wrapped against the dust. It has been waiting. "Heir," it says, and its voice is dry leaves. "The crown still dreams. Will you go to it?"',
      ],
      choices: [
        {
          id: 'press_on',
          label: 'Answer the call and take the road to the hall',
          outcome: { destination: 'gate', effects: [{ setFlag: 'answered_call' }] },
        },
        {
          id: 'question',
          label: 'Demand to know what the pilgrim truly is',
          hint: '[Resolve 8]',
          skillCheck: {
            stat: 'resolve',
            difficulty: 8,
            onSuccess: {
              destination: 'pilgrim_truth',
              effects: [{ setFlag: 'knows_pilgrim' }],
            },
            onFailure: { destination: 'gate' },
          },
        },
        {
          id: 'scout',
          label: 'Slip past the pilgrim and scout the road unseen',
          hint: '[Agility 7]',
          skillCheck: {
            stat: 'agility',
            difficulty: 7,
            onSuccess: {
              destination: 'hidden_path',
              effects: [{ setFlag: 'scouted_road' }],
            },
            onFailure: { destination: 'gate', effects: [{ stat: 'resolve', delta: -1 }] },
          },
        },
      ],
    },
    pilgrim_truth: {
      id: 'pilgrim_truth',
      title: 'The Grey Pilgrim',
      text: [
        'You hold the pilgrim\'s gaze until it is the one that looks away. "Very well," it says, and unwinds the cloth from its face. There is no face beneath — only smooth, ash-grey bone, and a voice that comes from the air around it.',
        '"I am the last oath your father swore. He bound me to wait here, heir, until you came. The crown does not dream. It hungers. It ate your line, and it will eat you, unless you carry the old rites with you."',
        'It presses something into your hand — a pendant, warm as a heartbeat. "Your vow. You swore it when you were three years old, and you do not remember. Take it. It will open what must be opened."',
      ],
      onEnter: [{ addItem: 'oath_pendant' }],
      choices: [
        {
          id: 'thank_and_go',
          label: 'Take the pendant and continue to the hall',
          outcome: { destination: 'gate' },
        },
      ],
    },
    hidden_path: {
      id: 'hidden_path',
      title: 'The Dead Man\'s Track',
      text: [
        'You leave the pilgrim at the crossroads and take the faint track that runs along the ridge. Below, you can see the hall and the ruined village, and the black road swarming with things that are not quite men — hunched, slow, dragging their feet as though they have forgotten how to lift them.',
        'On the ridge you find a cairn of stones, and beneath it a body not yet fully turned to ash. Around its neck hangs a seal of red wax, unbroken. The body\'s hand still grips a rusted blade as though it died fighting something it could not name.',
        'You may take what the dead have no more use for.',
      ],
      choices: [
        {
          id: 'take_seal',
          label: 'Take the warding seal from the body',
          outcome: { destination: 'gate', effects: [{ addItem: 'warding_seal' }] },
        },
        {
          id: 'take_blade',
          label: 'Take the dead soldier\'s blade and leave the seal',
          outcome: { destination: 'gate', effects: [{ addItem: 'rusty_blade', setFlag: 'took_blade' }] },
        },
        {
          id: 'take_both',
          label: 'Take both — the dead will not miss them',
          outcome: {
            destination: 'gate',
            effects: [{ addItem: 'warding_seal' }, { addItem: 'rusty_blade' }, { stat: 'resolve', delta: -1 }],
          },
        },
        {
          id: 'leave_all',
          label: 'Leave the dead to their rest and descend',
          outcome: { destination: 'gate', effects: [{ stat: 'resolve', delta: 1 }] },
        },
      ],
    },
    gate: {
      id: 'gate',
      title: 'The Broken Gate',
      text: [
        'The gates of Ashenmoor lie in the dust, torn from their hinges long ago. Beyond them the courtyard is a field of ash, and in the middle of it stands the well — dry, black-lipped, and breathing.',
        'A sound comes up out of the well: not a voice, but the memory of one, saying a name. Your name. The Blight has been saying it for seventy years, waiting.',
        'Two ways lie open: the great doors of the hall itself, half-swallowed by the ash, and a narrow stair to your left that winds down beneath the courtyard, into the old undercroft.',
      ],
      choices: [
        {
          id: 'hall_doors',
          label: 'Cross the courtyard and force the hall doors',
          hint: '[Might 6]',
          skillCheck: {
            stat: 'might',
            difficulty: 6,
            onSuccess: { destination: 'great_hall' },
            onFailure: { destination: 'courtyard_wraith', effects: [{ stat: 'might', delta: -1 }] },
          },
        },
        {
          id: 'undercroft_stair',
          label: 'Take the narrow stair down into the undercroft',
          outcome: { destination: 'undercroft' },
        },
        {
          id: 'investigate_well',
          label: 'Stand at the well and answer the voice that says your name',
          hint: '[Resolve 9]',
          skillCheck: {
            stat: 'resolve',
            difficulty: 9,
            onSuccess: {
              destination: 'well_truth',
              effects: [{ addItem: 'crown_shard', setFlag: 'heard_crown' }],
            },
            onFailure: {
              destination: 'courtyard_wraith',
              effects: [{ stat: 'resolve', delta: -2 }],
            },
          },
        },
      ],
    },
    well_truth: {
      id: 'well_truth',
      title: 'What the Well Said',
      text: [
        'You do not flinch. You lean over the black lip of the well and you say, "I am here. Say what you have to say."',
        'And the crown — for it is the crown, speaking through the ash and the waterless throat of the well — tells you what it is. It was forged to hold a kingdom together, and it did, for two hundred years. Then the kingdom began to rot, and the crown could not stop it, because the crown was made of the kingdom, and when the kingdom rotted the crown rotted too, and rotted the one who wore it.',
        '"I am not your enemy," it says, and it almost sounds tired. "I am the disease and the cure both. Put me on and end me, and I will take the Blight with me. Or leave me, and I will go on saying your name for another seventy years."',
        'A shard of black iron rises out of the ash at the well\'s edge, as though offered. You take it.',
      ],
      onEnter: [{ addItem: 'crown_shard' }, { setFlag: 'knows_crown_nature' }],
      choices: [
        {
          id: 'to_hall',
          label: 'Go up to the hall doors',
          outcome: { destination: 'great_hall' },
        },
        {
          id: 'to_undercroft',
          label: 'Descend to the undercroft to find the rites',
          outcome: { destination: 'undercroft' },
        },
      ],
    },
    courtyard_wraith: {
      id: 'courtyard_wraith',
      title: 'The Ash-Walkers',
      text: [
        'Your strength fails, or your will does, and the ash around the well begins to rise. The hunched things from the road are here too, and they are not men at all but husks — the dead of Ashenmoor, still going through the motions of the living, dragging their feet because they have forgotten how to lift them.',
        'They do not attack. They reach for you, slowly, and their mouths move around words they can no longer shape. They want something. They want to stop.',
        'A wraith rises from the well itself — a tall thing in a tattered robe, faceless, and it points at you with a hand of ash. It speaks one word, and the word is: "Vow."',
      ],
      choices: [
        {
          id: 'show_pendant',
          label: 'Raise the Oath-Pendant and speak your forgotten vow',
          requires: [{ item: 'oath_pendant', has: true }],
          outcome: {
            destination: 'great_hall',
            effects: [{ setFlag: 'wraith appeased' }, { stat: 'resolve', delta: 2 }],
          },
        },
        {
          id: 'use_seal',
          label: 'Break the warding seal against the well-stone',
          requires: [{ item: 'warding_seal', has: true }],
          outcome: {
            destination: 'great_hall',
            effects: [{ removeItem: 'warding_seal', setFlag: 'warded_wraith' }],
          },
        },
        {
          id: 'fight_through',
          label: 'Cut your way through the husks to the hall doors',
          hint: '[Might 7]',
          skillCheck: {
            stat: 'might',
            difficulty: 7,
            onSuccess: {
              destination: 'great_hall',
              effects: [{ stat: 'might', delta: 1 }],
            },
            onFailure: {
              destination: 'ending_death_ash',
              effects: [],
            },
          },
        },
        {
          id: 'flee_undercroft',
          label: 'Flee down the undercroft stair before they close in',
          outcome: { destination: 'undercroft', effects: [{ stat: 'resolve', delta: -1 }] },
        },
      ],
    },
    undercroft: {
      id: 'undercroft',
      title: 'The Undercroft',
      text: [
        'The stair is slick with ash, and the air below is cold and still. The undercroft of Ashenmoor was its heart once — here the old rites were kept, here the crown was forged, here the kings were laid when their line ended.',
        'Rows of sarcophagi line the walls, their lids carved with the faces of kings you never knew. At the far end stands an altar of black stone, and on the altar lies a tome, open, its pages turning without wind. Beside it, a key of runes.',
        'A ghost sits at the altar, reading. It looks up when you enter, and its face is your father\'s face.',
        '"You came," he says. "I hoped you would not. The rites are here — but to take them is to bind yourself to this place. Are you ready for that?"',
      ],
      choices: [
        {
          id: 'take_tome',
          label: 'Take the Tome of Ashes from the altar',
          outcome: {
            destination: 'undercroft_after',
            effects: [{ addItem: 'tome_of_ashes' }, { setFlag: 'has_rites' }],
          },
        },
        {
          id: 'take_key',
          label: 'Take the Rune-Key from beside the tome',
          outcome: {
            destination: 'undercroft_after',
            effects: [{ addItem: 'rune_key' }, { setFlag: 'has_key' }],
          },
        },
        {
          id: 'speak_father',
          label: 'Ask the ghost of your father what he did',
          hint: '[Lore 6]',
          skillCheck: {
            stat: 'lore',
            difficulty: 6,
            onSuccess: {
              destination: 'father_truth',
              effects: [{ setFlag: 'knows_father_sin' }],
            },
            onFailure: { destination: 'undercroft_after' },
          },
        },
        {
          id: 'leave_undercroft',
          label: 'Leave the dead to their reading and go up to the hall',
          outcome: { destination: 'great_hall' },
        },
      ],
    },
    father_truth: {
      id: 'father_truth',
      title: 'The Father\'s Confession',
      text: [
        'Your father\'s ghost looks at you a long moment, and then he tells you. He forged the crown. He made it to save the kingdom, and it did, and then it ate him, and it ate your mother, and it ate your brothers, and it would have eaten you if he had not cast you out before the last of him was gone.',
        '"I was not man enough to destroy it," he says. "I loved it too much. It was my greatest work. Heir — if you take the rites, you will know how to unmake it. But unmaking it will unmake me, and everything I made, including the hall, including the road you walked. There will be nothing left. Not even ash."',
        'He turns a page of the tome, though he is no longer reading it. "Or put it on. End it. Let it take the Blight and you with it, and let the land finally go quiet. I will not tell you which is right. I chose wrong, twice."',
      ],
      onEnter: [{ setFlag: 'knows_father_sin' }, { stat: 'lore', delta: 2 }],
      choices: [
        {
          id: 'take_tome_confessed',
          label: 'Take the Tome of Ashes — the rites to unmake the crown',
          outcome: {
            destination: 'undercroft_after',
            effects: [{ addItem: 'tome_of_ashes' }, { setFlag: 'has_rites' }],
          },
        },
        {
          id: 'take_key_confessed',
          label: 'Take the Rune-Key and go to face the crown',
          outcome: {
            destination: 'undercroft_after',
            effects: [{ addItem: 'rune_key' }, { setFlag: 'has_key' }],
          },
        },
      ],
    },
    undercroft_after: {
      id: 'undercroft_after',
      title: 'The Undercroft, After',
      text: [
        'Whatever you have taken, the altar seems lesser for it, and the ghost of your father — if it was truly your father — does not look at you again. The tome\'s pages stop their turning. The cold deepens.',
        'There is nothing more for you below. The crown is above, in the hall, in the throne room where your line sat and was consumed. You climb the stair back into the grey light of the courtyard.',
      ],
      choices: [
        {
          id: 'up_to_hall',
          label: 'Climb to the hall and go to the throne room',
          outcome: { destination: 'great_hall' },
        },
      ],
    },
    great_hall: {
      id: 'great_hall',
      title: 'The Great Hall',
      text: [
        'The doors give, and the great hall of Ashenmoor opens before you. The long tables are ash, the banners are ash, the high windows are whole but show only a dead white sky. At the far end, on the throne — a seat of black iron grown into the stone — sits the crown.',
        'It is not on a king. It sits on the throne as though it were the king. It is a circlet of black iron, and it is warm, and it is saying your name, softly, the way a parent says a child\'s name in sleep.',
        'As you approach, the air thickens. You can feel the Blight in it — a slow, patient rot, the thing that ate the kingdom and wants to eat you. The crown does not threaten. It waits. It has waited seventy years. It can wait seventy more.',
      ],
      choices: [
        {
          id: 'unmake',
          label: 'Read the rites from the Tome of Ashes and unmake the crown',
          requires: [{ item: 'tome_of_ashes', has: true }],
          outcome: { destination: 'ending_unmade' },
        },
        {
          id: 'wear',
          label: 'Take up the crown and end it from within',
          outcome: { destination: 'ending_worn' },
        },
        {
          id: 'shatter',
          label: 'Strike the crown from the throne with your blade',
          requires: [{ item: 'rusty_blade', has: true }],
          hint: '[Might 9]',
          skillCheck: {
            stat: 'might',
            difficulty: 9,
            onSuccess: {
              destination: 'ending_shattered',
              effects: [{ addItem: 'crown_shard' }],
            },
            onFailure: { destination: 'ending_worn' },
          },
        },
        {
          id: 'seal_away',
          label: 'Use the Rune-Key to lock the crown in its binding',
          requires: [{ item: 'rune_key', has: true }],
          outcome: { destination: 'ending_sealed' },
        },
        {
          id: 'leave_crown',
          label: 'Turn your back on the crown and walk out of Ashenmoor',
          outcome: { destination: 'ending_forsaken' },
        },
      ],
    },
    // ---- ENDINGS ----
    ending_unmade: {
      id: 'ending_unmade',
      title: 'Ending — Ashes to Ashes',
      text: [
        'You open the Tome of Ashes and speak the rites your father could not. The words are old, older than the kingdom, and they are not kind. The crown screams — a thin, high sound, like a child — and then it is not there, and the throne is not there, and the hall is not there.',
        'You are standing in a field of plain earth. The dead trees are gone. The black road is gone. The sky is the ordinary grey of an ordinary morning. There is no Ashenmoor. There never was, now. The Blight went with the crown, and so did everything the crown held together.',
        'You are alone, in a meadow, with a tome of blank pages and a pendant that is now only metal. Your line is ended. The kingdom is ended. The hunger is ended.',
        'You walk away, and the grass grows over the place where a kingdom used to be.',
      ],
      isEnding: true,
      endingType: 'good',
      choices: [],
    },
    ending_worn: {
      id: 'ending_worn',
      title: 'Ending — The Last King',
      text: [
        'You lift the crown from the throne. It is warm, and it fits, and as it settles on your brow you understand, finally, completely, why your father could not put it down.',
        'The Blight is in you now, and you are in the Blight, and the two of you are one, and for one bright moment you can feel the whole kingdom — every dead tree, every husk on the road, every stone of the hall — as though it were your own body.',
        'Then the hunger comes. It is patient. It has waited seventy years for you, and it can wait seventy more, and it will eat, and eat, until there is nothing left to eat, and then it will eat the nothing.',
        'You sit on the throne. The hall is quiet. Somewhere, far away, a bell tolls once underground, and a new heir, who does not yet know your name, begins to dream.',
      ],
      isEnding: true,
      endingType: 'bad',
      choices: [],
    },
    ending_shattered: {
      id: 'ending_shattered',
      title: 'Ending — Broken Iron',
      text: [
        'You raise the blade and bring it down with all your strength. The crown does not scream. It cracks, like ice, and shards of black iron scatter across the floor of the hall. The Blight does not vanish — it seeps out of the broken crown like smoke, and for a moment the air is thick with it, and then, slowly, it thins, and fades.',
        'The hall stands. The kingdom stands, ruined but standing. The husks on the road stop, and do not move again, and are finally, fully dead. The crown is gone, but the land remains, and so do you.',
        'You will not be remembered as a king. You will be remembered, if at all, as the one who broke the thing that broke Ashenmoor. It is enough. It has to be enough.',
        'You walk out of the hall into a grey morning, and for the first time in seventy years, the wind through the dead trees sounds only like wind.',
      ],
      isEnding: true,
      endingType: 'good',
      choices: [],
    },
    ending_sealed: {
      id: 'ending_sealed',
      title: 'Ending — The Binding Renewed',
      text: [
        'You set the Rune-Key against the crown and turn it. The iron of the throne flows like wax, closing over the crown, sealing it in. The Blight does not end — it is bound again, as it was bound when your father first forged the crown, and the hunger goes quiet, and the husks on the road lie down and are still.',
        'But the crown is still there, beneath the throne, dreaming. And you are its new warden, bound to this place as your father was bound, and his father before him. You will keep it. You will watch it. You will wait for the next heir, and hope they are stronger than you, or kinder, or both.',
        'The hall is quiet. The kingdom is quiet. The crown is quiet. And you sit on the throne above it, and you begin the long, long vigil, and you understand, at last, why your father could not leave.',
      ],
      isEnding: true,
      endingType: 'neutral',
      choices: [],
    },
    ending_forsaken: {
      id: 'ending_forsaken',
      title: 'Ending — The Heir Who Walked Away',
      text: [
        'You turn your back on the crown. It calls your name, once, softly, and then it is silent. You walk the length of the hall, through the doors, across the courtyard, past the dry well, and out onto the black road.',
        'The pilgrim is gone from the crossroads. The dead trees do not move. You walk, and the road is long, and the sky is grey, and behind you the crown goes on dreaming, and the Blight goes on eating, and somewhere a bell tolls once underground for an heir who chose to live.',
        'You will dream of Ashenmoor for the rest of your life. You will hear the crown say your name on nights when the wind is right. But you will not go back. You swore that to yourself on the road out, and you mean to keep it.',
        'The kingdom rots on. You do not. That is the only victory you will have, and you carry it with you, all the way home.',
      ],
      isEnding: true,
      endingType: 'neutral',
      choices: [],
    },
    ending_death_ash: {
      id: 'ending_death_ash',
      title: 'Ending — One More Husk',
      text: [
        'The husks are slow, but there are so many of them, and you are tired, and the ash is in your eyes. You go down in the courtyard of Ashenmoor, among the others, and the last thing you feel is a hand on your shoulder that does not mean to hurt you — only to hold you, gently, until you stop.',
        'You stop. The crown, far above in the hall, says your name one last time, and then it says nothing, and you join the slow procession on the black road, dragging your feet, forgetting how to lift them.',
        'There will be another heir. There is always another heir. The crown is patient. The Blight is patient. You were not patient enough, and now you have all the time in the world.',
      ],
      isEnding: true,
      endingType: 'bad',
      choices: [],
    },
  },
};
