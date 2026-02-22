# Analytics Operations (RU/RS/EN)

Короткий регламент по аналитике конверсий для сайта бюро. Цель: управлять заявками и качеством лидов, а не только трафиком.

## 1) Цель и главная метрика

- Главная бизнес-метрика: количество и доля `qualified leads` по `ru` / `rs` / `en`.
- Фокус: воронка `контент/витрина -> CTA -> бриф -> успешная отправка`.

## 2) События (MVP)

Обязательные события:
1. `cta_click`
2. `brief_start`
3. `brief_submit`
4. `brief_success`
5. `brief_error`
6. `contact_click`

Обязательные параметры (по возможности для каждого события):
1. `site_lang` (`ru`, `rs`, `en`)
2. `page_type` (`home`, `services`, `service_page`, `blog`, `post`, `brief`, `contacts`)
3. `page_path`
4. `cta_id` (для CTA)
5. `device_type`
6. `utm_source`, `utm_medium`, `utm_campaign`
7. `referrer_domain`

## 3) KPI (минимум)

1. `CTA Click Rate` = `cta_click / sessions`
2. `Brief Start Rate` = `brief_start / cta_click`
3. `Brief Completion Rate` = `brief_success / brief_start`
4. `Brief Error Rate` = `brief_error / brief_submit`
5. `Contact Click Rate` = `contact_click / sessions`
6. `Lead Rate` = `brief_success / sessions`
7. `Leads by Language` = `brief_success` по `site_lang`

Примечание: без платного трафика не упираемся в `CPL`, смотрим эффективность органики/direct/referral.

## 4) Воронки, которые смотрим

1. Основная заявка: `session -> cta_click -> brief_start -> brief_submit -> brief_success`
2. Прямой контакт: `session -> contact_click -> ручная квалификация`
3. Контентная: `post session -> internal click/cta -> brief_start -> brief_success`
4. Языковая: отдельная воронка для `ru`, `rs`, `en`

## 5) Алерты (от rolling baseline 4 недели)

1. `CTA Click Rate` упал >20% (по любому языку)
2. `Brief Start Rate` упал >15%
3. `Brief Completion Rate` упал >15%
4. `Brief Error Rate` >5% за день или >3% три дня подряд
5. `mobile` конвертит хуже `desktop` более чем на 30%
6. Любой язык просел по `Lead Rate` >25%
7. Рост трафика без роста `brief_start` (нецелевой трафик / сломан CTA)

## 6) Операционный ритм

- Понедельник (20 мин): KPI за неделю + алерты + здоровье формы (`brief_error`)
- Среда (30 мин): разбор воронки по `ru/rs/en` и устройствам
- Пятница (30 мин): 1-2 правки на следующую неделю с целевой метрикой
- Последний рабочий день месяца (60 мин): месячный разбор по языкам и план правок

## 7) Правило принятия решений

1. Найти самый слабый шаг воронки.
2. Сформулировать одну проверяемую гипотезу.
3. Внести 1-2 изменения за итерацию.
4. Сравнить с baseline через 1-2 недели.
5. Закрепить или заменить гипотезу.

## 8) Мини-журнал после каждой итерации

Фиксировать:
1. Дату
2. Просевшую/выросшую метрику
3. Гипотезу
4. Что изменили
5. Результат через 7-14 дней
6. Следующий шаг

## 9) GA4 + GTM (короткий чеклист)

Что уже предполагается в коде:
- GTM контейнер подключается через `site.gtm_container_id`
- события отправляются в `dataLayer`
- передаются `site_lang`, `page_type`, `page_path` (и прикладные параметры событий)

Что сделать в Google:
1. Создать `GA4` property + Web Data Stream
2. Создать контейнер `GTM`
3. Указать `gtm_container_id` в `_config.base.yml`
4. В GTM создать `GA4 Configuration` тег
5. Завести Custom Event triggers для:
   - `cta_click`, `contact_click`, `brief_start`, `brief_submit`, `brief_success`, `brief_error`
6. Создать `GA4 Event` теги с передачей параметров из `dataLayer`
7. Отметить `brief_success` как Conversion
8. Проверить в GTM Preview и GA4 Realtime
9. Опубликовать контейнер

Минимум отчетов в GA4:
1. Funnel exploration: `session_start -> cta_click -> brief_start -> brief_submit -> brief_success`
2. Сравнения по `site_lang`
3. Сравнения по устройствам
4. Виджет по `brief_error`

## 10) Ограничения и замечания

- `GA4` и `GTM` обычно бесплатны для текущего объема.
- Платный `GA360` на этом этапе не нужен.
- Основная стоимость сейчас: время на настройку и дисциплина регулярного просмотра.
