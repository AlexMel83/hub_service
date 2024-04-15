/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const coworkingsData = [
  {
    coworking_name: "Artinov Group",
    address: "м. Вінниця, вул. Миколи Оводова, 22",
    phone: "+38 093 226-22-32",
    email: "artinov.space@gmail.com",
    coworking_photo: "./uploads/public/main-photo-1.jpg",
    description:
      "Зручне розташування нашого простору дозволяє максимально швидко добиратись як до нас, так і до найважливіших локацій міста. Ми знаходимось у самому серці міста — біля Водонапірної вежі на Європейській площі. У нашому просторі ви маєте великий вибір локацій, які ви можете зарезервувати для себе - проведення днів народжень, корпоративів та інших персональних заходів. У нас є дві окремі та зручні коворкінг-зони. Перша знаходиться на другому поверсі Артинова, друга на першому (колишня локація кінозалу). Тут кожен коворкер отримує своє персональне робоче місце, шафу для зберігання особистих речей та, окремі від загального простору, кухню, штурмову, дві скайп-кімнати, гардеробну, вбиральню та душову.",
    user_id: 1,
    published: true,
  },
  {
    coworking_name: "iHUB",
    address: "м. Вінниця, вул. Пушкіна, 11",
    phone: "+38 050 426-16-16",
    email: "post@ihub.world",
    coworking_photo: "./uploads/public/main-photo-2.jpg",
    description:
      "iHUB – це місце, де інновації відбуваються щодня. Молоді да досвідчені підприємці працюють, спілкуються та творять у приміщеннях сучасного коворкінгу, поєднаного з історичною архітектурою у самому центрі міста. Просторий open space, приватні офіси, оснащенні технікою дизайнерські переговорні кімнати, зони для відпочинку та зали для івентів – ми надаємо все, що необхідно для розвитку вашого стартапу. У нас тільки актуальні тематики заходів та топові спікери. Нудьгувати не прийдеться, адже Ви зможете знайти івенти на будь-який смак: майстер-класи, воркшопи, хакатони, зустрічі з інвесторами, пітчинги та ще багато іншого. iHUB не просто ком’юніті – це сім’я, де Ви можете приєднатись до найталановитіших підприємців та стартапів, знайти собі партнерів чи клієнтів, співробітників та інвесторів. Обирайте один з наших сервісів та програм, що допоможуть злетіти Вашому проєкту.",
    user_id: 2,
    published: true,
  },
  {
    coworking_name: "Miro Space",
    address: "м. Вінниця, вул. Келецька, 57",
    phone: "+38 093 503-01-01",
    email: "mirospace.ua@gmail.com",
    coworking_photo: "./uploads/public/main-photo-3.jpg",
    description:
      "Miro Space  Epicenter of innovations. Наша ціль  – створити iнновацiйне середовище i творчу атмосферу для роботи з метою розвитку нових технологiй в сферi блокчейну та IT.  Miro Space  – робочий простiр iнновацiй, в якому поєднали дiловий досвiд створення офiсiв з творчим пiдходом. Це мiсце для втiлення проєктiв, дiлового спiлкування, корисних подiй i знайомств, середовище для розвитку i примноження.",
    user_id: 3,
    published: true,
  },
  {
    coworking_name: "CHERDAK SPASE",
    address: "м. Вінниця, вул. Соборна, 24",
    phone: "+38 097 902-88-88",
    email: "info@cherdak-space.com",
    coworking_photo: "./uploads/public/main-photo-4.jpg",
    description:
      "Простори для роботи та івентів. Ми забезпечуємо ваш робочий простір усім необхідним.",
    user_id: 4,
    published: true,
  },
  {
    coworking_name: "Ume place",
    address: "м. Вінниця, просп. Космонавтів, 30 А",
    phone: "+38 068 787-49-23",
    email: "info@ume.place",
    coworking_photo: "./uploads/public/main-photo-5.jpg",
    description:
      "Ume.Place — це про приватність, комфорт та безпеку. Ми коворкінг закритого типу з великою кількістю простору та можливостей. Івент-менеджер допоможе організувати події, оператор та монтажер — створити контент, а наші адміністратори попіклуються про твій комфорт.",
    user_id: 5,
    published: true,
  },
  {
    coworking_name: "EduHUB",
    address: "м. Вінниця, Героїв поліції, 28",
    phone: "+38 067 431-74-24",
    email: "",
    coworking_photo: "./uploads/public/main-photo-6.jpg",
    description:
      "EduHUB - це освітній креативний простір в центрі міста, щоб працювати, навчатись і надихатися, генерувати та втілювати нові і прогресивні ідеї, ділитися власними досягненнями та знаходити креативних друзів-однодумців. Організувати тематичні івенти, творчі й продуктивні посиденьки, семінари, майстер-класи, навчальні заняття, лекції, працювати над стартапами, креативити й надихатися за філіжанкою запашної кави.",
    user_id: 6,
    published: true,
  },
];

