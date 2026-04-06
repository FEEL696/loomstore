import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Loom Store",
  description:
    "Как мы обрабатываем персональные данные посетителей и покупателей Loom Store.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[720px] px-[15px] py-10 md:px-6 md:py-12 lg:px-8">
        <nav
          className="mb-6 text-[14px] text-[#878787]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-[#221f1f]">
            Главная
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">
            Политика конфиденциальности
          </span>
        </nav>

        <h1
          className="mb-8 text-[28px] font-semibold leading-tight text-[#221f1f] md:text-[32px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Политика конфиденциальности
        </h1>

        <div
          className="space-y-5 text-[15px] leading-relaxed text-[#3f3f3f] md:text-[16px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          <p>
            Настоящая политика описывает общие принципы обработки информации при
            использовании сайта Loom Store. Мы стремимся собирать только те
            данные, которые необходимы для обработки заказов, обратной связи и
            улучшения сервиса.
          </p>
          <p>
            Персональные данные (например, имя, телефон, адрес доставки),
            указанные вами при оформлении заказа или в формах на сайте,
            используются исключительно для связи с вами, исполнения договора
            купли-продажи и информирования о статусе заказа, если это требуется.
          </p>
          <p>
            Мы не передаём ваши данные третьим лицам в маркетинговых целях без
            вашего согласия. Техническая информация (тип браузера, IP-адрес в
            обезличенном виде) может обрабатываться для обеспечения работы и
            безопасности сайта. Актуальные условия и контакты для вопросов по
            персональным данным указаны на странице «Контакты».
          </p>
        </div>
      </div>
    </div>
  );
}
