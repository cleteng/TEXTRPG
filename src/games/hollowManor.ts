import type { GameModule } from '../engine/types';

export const theHollowManor: GameModule = {
  id: 'hollow_manor',
  title: 'The Hollow Manor',
  tagline: 'A country-house mystery where the house remembers',
  description:
    'You are invited to Blackbriar Manor for the reading of a will that should not concern you. By midnight the solicitor is dead, the doors are locked, and the house begins to confess what it knows.',
  setting:
    'A 1920s English country-house mystery: rain on the windows, a locked drawing room, a dead solicitor, and a manor that has kept its family\'s secrets for two hundred years. You are an uninvited guest with a reason to be there you have not told anyone.',
  narrativeFont: "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
  palette: {
    accent: '#a8845c',
    accentSoft: '#c9a87a',
    bg: '#0c0b09',
    surface: '#15130f',
    border: '#2e2620',
    text: '#e4dccc',
    muted: '#948878',
  },
  icon: 'KeyRound',
  stats: [
    { id: 'wits', name: 'Wits', short: 'WIT', description: 'Observation, deduction, and a quick mind.', initial: 6, min: 0, max: 20 },
    { id: 'charm', name: 'Charm', short: 'CHM', description: 'Persuasion, composure, and reading people.', initial: 5, min: 0, max: 20 },
    { id: 'grit', name: 'Grit', short: 'GRT', description: 'Nerve and steadiness when things turn ugly.', initial: 5, min: 0, max: 20 },
    { id: 'lore', name: 'Lore', short: 'LOR', description: 'Knowledge of history, law, and old families.', initial: 4, min: 0, max: 20 },
  ],
  items: [
    { id: 'invited_letter', name: 'The Invitation', description: 'A letter inviting you to the reading of Sir Edmund Blackbriar\'s will. Addressed to you by a name you have not used in fifteen years.' },
    { id: 'drawing_key', name: 'Drawing-Room Key', description: 'A brass key to the drawing room, found in the solicitor\'s pocket.' },
    { id: 'diary', name: 'Lady Blackbriar\'s Diary', description: 'A leather diary, the last entry dated the night Sir Edmund died.' },
    { id: 'poison_vial', name: 'Empty Vial', description: 'A small glass vial, rinsed, smelling faintly of bitter almond.' },
    { id: 'will_copy', name: 'Copy of the Will', description: 'A carbon copy of Sir Edmund\'s final will and testament.' },
    { id: 'photograph', name: 'Tarnished Photograph', description: 'A photograph of a young woman, a young man, and a child. The child\'s face has been scratched out.' },
    { id: 'lighthouse_key', name: 'Lighthouse Cellar Key', description: 'An iron key to the old lighthouse cellar at the edge of the grounds.' },
    { id: 'pistol', name: 'Service Revolver', description: 'A Webley revolver, loaded, taken from the study desk.' },
  ],
  characters: [
    {
      id: 'detective',
      name: 'The Detective',
      title: 'Private Enquiries, Discreet',
      description:
        'You were a policeman once, before the war took the nerve out of you. Now you take the cases the force won\'t. You were not invited to Blackbriar, but you were coming regardless — Sir Edmund wrote to you three weeks before he died, and the letter frightened you.',
      statBonuses: { wits: 5, grit: 3, charm: 1 },
      startingItems: ['invited_letter'],
      ability: 'Trained eye; nothing in a room escapes you.',
    },
    {
      id: 'heir',
      name: 'The Returned Heir',
      title: 'The One Who Should Not Be Here',
      description:
        'You are the child in the photograph, the one whose face was scratched out. You grew up told you were an orphan. You are not. You came to Blackbriar to learn why your family erased you, and you brought nothing but the letter and a quiet, steady anger.',
      statBonuses: { charm: 4, wits: 3, lore: 2 },
      startingItems: ['invited_letter', 'photograph'],
      ability: 'Blood ties to the house; people confide in you.',
    },
    {
      id: 'journalist',
      name: 'The Journalist',
      title: 'Society Pages, Mostly Lies',
      description:
        'You cover the old families for the Times — their weddings, their scandals, their quieter disappearances. Sir Edmund\'s death is a story, and you are here to get it. You are very good at getting people to tell you things they shouldn\'t.',
      statBonuses: { charm: 5, wits: 3, lore: 1 },
      startingItems: ['invited_letter', 'will_copy'],
      ability: 'Persuasive and well-informed; people talk too much around you.',
    },
  ],
  startScene: 'arrival',
  scenes: {
    arrival: {
      id: 'arrival',
      title: 'Chapter I — The Arrival',
      text: [
        'The rain has been falling since Taunton. Your motor pulls up the gravel drive of Blackbriar Manor at half past six, and the house is exactly as you remember it, or exactly as you have been told: three storeys of pale Bath stone, ivy gone to riot, and a single lit window in the east wing where the drawing room is.',
        'A man is waiting under the portico — Mr. Pirns, the solicitor, a thin fellow in a black coat who looks as though the rain has personally offended him. "You are expected," he says, and does not offer his hand. "The family is assembled. Sir Edmund\'s will is to be read at seven. You are late."',
        'You are not late. You are exactly on time. But something in the way he says it tells you he wishes you had not come at all.',
      ],
      choices: [
        {
          id: 'go_in',
          label: 'Follow Pirns inside to the drawing room',
          outcome: { destination: 'drawing_room' },
        },
        {
          id: 'read_letter',
          label: 'Pause under the portico and re-read the invitation',
          outcome: {
            destination: 'letter_scene',
            effects: [{ setFlag: 're_read_letter' }, { stat: 'lore', delta: 1 }],
          },
        },
        {
          id: 'observe_house',
          label: 'Take a moment to study the manor before going in',
          hint: '[Wits 6]',
          skillCheck: {
            stat: 'wits',
            difficulty: 6,
            onSuccess: {
              destination: 'observation_scene',
              effects: [{ setFlag: 'observed_house' }],
            },
            onFailure: { destination: 'drawing_room' },
          },
        },
      ],
    },
    letter_scene: {
      id: 'letter_scene',
      title: 'The Invitation, Again',
      text: [
        'You stand under the portico and read the letter once more. It is written in a hand you do not recognise, on paper that is old before it was written on. It addresses you by a name you have not used since you were a child. It invites you to the reading of the will of Sir Edmund Blackbriar. It does not say why.',
        'There is a postscript, added in a different ink, in a shakier hand: "The house remembers. Come before they burn it. — E."',
        'You do not know who E. is. But you know, now, that whoever sent this wanted you here for a reason that has nothing to do with inheritance.',
      ],
      choices: [
        {
          id: 'inside_now',
          label: 'Fold the letter away and go in to the reading',
          outcome: { destination: 'drawing_room' },
        },
      ],
    },
    observation_scene: {
      id: 'observation_scene',
      title: 'What You Saw From The Drive',
      text: [
        'You do not go in at once. You stand in the rain and you look at the house the way you were trained to look at houses. The ivy on the east wing is recent — it has grown over a window that has been bricked up from the inside. The chimney of the east-wing fireplace is cold, though it is October and the drawing room is lit. A curtain on the second floor twitches, then settles. Someone is watching you who is not in the drawing room.',
        'On the gravel, near the service entrance, there is a fresh oil stain. A second motor arrived recently, then left. The household was not expecting anyone else.',
        'You file all of this. You go in.',
      ],
      choices: [
        {
          id: 'enter_observed',
          label: 'Enter the manor for the reading',
          outcome: { destination: 'drawing_room', effects: [{ stat: 'wits', delta: 1 }] },
        },
      ],
    },
    drawing_room: {
      id: 'drawing_room',
      title: 'Chapter II — The Reading',
      text: [
        'The drawing room is warm, too warm, and smells of gaslight and damp silk. Three people are already seated: Lady Blackbriar, Sir Edmund\'s widow, in black, hands folded, face a careful blank; Captain Blackbriar, the late Sir Edmund\'s brother, in his regimentals, drinking something amber and not looking at anyone; and Miss Vance, the governess, who has been crying and is trying to hide it.',
        'Pirns clears his throat and reads the will. It is short. Sir Edmund leaves the manor to Lady Blackbriar for her life, and after her death to "the child of my body whose name was struck from the parish record." The room goes very still. Lady Blackbriar does not move. The Captain sets down his glass. Miss Vance looks at you.',
        'Pirns frowns, reads the next line, and stops. He looks up. "There is a codicil," he says, slowly. "Dated the day before Sir Edmund died. It names the child. It names —" He does not finish. His face goes grey. He clutches the arm of his chair, his mouth opens, and he falls forward onto the rug. The will spills across the floor. The key in his pocket rings against the floorboard.',
      ],
      onEnter: [{ addItem: 'drawing_key' }],
      choices: [
        {
          id: 'check_pulse',
          label: 'Go to Pirns immediately and check if he is alive',
          hint: '[Wits 7]',
          skillCheck: {
            stat: 'wits',
            difficulty: 7,
            onSuccess: {
              destination: 'pirns_death',
              effects: [{ setFlag: 'saw_codicil' }, { addItem: 'will_copy' }],
            },
            onFailure: { destination: 'pirns_death' },
          },
        },
        {
          id: 'grab_codicil',
          label: 'Grab the codicil page from the floor before anyone else moves',
          hint: '[Grit 6]',
          skillCheck: {
            stat: 'grit',
            difficulty: 6,
            onSuccess: {
              destination: 'pirns_death',
              effects: [{ addItem: 'will_copy', setFlag: 'has_codicil' }, { setFlag: 'saw_codicil' }],
            },
            onFailure: {
              destination: 'pirns_death',
              effects: [{ setFlag: 'saw_codicil' }],
            },
          },
        },
        {
          id: 'watch_room',
          label: 'Do not move. Watch how each person reacts to the death',
          hint: '[Wits 8]',
          skillCheck: {
            stat: 'wits',
            difficulty: 8,
            onSuccess: {
              destination: 'pirns_death',
              effects: [{ setFlag: 'read_room' }, { stat: 'wits', delta: 1 }],
            },
            onFailure: { destination: 'pirns_death' },
          },
        },
      ],
    },
    pirns_death: {
      id: 'pirns_death',
      title: 'Chapter III — The Solicitor Is Dead',
      text: [
        'Pirns is dead. The smell of bitter almond is faint but unmistakable. Poison, and not a subtle one. The drawing-room door, you note, was never opened after he drank his tea. The tea was poured by Lady Blackbriar, who is now standing very still by the tray, or by Miss Vance, who says she poured her own, or by no one — the pot was full when you came in.',
        'The Captain is the first to speak. "Lock the doors," he says. "No one leaves this house until the police come. The roads are flooded; they will not come tonight. We are alone here." He looks at you. "You. You are the child, aren\'t you? The one in the codicil. That is why you are here."',
        'Lady Blackbriar says nothing. Miss Vance is crying again. The drawing-room key is in your pocket. And somewhere in this house is the codicil that names you — or names someone — and someone has already killed to keep that name quiet.',
      ],
      choices: [
        {
          id: 'admit_it',
          label: 'Admit that you are the child named in the codicil',
          requires: [{ flag: 'saw_codicil', isSet: true }],
          outcome: {
            destination: 'admission_scene',
            effects: [{ setFlag: 'admitted_identity' }],
          },
        },
        {
          id: 'deflect',
          label: 'Say nothing about yourself. Ask to see the body examined.',
          hint: '[Charm 7]',
          skillCheck: {
            stat: 'charm',
            difficulty: 7,
            onSuccess: {
              destination: 'investigation_hub',
              effects: [{ setFlag: 'deflected' }],
            },
            onFailure: { destination: 'investigation_hub', effects: [{ stat: 'grit', delta: -1 }] },
          },
        },
        {
          id: 'accuse',
          label: 'Accuse Lady Blackbriar outright — she poured the tea',
          hint: '[Grit 8]',
          skillCheck: {
            stat: 'grit',
            difficulty: 8,
            onSuccess: {
              destination: 'investigation_hub',
              effects: [{ setFlag: 'accused_widow' }, { stat: 'charm', delta: 1 }],
            },
            onFailure: {
              destination: 'investigation_hub',
              effects: [{ stat: 'charm', delta: -2 }],
            },
          },
        },
        {
          id: 'to_investigation',
          label: 'Say nothing yet. Begin investigating the house.',
          outcome: { destination: 'investigation_hub' },
        },
      ],
    },
    admission_scene: {
      id: 'admission_scene',
      title: 'The Admission',
      text: [
        'You tell them. The Captain nods, as though he already knew. Miss Vance covers her face. Lady Blackbriar looks at you for the first time, fully, and what is in her face is not surprise — it is recognition. "You have his mouth," she says, and nothing else.',
        'The room is different now. You are no longer a stranger. You are the heir, the child who was erased, and everyone in this room has a reason to want you either silenced or grateful. Pirns is still on the floor. The tea is still on the tray. The house is still locked.',
      ],
      choices: [
        {
          id: 'begin_investigation',
          label: 'Begin investigating the manor',
          outcome: { destination: 'investigation_hub' },
        },
      ],
    },
    investigation_hub: {
      id: 'investigation_hub',
      title: 'Chapter IV — The Investigation',
      text: [
        'The rain has not stopped. The house is locked. The police will not come until morning at the earliest. You have the drawing-room key, a house full of suspects, and a codicil that someone has killed to suppress.',
        'You may investigate the study where Sir Edmund died, the east wing where the bricked-up window was, the servants\' quarters where Miss Vance has her room, or the cellars beneath the house. You may also speak to any of the three suspects. You will not have time for all of it before something else happens.',
      ],
      choices: [
        {
          id: 'study',
          label: 'Search Sir Edmund\'s study',
          outcome: { destination: 'study_scene' },
        },
        {
          id: 'east_wing',
          label: 'Go to the east wing and the bricked-up window',
          outcome: { destination: 'east_wing_scene' },
        },
        {
          id: 'servants',
          label: 'Visit Miss Vance in the servants\' quarters',
          outcome: { destination: 'vance_scene' },
        },
        {
          id: 'cellars',
          label: 'Descend to the cellars beneath the manor',
          requires: [{ item: 'lighthouse_key', has: false }],
          outcome: { destination: 'cellar_scene' },
        },
        {
          id: 'confront',
          label: 'You have enough. Confront the killer now.',
          requires: [{ flag: 'knows_killer', isSet: true }],
          outcome: { destination: 'confrontation' },
        },
      ],
    },
    study_scene: {
      id: 'study_scene',
      title: 'The Study',
      text: [
        'Sir Edmund\'s study smells of pipe tobacco and neglect. His desk is locked, but the lock is old. On the desk is a Webley revolver, unloaded, and a photograph face-down. You turn it: a young woman, a young man, and a child. The child\'s face has been scratched out with a sharp point, recently — the scratches are bright in the old paper.',
        'In the desk drawer, when you force it, you find Lady Blackbriar\'s diary, and a lighthouse-cellar key, heavy iron, labelled "LB-1903". The diary\'s last entry is dated the night Sir Edmund died. It reads: "E. knows. E. has always known. I will go to the lighthouse tonight and end it there, where it began. If I do not come back, let the house keep the rest."',
      ],
      onEnter: [
        { addItem: 'diary' },
        { addItem: 'lighthouse_key' },
        { addItem: 'photograph' },
        { addItem: 'pistol' },
        { setFlag: 'knows_lighthouse' },
      ],
      choices: [
        {
          id: 'back_to_hub',
          label: 'Take what you have found and return to the investigation',
          outcome: { destination: 'investigation_hub' },
        },
      ],
    },
    east_wing_scene: {
      id: 'east_wing_scene',
      title: 'The East Wing',
      text: [
        'The east wing is cold and the wallpaper is striped with damp. The bricked-up window you saw from outside is in a nursery — a child\'s room, untouched, the bed still made, the toys still on the shelf. A child lived here once. The child was you, or the child was someone who was meant to be you, and the room has been sealed since the day the child was taken from it.',
        'On the mantelpiece is an empty vial, rinsed clean, smelling of bitter almond. The same poison that killed Pirns. It has been here for years. Whoever poisoned Pirns knew where to find it. Whoever knew where to find it knew this house very, very well.',
        'You hear, faintly, from the floor above, the sound of a door closing. Someone was watching you. Someone is always watching, in this house.',
      ],
      onEnter: [{ addItem: 'poison_vial' }, { setFlag: 'found_poison_source' }],
      choices: [
        {
          id: 'pursue',
          label: 'Go upstairs and follow the sound of the door',
          hint: '[Wits 9]',
          skillCheck: {
            stat: 'wits',
            difficulty: 9,
            onSuccess: {
              destination: 'caught_widow',
              effects: [{ setFlag: 'caught_widow_upstairs' }, { setFlag: 'knows_killer' }],
            },
            onFailure: { destination: 'investigation_hub', effects: [{ stat: 'grit', delta: -1 }] },
          },
        },
        {
          id: 'return_hub',
          label: 'Take the vial and return to the investigation',
          outcome: { destination: 'investigation_hub' },
        },
      ],
    },
    caught_widow: {
      id: 'caught_widow',
      title: 'Lady Blackbriar, Upstairs',
      text: [
        'You find her in the gallery above the east wing, standing at a door she has just locked behind her. She does not start when she sees you. She looks at you the way she looked at you in the drawing room — with recognition, with something that is almost grief.',
        '"You should not have come up here," she says. "I was trying to spare you this. The nursery, the vial — I kept them. I could not bring myself to burn them. That is my weakness. I have always kept the evidence of the things I have done, because destroying them felt like pretending they never happened, and they did happen."',
        '"I poisoned Pirns because he was going to read the codicil, and the codicil names you, and if you were named, the Captain would have killed you before morning to take the estate. I poisoned Sir Edmund because he was going to name you publicly, and I could not let him, because the Captain would have killed you then too. I have killed two men to keep you alive, and I do not know if that is a sin or a mercy, and I have been asking the house for fifteen years and the house has never answered."',
      ],
      onEnter: [{ setFlag: 'knows_killer' }, { setFlag: 'widow_confessed' }],
      choices: [
        {
          id: 'to_confrontation',
          label: 'You have the truth. Go to confront the Captain.',
          outcome: { destination: 'confrontation' },
        },
      ],
    },
    vance_scene: {
      id: 'vance_scene',
      title: 'Miss Vance, In Her Room',
      text: [
        'Miss Vance\'s room is small, clean, and full of photographs. She has been at Blackbriar for twenty years. She taught the child who lived in the east wing — the child who was erased. She taught you, if you are that child, though you do not remember her face.',
        '"I wrote the letter," she says, before you can ask. "The invitation. I am E. I have waited fifteen years for you to come back. I could not let them bury the name. I could not let the house forget you."',
        'She tells you what she knows: Lady Blackbriar loved Sir Edmund, and Sir Edmund loved the child\'s mother, who died, and the child was taken and the record struck because the Captain demanded it — the child was a threat to the line. Lady Blackbriar went along with it out of fear, and has regretted it every day since. "She is not a wicked woman," Miss Vance says. "She is a frightened one. The wicked one is the Captain, and he is in the drawing room now, drinking, and he has a pistol in his coat."',
      ],
      onEnter: [{ setFlag: 'knows_vance_letter' }, { setFlag: 'knows_captain_pistol' }, { setFlag: 'knows_killer' }, { stat: 'lore', delta: 2 }],
      choices: [
        {
          id: 'vance_back',
          label: 'Thank her and return to the investigation',
          outcome: { destination: 'investigation_hub' },
        },
      ],
    },
    cellar_scene: {
      id: 'cellar_scene',
      title: 'The Cellars',
      text: [
        'The cellars beneath Blackbriar are older than the manor — the monastery that stood here before was pulled down in the dissolution, and its stones were used to build the house. The cellar is the only part that survives. It is cold, and it is dark, and the walls are wet.',
        'In the deepest room you find a chest, locked, and beside it a ledger. The ledger is a parish record — births, deaths, and one entry, struck through with ink so heavy the page is nearly torn: a birth, fifteen years ago, of a child to Sir Edmund Blackbriar and a woman named only as M. The child was named. The name has been scratched away, but the date is yours. The entry was struck on the order of Captain Blackbriar.',
        'Whoever erased you did it deliberately, and did it with the law in their hand, and did it with the house\'s consent. The house kept this ledger. The house remembered, even when the family did not.',
      ],
      onEnter: [{ setFlag: 'found_parish_record' }, { stat: 'lore', delta: 1 }],
      choices: [
        {
          id: 'cellar_back',
          label: 'Return upstairs with what you have learned',
          outcome: { destination: 'investigation_hub' },
        },
        {
          id: 'cellar_confront',
          label: 'You know enough. Go confront the Captain now',
          requires: [{ flag: 'knows_killer', isSet: true }],
          outcome: { destination: 'confrontation' },
        },
      ],
    },
    confrontation: {
      id: 'confrontation',
      title: 'Chapter V — The Confrontation',
      text: [
        'You return to the drawing room. Pirns is still on the rug. The Captain is still drinking. Lady Blackbriar is still standing by the tea tray. Miss Vance has come down the stairs behind you. The four of them look at you, and you at them, and the house is very quiet, and the rain is very loud, and it is time.',
        'You know who killed Sir Edmund. You know who killed Pirns. You know why the child was erased, and who demanded it. The question is what you do with the truth, in a house that has kept its secrets for two hundred years, with a man who has a pistol in his coat and a woman who has poison in her past and a governess who has waited fifteen years for this night.',
      ],
      choices: [
        {
          id: 'accuse_captain',
          label: 'Name the Captain as the architect of the erasure and let the house decide',
          hint: '[Charm 9]',
          skillCheck: {
            stat: 'charm',
            difficulty: 9,
            onSuccess: {
              destination: 'ending_captain_named',
              effects: [{ setFlag: 'named_captain' }],
            },
            onFailure: { destination: 'ending_chaos' },
          },
        },
        {
          id: 'expose_widow',
          label: 'Reveal Lady Blackbriar as the poisoner — both deaths',
          requires: [{ flag: 'knows_killer', isSet: true }],
          outcome: { destination: 'ending_widow_exposed' },
        },
        {
          id: 'protect_widow',
          label: 'Keep the widow\'s secret. Name the Captain and shield her',
          requires: [{ flag: 'knows_killer', isSet: true }, { flag: 'widow_confessed', isSet: true }],
          outcome: { destination: 'ending_protected' },
        },
        {
          id: 'take_estate',
          label: 'Claim the estate and the name, and let the past stay buried',
          requires: [{ flag: 'admitted_identity', isSet: true }],
          outcome: { destination: 'ending_claimed' },
        },
        {
          id: 'leave_house',
          label: 'Walk out of Blackbriar and leave them to the house',
          outcome: { destination: 'ending_departure' },
        },
      ],
    },
    // ---- ENDINGS ----
    ending_captain_named: {
      id: 'ending_captain_named',
      title: 'Ending — The Captain Is Named',
      text: [
        'You name him. You lay it out, every piece — the parish record, the erased child, the threat to the line, the pistol in his coat. The room turns to him. Miss Vance speaks, and Lady Blackbriar speaks, and the weight of the house, two hundred years of it, settles on the Captain like a stone.',
        'He does not deny it. He finishes his drink. He sets down the glass. "The child was a bastard," he says, "and bastards ruin houses. I did what was necessary. I would do it again." He reaches for his coat, and you reach for yours faster.',
        'The Webley in your hand is steady. The Captain\'s is not. Miss Vance takes the pistol from his coat before he can draw it, and Lady Blackbriar turns her face to the window, and the rain keeps falling, and the house, for the first time in fifteen years, has nothing left to hide. The police will come in the morning. The Captain will be here when they do.',
      ],
      isEnding: true,
      endingType: 'good',
      choices: [],
    },
    ending_widow_exposed: {
      id: 'ending_widow_exposed',
      title: 'Ending — The Widow Is Exposed',
      text: [
        'You tell them what Lady Blackbriar did. You tell them about the vial in the nursery, and the poison in Pirns\'s tea, and Sir Edmund, and the lighthouse. You lay it all out, and the room is silent, and Lady Blackbriar does not deny any of it.',
        '"I did it for the child," she says, and means it, and it does not matter. Miss Vance weeps. The Captain, for once, has nothing to say. The police will come in the morning and take her, and the estate will pass to you, and the house will be yours, and you will live in it with the knowledge that the woman who killed two men to keep you alive will hang for it.',
        'You inherit Blackbriar. You inherit the silence. You inherit the nursery with the vial in it. The house remembers. It remembers you now, too.',
      ],
      isEnding: true,
      endingType: 'neutral',
      choices: [],
    },
    ending_protected: {
      id: 'ending_protected',
      title: 'Ending — The Secret Kept',
      text: [
        'You name the Captain, and you shield the widow. You tell the room about the parish record and the erased child and the pistol. You do not tell them about the vial, or the lighthouse, or what Lady Blackbriar did to protect you. You carry that with you, and she knows you carry it, and the look she gives you is the look of a woman who understands that she is now yours, and will be for as long as you keep her secret.',
        'The Captain is taken when the police come. Lady Blackbriar lives. Miss Vance stays on as governess, though there is no child to govern. You inherit the estate. You live in the house that remembers you. And once a month, you and the widow take tea in the drawing room, and you do not speak of what is in the nursery, and the house keeps the rest, and the rain keeps falling, and the secret keeps, and keeps, and keeps.',
      ],
      isEnding: true,
      endingType: 'neutral',
      choices: [],
    },
    ending_claimed: {
      id: 'ending_claimed',
      title: 'Ending — The Heir Claimed',
      text: [
        'You do not accuse anyone. You do not name the Captain, or expose the widow, or speak of poison or lighthouses. You claim the estate. You claim the name. You let the past stay where the house has buried it.',
        'The Captain leaves that night, in the rain, and is found in the morning at the bottom of the lighthouse stairs, and no one asks too closely how he came to be there. Lady Blackbriar moves to the dower house and is never seen in the manor again. Miss Vance gives her notice and goes to her sister in Bath. Pirns is buried in the village. The house is yours.',
        'You live in it for forty years. You never go to the east wing. You never go to the cellars. You keep the doors locked and the curtains drawn and the past where it belongs, and the house, which has kept its secrets for two hundred years, keeps yours too, and the rain falls, and falls, and the name that was struck from the record is struck into it again, and no one asks how.',
      ],
      isEnding: true,
      endingType: 'neutral',
      choices: [],
    },
    ending_departure: {
      id: 'ending_departure',
      title: 'Ending — The Departure',
      text: [
        'You do not accuse anyone. You do not claim anything. You walk out of the drawing room, through the hall, and out the front door, into the rain, and you do not look back. The gravel drive is long and the rain is cold and your motor is where you left it.',
        'Behind you, Blackbriar keeps its secrets. The Captain, the widow, the governess — they will sort themselves out, or they won\'t, and the house will go on standing either way, and the rain will go on falling, and the child who was erased will stay erased, because you have chosen not to be named, and that is a choice too, and it is yours.',
        'You drive away. You drive until the manor is behind you and the road is ahead of you and the rain has washed the bitter almond off the air. You will not come back. The house will remember you anyway. It remembers everything. That is what houses do.',
      ],
      isEnding: true,
      endingType: 'neutral',
      choices: [],
    },
    ending_chaos: {
      id: 'ending_chaos',
      title: 'Ending — Chaos In The Drawing Room',
      text: [
        'You try to name the Captain, but you have not gathered enough, and the room will not follow you. The Captain stands, and the pistol is in his hand, and he is not interested in what the house remembers. Lady Blackbriar screams. Miss Vance throws herself between you and the shot. The Webley goes off. The drawing-room window shatters. The rain comes in.',
        'When the police arrive in the morning they find a dead governess, a dying captain, a widow in shock, and a stranger — you — standing in the middle of it all with a gun in your hand and no explanation that anyone will believe. The inquest is brief. The verdict is unfortunate. The house keeps the truth, as it always has, and the rain keeps falling, and the name in the codicil is never read.',
      ],
      isEnding: true,
      endingType: 'bad',
      choices: [],
    },
  },
};