const spacesData = [
  {
    space_name: "OpenSpace",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-1-space-1.jpg",
    amount: 180,
    first_price: 50,
    last_price: 3000,
    coworking_id: 1,
  },
  {
    space_name: "Переговорна",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-1-space-2.jpg",
    amount: 10,
    first_price: 50,
    last_price: 3000,
    coworking_id: 1,
  },
  {
    space_name: "Коворкінг-зона 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-1-space-3.jpg",
    amount: 50,
    first_price: 50,
    last_price: 3000,
    coworking_id: 1,
  },
  {
    space_name: "Коворкінг-зона 2",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-1-space-4.jpg",
    amount: 50,
    first_price: 50,
    last_price: 3000,
    coworking_id: 1,
  },
  {
    space_name: "Дві скайп-кімнати",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-1-space-5.jpg",
    amount: 4,
    first_price: 50,
    last_price: 3000,
    coworking_id: 1,
  },
  {
    space_name: "Conference Space",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-2-space-1.jpg",
    amount: 30,
    first_price: 50,
    last_price: 3000,
    coworking_id: 2,
  },
  {
    space_name: "Робочі місця та персональні офіси",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-2-space-2.jpg",
    amount: 20,
    first_price: 50,
    last_price: 3000,
    coworking_id: 2,
  },
  {
    space_name: "Переговорні кімнати",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-2-space-3.jpg",
    amount: 8,
    first_price: 50,
    last_price: 3000,
    coworking_id: 2,
  },
  {
    space_name: "Конференц зал",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-2-space-4.jpg",
    amount: 20,
    first_price: 50,
    last_price: 3000,
    coworking_id: 2,
  },
  {
    space_name: "FLEX-офіси для команд",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-2-space-5.jpg",
    amount: 10,
    first_price: 50,
    last_price: 3000,
    coworking_id: 2,
  },
  {
    space_name: "Хромакей Студія",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-1.jpg",
    amount: 2,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "Скайп-руми",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-2.jpg",
    amount: 2,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "Переговорні кімнати",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-3.jpg",
    amount: 10,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "Конференц зал",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-4.jpg",
    amount: 10,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "Навчальний клас",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-5.jpg",
    amount: 24,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "Малий конференц-зал",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-6.jpg",
    amount: 24,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "Робочi мiсця",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-7.jpg",
    amount: 10,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "Великий конференц-зал",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-3-space-8.jpg",
    amount: 124,
    first_price: 50,
    last_price: 3000,
    coworking_id: 3,
  },
  {
    space_name: "SPACE",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-4-space-1.jpg",
    amount: 80,
    first_price: 50,
    last_price: 3000,
    coworking_id: 4,
  },
  {
    space_name: "OPEN SPACE",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-4-space-2.jpg",
    amount: 20,
    first_price: 50,
    last_price: 3000,
    coworking_id: 4,
  },
  {
    space_name: "MEETING ROOM",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-4-space-3.jpg",
    amount: 20,
    first_price: 50,
    last_price: 3000,
    coworking_id: 4,
  },
  {
    space_name: "LOUNGE ZONE",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-4-space-4.jpg",
    amount: 20,
    first_price: 50,
    last_price: 3000,
    coworking_id: 4,
  },
  {
    space_name: "FLEX-офіси для команд",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-4-space-5.jpg",
    amount: 24,
    first_price: 50,
    last_price: 3000,
    coworking_id: 4,
  },
  {
    space_name: "CALL ROOM",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-4-space-6.jpg",
    amount: 4,
    first_price: 50,
    last_price: 3000,
    coworking_id: 4,
  },
  {
    space_name: "BUSINESS ROOM",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-4-space-7.jpg",
    amount: 24,
    first_price: 50,
    last_price: 3000,
    coworking_id: 4,
  },
  {
    space_name: "Sea room",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-6-space-1.jpg",
    amount: 20,
    first_price: 50,
    last_price: 3000,
    coworking_id: 6,
  },
  {
    space_name: "Magenta",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-6-space-2.jpg",
    amount: 10,
    first_price: 50,
    last_price: 3000,
    coworking_id: 6,
  },
  {
    space_name: "Hack room",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-6-space-3.jpg",
    amount: 20,
    first_price: 50,
    last_price: 3000,
    coworking_id: 6,
  },
  {
    space_name: "Square",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde et, odit architecto reprehenderit id officia debitis eum distinctio, quisquam voluptatibus dolore. Iste molestias, natus nam sed ullam quae ad soluta.",
    space_photo: "./uploads/public/cow-6-space-4.jpg",
    amount: 10,
    first_price: 50,
    last_price: 3000,
    coworking_id: 6,
  },
];

