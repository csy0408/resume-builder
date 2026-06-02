import { create } from 'zustand';
import type { UserProfile, BasicInfo, Experience, ExperienceVariant, Education, Skill } from '../types/profile';
import { EMPTY_PROFILE } from '../types/profile';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'profile';

interface ProfileState {
  profile: UserProfile;
  updateBasicInfo: (info: Partial<BasicInfo>) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addVariant: (expId: string, variant: ExperienceVariant) => void;
  updateVariant: (expId: string, variantId: string, variant: Partial<ExperienceVariant>) => void;
  removeVariant: (expId: string, variantId: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  importProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
}

function persist(profile: UserProfile) {
  saveToStorage(STORAGE_KEY, { ...profile, updatedAt: new Date().toISOString() });
}

let idCounter = 0;
function genId(): string {
  idCounter += 1;
  return `${Date.now()}-${idCounter}`;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: loadFromStorage<UserProfile>(STORAGE_KEY, EMPTY_PROFILE),

  updateBasicInfo: (info) =>
    set((s) => {
      const profile = { ...s.profile, basic: { ...s.profile.basic, ...info } };
      persist(profile);
      return { profile };
    }),

  addEducation: (edu) =>
    set((s) => {
      const profile = { ...s.profile, education: [...s.profile.education, { ...edu, id: genId() }] };
      persist(profile);
      return { profile };
    }),

  updateEducation: (id, edu) =>
    set((s) => {
      const profile = {
        ...s.profile,
        education: s.profile.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
      };
      persist(profile);
      return { profile };
    }),

  removeEducation: (id) =>
    set((s) => {
      const profile = { ...s.profile, education: s.profile.education.filter((e) => e.id !== id) };
      persist(profile);
      return { profile };
    }),

  addExperience: (exp) =>
    set((s) => {
      const profile = {
        ...s.profile,
        experiences: [...s.profile.experiences, { ...exp, id: genId(), verified: false, variants: [] }],
      };
      persist(profile);
      return { profile };
    }),

  updateExperience: (id, exp) =>
    set((s) => {
      const profile = {
        ...s.profile,
        experiences: s.profile.experiences.map((e) => (e.id === id ? { ...e, ...exp } : e)),
      };
      persist(profile);
      return { profile };
    }),

  removeExperience: (id) =>
    set((s) => {
      const profile = {
        ...s.profile,
        experiences: s.profile.experiences.filter((e) => e.id !== id),
      };
      persist(profile);
      return { profile };
    }),

  addVariant: (expId, variant) =>
    set((s) => {
      const profile = {
        ...s.profile,
        experiences: s.profile.experiences.map((e) =>
          e.id === expId
            ? { ...e, variants: [...e.variants, { ...variant, id: genId() }] }
            : e,
        ),
      };
      persist(profile);
      return { profile };
    }),

  updateVariant: (expId, variantId, variant) =>
    set((s) => {
      const profile = {
        ...s.profile,
        experiences: s.profile.experiences.map((e) =>
          e.id === expId
            ? {
                ...e,
                variants: e.variants.map((v) => (v.id === variantId ? { ...v, ...variant } : v)),
              }
            : e,
        ),
      };
      persist(profile);
      return { profile };
    }),

  removeVariant: (expId, variantId) =>
    set((s) => {
      const profile = {
        ...s.profile,
        experiences: s.profile.experiences.map((e) =>
          e.id === expId
            ? { ...e, variants: e.variants.filter((v) => v.id !== variantId) }
            : e,
        ),
      };
      persist(profile);
      return { profile };
    }),

  addSkill: (skill) =>
    set((s) => {
      const profile = { ...s.profile, skills: [...s.profile.skills, { ...skill, id: genId() }] };
      persist(profile);
      return { profile };
    }),

  updateSkill: (id, skill) =>
    set((s) => {
      const profile = {
        ...s.profile,
        skills: s.profile.skills.map((sk) => (sk.id === id ? { ...sk, ...skill } : sk)),
      };
      persist(profile);
      return { profile };
    }),

  removeSkill: (id) =>
    set((s) => {
      const profile = { ...s.profile, skills: s.profile.skills.filter((sk) => sk.id !== id) };
      persist(profile);
      return { profile };
    }),

  importProfile: (profile) => {
    persist(profile);
    set({ profile });
  },

  resetProfile: () => {
    persist(EMPTY_PROFILE);
    set({ profile: EMPTY_PROFILE });
  },
}));
