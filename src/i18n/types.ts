import type { AccessoryId, DragonAccessoryId, DragonColor, UnicornColor } from '../types'

export type Language = 'es' | 'ca'

export interface Translations {
  langName: string
  langToggleLabel: string

  home: {
    title: string
    subtitle: string
    changeUser: string
    practiceBtn: string
    progressiveBtn: string
    tablesBtn: string
    unicornBtn: string
    creatureBtn: string
  }

  userSelect: {
    title: string
    subtitle: string
    loading: string
    noPlayers: string
    newPlayerBtn: string
    pinTitle: (args: { name: string }) => string
    enterPin: string
    wrongPin: string
    cancel: string
    deleteTitle: (args: { name: string }) => string
    deleteConfirm: (args: { name: string }) => string
    deletePermanent: string
    deleteBtn: string
    newPlayerModalTitle: string
    chooseCreature: string
    unicornChoice: string
    dragonChoice: string
    namePlaceholder: string
    addPin: string
    pinPlaceholder: string
    pinLengthError: string
    nameTakenError: string
    createError: string
    connectError: string
    playBtn: string
  }

  freeMode: {
    title: string
    random: string
    ordered: string
    easy: string
    hard: string
    selectTable: string
    table: (args: { n: number }) => string
  }

  progressiveMode: {
    title: string
    subtitle: string
    easy: string
    hard: string
  }

  practiceSession: {
    table: (args: { n: number }) => string
    howMuch: string
    correct: string
    wrong: (args: { answer: number }) => string
    score: (args: { correct: number; current: number }) => string
  }

  sessionResults: {
    title: (args: { correct: number }) => string
    table: (args: { n: number }) => string
    hardBadge: string
    repeat: string
    anotherTable: string
    viewMap: string
    home: string
    newUnlock: string
    great: string
  }

  unicornCustomizer: {
    title: string
    unicornTab: string
    dragonTab: string
    bodyColor: string
    maneColor: string
    accessories: string
    hardSection: string
    hardSectionSubtitle: string
    equipped: string
    scaleColor: string
    bellyColor: string
    dragonAccessories: string
    dragonHardSection: string
    dragonHardSectionSubtitle: string
  }

  tableReference: {
    title: string
    selectTable: string
    table: (args: { n: number }) => string
    ordered: string
    random: string
  }

  progressMap: {
    table: (args: { n: number }) => string
  }

  accessoryLabel: Record<AccessoryId, string>
  accessoryUnlockHint: Record<AccessoryId, string>
  colorLabel: Record<UnicornColor, string>
  hardColorUnlockHint: Partial<Record<UnicornColor, string>>
  dragonAccessoryLabel: Record<DragonAccessoryId, string>
  dragonAccessoryUnlockHint: Record<DragonAccessoryId, string>
  dragonColorLabel: Record<DragonColor, string>
  dragonHardColorUnlockHint: Partial<Record<DragonColor, string>>
}