const advantagesData = [
  {
    name: "Генератор",
    description: "у просторі забезпечується резервне енергоживлення",
    icon: "uploads/public/advantages/generator.svg",
  },
  {
    name: "Дошка",
    description: "Простір має інтерактивну дошку для проведення презентацій",
    icon: "uploads/public/advantages/board.svg",
  },
  {
    name: "Кімната відпочинку",
    description: "У прросторі є кімната відпочинку для відвідувачів",
    icon: "uploads/public/advantages/restroom.svg",
  },
  {
    name: "Кухня",
    description:
      "Простір має кухню для для приготування страв та прийому їжі відвідувачів в перерві між роботою",
    icon: "uploads/public/advantages/kitchen.svg",
  },
  {
    name: "Парковка",
    description: "Для відвідувачів простору обладнана парковка для автомобілів",
    icon: "uploads/public/advantages/parking.svg",
  },
  {
    name: "Проектор",
    description:
      "Для проведення презентацій є проектор з високою роздільною здатністю",
    icon: "uploads/public/advantages/projector.svg",
  },
  {
    name: "Старлінк",
    description:
      "В разі локдауну або відсутністю зв'язку основної магістральної лінії, безперервний швидкісний інтернет забезпечується за допомогою супутникового зв'язку Старлінк",
    icon: "uploads/public/advantages/starlink.svg",
  },
  {
    name: "Укриття",
    description:
      "Відвідувачі простору, в разі повітряної тривоги, зможуть скористатись обладнаним укриттям",
    icon: "uploads/public/advantages/shelter.svg",
  },
  {
    name: "Чай / кава",
    description: "Безкоштовний смачний чай та кава для відвідувачів",
    icon: "uploads/public/advantages/coffee.svg",
  },
  {
    name: "Швидкісний інтернет",
    description: "Інтернет зі швидкістю до 1 Гігабіту в секунду",
    icon: "uploads/public/advantages/internet.svg",
  },
];

const usersData = [
  {
    email: "example1@example.com",
    password: "$$2b$04$ZJj/HLhh.QF1LLJIDGdT9eijg17/yon.eChNPPcs.Un8j6CU00ohW",
    role: "manager",
    isactivated: "true",
  },
  {
    email: "example2@example.com",
    password: "$2b$04$ZJj/HLhh.QF1LLJIDGdT9eijg17/yon.eChNPPcs.Un8j6CU00ohW",
    role: "manager",
    isactivated: "true",
  },
  {
    email: "example3@example.com",
    password: "$2b$04$ZJj/HLhh.QF1LLJIDGdT9eijg17/yon.eChNPPcs.Un8j6CU00ohW",
    role: "manager",
    isactivated: "true",
  },
  {
    email: "admin4@admin.com",
    password: "$2b$04$ZJj/HLhh.QF1LLJIDGdT9eijg17/yon.eChNPPcs.Un8j6CU00ohW",
    role: "admin",
    isactivated: "true",
  },
  {
    email: "example5@example.com",
    password: "$2b$04$ZJj/HLhh.QF1LLJIDGdT9eijg17/yon.eChNPPcs.Un8j6CU00ohW",
    role: "manager",
    isactivated: "true",
  },
  {
    email: "example6@example.com",
    password: "$2b$04$ZJj/HLhh.QF1LLJIDGdT9eijg17/yon.eChNPPcs.Un8j6CU00ohW",
    role: "manager",
    isactivated: "true",
  },
];

const coworkingsUsersData = [
  { user_id: 1, coworking_id: 1 },
  { user_id: 2, coworking_id: 2 },
  { user_id: 3, coworking_id: 3 },
  { user_id: 4, coworking_id: 4 },
  { user_id: 5, coworking_id: 5 },
  { user_id: 6, coworking_id: 6 },
];

