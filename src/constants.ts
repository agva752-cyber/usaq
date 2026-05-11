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
      {
        text: 'Cavabı bilsəm də bilmədiyimi deyərəm',
        isCorrect: false,
        feedback: 'Uğur qazanmaq üçün cəsarət lazımdır. Növbəti dəfə özünə inan! 💪',
      },
    ],
  },
  {
    id: 3,
    text: 'Yarışda uduzduğunu düşünürsən. Növbəti addımın nə olar?',
    options: [
      {
        text: 'Ağlayıb yarışdan çıxaram',
        isCorrect: false,
        feedback: 'Məğlubiyyət öyrənməyin bir hissəsidir. Əsas odur ki, dayanmayasan! 🌱',
      },
      {
        text: 'Qalibi təbrik edib daha çox məşq edərəm',
        isCorrect: true,
        feedback: 'Böyük bir cəsarət! Əsl çempionlar belə edir. 🏆',
      },
      {
        text: 'Bir daha yarışa qatılmaram',
        isCorrect: false,
        feedback: 'Hər məğlubiyyət bir təcrübədir. Özünə şans ver! 💫',
      },
    ],
  },
  {
    id: 4,
    text: 'Səhnədə şeir deyərkən misranı unutmusan. Nə edərsən?',
    options: [
      {
        text: 'Gözləyib davam etməyə çalışaram',
        isCorrect: true,
        feedback: 'Əla! Sakit qalmaq və davam etmək əsl cəsarətdir. 🎤',
      },
      {
        text: 'Səhnədən qaçıb gedərəm',
        isCorrect: false,
        feedback: 'Hamı unuda bilər, bu normaldır. Dayanıb xatırlamağa çalış! ✨',
      },
      {
        text: 'Ağlayaram',
        isCorrect: false,
        feedback: 'Kədərlənmə, mehriban tamaşaçılar sənə dəstək olacaq. Özünə inan! ❤️',
      },
    ],
  },
  {
    id: 5,
    text: 'Dostun səndən xoşlamadığın bir şeyi etməyi xahiş edir. Nə deyərsən?',
    options: [
      {
        text: '"Yox" deməkdən qorxub edərəm',
        isCorrect: false,
        feedback: 'Öz fikrini demək çox vacibdir. Özünə sadiq qal! 🌈',
      },
      {
        text: 'Nəzakətlə "Yox, mən bunu istəmirəm" deyərəm',
        isCorrect: true,
        feedback: 'Möhtəşəm! Öz sərhədlərini qorumaq böyük bir gücdür. 🛡️',
      },
      {
        text: 'Mübahisə edib dostluğumu bitirərəm',
        isCorrect: false,
        feedback: 'Sakit şəkildə "yox" demək daha yaxşıdır. Danışaraq həll et! 🤝',
      },
    ],
  },
  {
    id: 6,
    text: 'Yeni bir idman növünə başlamaq istəyirsən, amma çətin görünür. Nə edərsən?',
    options: [
      {
        text: 'Çətin olduğu üçün başlamaram',
        isCorrect: false,
        feedback: 'Hər şey başlanğıcda çətindir. Cəhd etməyə dəyər! ⚽',
      },
      {
        text: 'Bir dərslik yoxlayıb qərar verərəm',
        isCorrect: true,
        feedback: 'Doğrudur! Bir şans vermək cəsarətli bir addımdır. 🧗',
      },
      {
        text: 'Başqalarının necə etdiyini izləyib qaçaram',
        isCorrect: false,
        feedback: 'Sən də bacara bilərsən! Özünə inan və başla. 🚀',
      },
    ],
  },
  {
    id: 7,
    text: 'Qaranlıq otağa girməyə qorxursan. Necə davranarsan?',
    options: [
      {
        text: 'Qaçıb valideynlərimi çağıraram',
        isCorrect: false,
        feedback: 'Dəstək istəmək olar, amma özün də yoxlaya bilərsən! 🔦',
      },
      {
        text: 'İşığı yandırıb yavaşca daxil olaram',
        isCorrect: true,
        feedback: 'Afərin! Qorxunun üzərinə getmək onu yox edir. 🕯️',
      },
      {
        text: 'Heç vaxt o otağa girmərəm',
        isCorrect: false,
        feedback: 'Orada qorxulu heç nə yoxdur, sən daha güclüsən! 💪',
      },
    ],
  },
  {
    id: 8,
    text: 'Oyuncağını qırmısan və valideynlərinə deməkdən qorxursan. Nə edərsən?',
    options: [
      {
        text: 'Gizlədib heç nə demərəm',
        isCorrect: false,
        feedback: 'Həqiqəti demək həmişə daha yaxşıdır. Dürüst ol! 🧩',
      },
      {
        text: 'Gedib həqiqəti danışar və üzr istəyərəm',
        isCorrect: true,
        feedback: 'Ən böyük cəsarət dürüstlükdür. Afərin sənə! 💖',
      },
      {
        text: 'Başqasının qırdığını deyərəm',
        isCorrect: false,
        feedback: 'Dürüstlük hər şeydən ucadır. Səhvini etiraf etmək böyüklükdür. ✨',
      },
    ],
  },
  {
    id: 9,
    text: 'Yolda tanımadığın bir uşaq sənə salam verir. Nə edərsən?',
    options: [
      {
        text: 'Qaçıb gizlənərəm',
        isCorrect: false,
        feedback: 'Qorxmağa ehtiyac yoxdur, amma ehtiyatlı olub Salam deyə bilərsən. 👋',
      },
      {
        text: 'Mən də Salam deyib gülümsəyərəm',
        isCorrect: true,
        feedback: 'Nəzakətli və cəsur bir davranışdır! 😊',
      },
      {
        text: 'Qışqıraram',
        isCorrect: false,
        feedback: 'Sakit qal və sadəcə salamla. Hər şey qaydasındadır. ✨',
      },
    ],
  },
  {
    id: 10,
    text: 'Yeni bir yeməyin dadına baxmaqdan qorxursan. Nə edərsən?',
    options: [
      {
        text: 'Dadına baxmadan "yemərəm" deyərəm',
        isCorrect: false,
        feedback: 'Yeni dadlar kəşf etmək maraqlıdır! Bir tikə yoxla. 🍲',
      },
      {
        text: 'Kiçik bir hissəsini dadıb baxaram',
        isCorrect: true,
        feedback: 'Bəli! Yeniliyə açıq olmaq cəsarətdir. Dadlı ola bilər! 🍓',
      },
      {
        text: 'Ağzımı bağlayıb qaçaram',
        isCorrect: false,
        feedback: 'Heç olmasa qoxusuna bax! Bəlkə çox sevəcəksən. ✨',
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
