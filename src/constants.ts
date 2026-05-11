import { Task, Scenario, Award } from './types';

export const TASKS: Task[] = [
  {
    id: 0,
    icon: '👋',
    title: 'Özünü tanıt',
    description: 'Adın, yaşın və sevdiyin şeyi de',
    duration: '30 saniyə',
  },
  {
    id: 1,
    icon: '🍎',
    title: 'Sevimli yeməyin',
    description: 'Ən sevdiyin yeməyi təsvir et',
    duration: '45 saniyə',
  },
  {
    id: 2,
    icon: '☀️',
    title: 'Ən yaxşı günüm',
    description: 'Bu həftənin ən gözəl anını danış',
    duration: '60 saniyə',
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    text: 'Sən yeni bir dostla tanış olmaq istəyirsən. Hansı addımı atardın?',
    options: [
      {
        text: 'Gözləyərdim ki, o gəlsin',
        isCorrect: false,
        feedback: 'Gözləmək olar, amma özün yaxınlaşsan, daha cəsarətli görünərsən! 😊',
      },
      {
        text: 'Gülümsəyib "Salam" deyərdim',
        isCorrect: true,
        feedback: 'Əla! Sadə bir "Salam" hər zaman ən yaxşı başlanğıcdır. 🌟',
      },
      {
        text: 'Heç nə demədən uzaqlaşardım',
        isCorrect: false,
        feedback: 'Uzaqlaşsan, yeni bir dost qazanma şansını itirə bilərsən. Gəl yenidən cəhd edək! 💪',
      },
    ],
  },
  {
    id: 2,
    text: 'Müəllim sual verir və sən cavabı bilirsən, amma qorxursan. Nə edərsən?',
    options: [
      {
        text: 'Dərin nəfəs alıb əlimi qaldıraram',
        isCorrect: true,
        feedback: 'Düzdür! Qorxu keçicidir, bildiyin bilik isə sənin gücündür. 🦁',
      },
      {
        text: 'Səssiz oturub başqasının cavabını gözləyərəm',
        isCorrect: false,
        feedback: 'Sənin fikrin çox dəyərlidir, paylaşmaqdan çəkinmə! ✨',
      },
    ],
  },
];

export const AWARDS: Award[] = [
  {
    id: 1,
    icon: '🥉',
    title: 'İlk addım',
    description: 'İlk dəfə tətbiqdə məşq etdiyin üçün',
    requiredStars: 1,
  },
  {
    id: 2,
    icon: '🥈',
    title: 'Cəsur Ürək',
    description: '5 ulduz topladığın üçün',
    requiredStars: 5,
  },
  {
    id: 3,
    icon: '🥇',
    title: 'Nitq Ustası',
    description: 'Bütün tapşırıqları tamamladığın üçün',
    requiredStars: 10,
  },
];
