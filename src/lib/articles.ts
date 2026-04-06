import { images } from "@/lib/assets";

export type ArticleItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
};

export const ARTICLES: ArticleItem[] = [
  {
    id: "1",
    title: "Поздоровайся с MacBook Neo от Apple уже сейчас",
    description:
      "Новый MacBook от Apple отличается прочным алюминиевым корпусом, потрясающим 13-дюй...",
    date: "09/03/2026",
    image: images.article1,
  },
  {
    id: "2",
    title: "Представляем новый MacBook Air от компании Elbrus",
    description:
      "Новый MacBook от Elbrus: прочный корпус из титана, экран Retina XDR 15 дюймов и мощный...",
    date: "15/08/2024",
    image: images.article2,
  },
  {
    id: "3",
    title: "Встречайте новый iTab Pro от Texet",
    description:
      "Новый iTab Pro от Texet: прочный корпус из магниевого сплава, экран 14 дюймов OLED и бы...",
    date: "21/01/2025",
    image: images.article3,
  },
  {
    id: "4",
    title: "Встречайте новый iBook Pro от Digma",
    description:
      "Новый iBook Pro от Digma: корпус из карбона, экран Retina HD 14 дюймов и мощный процессор...",
    date: "14/07/2024",
    image: images.article4,
  },
  {
    id: "5",
    title: "Apple Watch Ultra: для кого модель с большим корпусом",
    description:
      "Разбираемся, кому подойдёт самый крупный Apple Watch, какие сенсоры важны в путешествиях и спорте...",
    date: "02/11/2025",
    image: images.product2,
  },
  {
    id: "6",
    title: "iPhone и экосистема аксессуаров: с чего начать",
    description:
      "Чехлы, MagSafe, наушники и умный дом — как собрать удобный набор вокруг одного смартфона...",
    date: "18/09/2025",
    image: images.product3,
  },
  {
    id: "7",
    title: "iPad для учёбы и работы: какой формат выбрать в 2025 году",
    description:
      "Сравниваем iPad Air и iPad Pro для заметок, видео и многозадачности: экран, память, клавиатуры...",
    date: "05/06/2025",
    image: images.product4,
  },
  {
    id: "8",
    title: "Гарантия и сервис при покупке техники Apple",
    description:
      "Что входит в гарантию магазина, как оформить обмен и куда обращаться по вопросам ремонта...",
    date: "30/01/2025",
    image: images.macbook,
  },
];