const coworkings_advantages = [
  { coworking_id: 1, advantage_id: 4 },
  { coworking_id: 1, advantage_id: 6 },
  { coworking_id: 1, advantage_id: 9 },
  { coworking_id: 1, advantage_id: 10 },
  { coworking_id: 2, advantage_id: 3 },
  { coworking_id: 2, advantage_id: 4 },
  { coworking_id: 2, advantage_id: 5 },
  { coworking_id: 2, advantage_id: 7 },
  { coworking_id: 2, advantage_id: 9 },
  { coworking_id: 2, advantage_id: 10 },
  { coworking_id: 3, advantage_id: 2 },
  { coworking_id: 3, advantage_id: 9 },
  { coworking_id: 3, advantage_id: 10 },
  { coworking_id: 4, advantage_id: 1 },
  { coworking_id: 4, advantage_id: 5 },
  { coworking_id: 4, advantage_id: 7 },
  { coworking_id: 4, advantage_id: 8 },
  { coworking_id: 4, advantage_id: 9 },
  { coworking_id: 4, advantage_id: 10 },
  { coworking_id: 5, advantage_id: 1 },
  { coworking_id: 5, advantage_id: 4 },
  { coworking_id: 5, advantage_id: 7 },
  { coworking_id: 5, advantage_id: 8 },
  { coworking_id: 5, advantage_id: 9 },
  { coworking_id: 5, advantage_id: 10 },
  { coworking_id: 6, advantage_id: 2 },
  { coworking_id: 6, advantage_id: 4 },
  { coworking_id: 6, advantage_id: 6 },
  { coworking_id: 6, advantage_id: 9 },
  { coworking_id: 6, advantage_id: 10 },
];

const pricesData = [
  {
    first_price: 50,
    last_price: 3000,
    workday: 300,
    weekend: 250,
    hour: 90,
    amount: 75,
    coworking_id: 1,
  },
  {
    first_price: 400,
    last_price: 2500,
    workday: 800,
    weekend: 250,
    hour: 0,
    amount: 65,
    coworking_id: 2,
  },
  {
    first_price: 200,
    last_price: 2500,
    workday: 200,
    weekend: 250,
    hour: 0,
    amount: 97,
    coworking_id: 3,
  },
  {
    first_price: 75,
    last_price: 5000,
    workday: 300,
    weekend: 250,
    hour: 0,
    amount: 75,
    coworking_id: 4,
  },
  {
    first_price: 260,
    last_price: 5000,
    workday: 260,
    weekend: 500,
    hour: 0,
    amount: 75,
    coworking_id: 5,
  },
  {
    first_price: 50,
    last_price: 3000,
    workday: 260,
    weekend: 500,
    hour: 0,
    amount: 75,
    coworking_id: 6,
  },
];

const coworkingWorktimeData = [
  {
    start_work: "9:00",
    end_work: "21:00",
    work_day_start: "9:00",
    work_day_end: "21:00",
    dayoff_start: "9:00",
    dayoff_end: "21:00",
    coworking_id: 1,
  },
  {
    start_work: "9:00",
    end_work: "21:00",
    work_day_start: "9:00",
    work_day_end: "21:00",
    dayoff_start: "9:00",
    dayoff_end: "21:00",
    coworking_id: 2,
  },
  {
    start_work: "9:00",
    end_work: "21:00",
    work_day_start: "9:00",
    work_day_end: "21:00",
    dayoff_start: "9:00",
    dayoff_end: "21:00",
    coworking_id: 3,
  },
  {
    start_work: "9:00",
    end_work: "21:00",
    work_day_start: "9:00",
    work_day_end: "21:00",
    dayoff_start: "9:00",
    dayoff_end: "21:00",
    coworking_id: 4,
  },
  {
    start_work: "6:00",
    end_work: "22:00",
    work_day_start: "6:00",
    work_day_end: "22:00",
    dayoff_start: "6:00",
    dayoff_end: "22:00",
    coworking_id: 5,
  },
  {
    start_work: "9:00",
    end_work: "21:00",
    work_day_start: "9:00",
    work_day_end: "21:00",
    dayoff_start: "9:00",
    dayoff_end: "21:00",
    coworking_id: 6,
  },
];

exports.seed = async function (knex) {
  const seedExist = await knex("coworkings").select("*").where({ id: 1 });

  if (!seedExist[0]) {
    const trx = await knex.transaction();

    try {
      await trx("coworkings").insert(coworkingsData);
      await trx("spaces").insert(spacesData);
      await trx("advantages").insert(advantagesData);
      await trx("users").insert(usersData);
      await trx("coworkingsusers").insert(coworkingsUsersData);
      await trx("coworkings_advantages").insert(coworkings_advantages);
      await trx("prices").insert(pricesData);
      await trx("coworking_worktime").insert(coworkingWorktimeData);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw Error("Failed migration for fill seed data");
    }
  }
};
