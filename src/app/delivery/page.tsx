import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[960px] px-[15px] py-6 md:px-6 md:py-8">
        <nav
          className="mb-4 text-[14px] text-[#878787]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-[#221f1f]">
            Главная
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">Доставка и оплата</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">Доставка и оплата</h1>

        <div
          className="space-y-6 text-[15px] leading-relaxed text-[#3f3f3f]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          <section className="space-y-3">
            <h2 className="text-[18px] font-semibold text-[#221f1f]">
              Способы оплаты
            </h2>
            <p>
              <strong className="text-[#221f1f]">Предоплата на банковские реквизиты.</strong>{" "}
              При полной предоплате сумма заказа уменьшается на 5% от цены в
              каталоге.
            </p>
            <p>
              <strong className="text-[#221f1f]">Наложенный платёж.</strong> Оплата при
              получении: к сумме при предоплате добавляется 5%. Общая стоимость
              отправки наложенным платежом выше ввиду вероятности возврата
              товара — мы закладываем это в стоимость.
            </p>
            <p>
              <strong className="text-[#221f1f]">Криптовалюта USDT TRC-20.</strong> После
              выбора этого способа открывается переход на платёжный шлюз
              Хелекет.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-semibold text-[#221f1f]">
              Доставка
            </h2>
            <p>
              <strong className="text-[#221f1f]">Почта — до отделения.</strong> Укажите город
              и отделение при оформлении заказа.
            </p>
            <p>
              <strong className="text-[#221f1f]">Курьер — до двери.</strong> Доступно не при
              всех способах оплаты: при наложенном платеже курьерская доставка
              недоступна. Укажите город и полный адрес.
            </p>
            <p className="text-[#949494]">
              Точные сроки и стоимость согласуются с менеджером после оформления
              заказа.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
