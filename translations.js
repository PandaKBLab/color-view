"use strict";

const ColorViewLanguage = (() => {
    const languages = {"en":"English","zh-CN":"简体中文","zh-TW":"繁體中文",ja:"日本語",de:"Deutsch",fr:"Français",es:"Español","pt-BR":"Português (Brasil)",ko:"한국어",it:"Italiano",ru:"Русский",pl:"Polski"};
    const columnOrder = ["zh-CN",...Object.keys(languages).filter(code=>code !== "zh-CN")];
    const messages = new Map();
    // The first column is the Simplified Chinese source. Keep the other columns in columnOrder.
    const rows = `
Sofle Mod 按键|Sofle Mod keymap|Sofle Mod 按鍵|Sofle Mod キーマップ|Sofle Mod Tastenbelegung|Disposition Sofle Mod|Mapa de teclas Sofle Mod|Mapa de teclas Sofle Mod|Sofle Mod 키맵|Mappa tasti Sofle Mod|Раскладка Sofle Mod|Mapa klawiszy Sofle Mod
选择模块以预览和设置。|Select a module to preview and configure it.|選取模組以預覽和設定。|モジュールを選択してプレビューや設定を行います。|Wähle ein Modul für Vorschau und Einstellungen.|Sélectionnez un module pour le prévisualiser et le configurer.|Selecciona un módulo para previsualizarlo y configurarlo.|Selecione um módulo para prévia e configuração.|미리 보고 설정할 모듈을 선택하세요.|Seleziona un modulo per visualizzarlo e configurarlo.|Выберите модуль для просмотра и настройки.|Wybierz moduł, aby go zobaczyć i skonfigurować.
模块预览|Module preview|模組預覽|モジュールのプレビュー|Modulvorschau|Aperçu du module|Vista previa del módulo|Prévia do módulo|모듈 미리보기|Anteprima del modulo|Предпросмотр модуля|Podgląd modułu
添加到布局|Add to layout|加入版面|レイアウトに追加|Zum Layout hinzufügen|Ajouter au layout|Añadir al diseño|Adicionar ao layout|레이아웃에 추가|Aggiungi al layout|Добавить в макет|Dodaj do układu
语言|Language|語言|言語|Sprache|Langue|Idioma|Idioma|언어|Lingua|Язык|Język
浏览器语言|Browser language|瀏覽器語言|ブラウザーの言語|Browsersprache|Langue du navigateur|Idioma del navegador|Idioma do navegador|브라우저 언어|Lingua del browser|Язык браузера|Język przeglądarki
显示配置|Display setup|顯示設定|画面設定|Anzeige einrichten|Réglages d’affichage|Configurar pantallas|Configurar telas|화면 설정|Configura display|Настройка экранов|Ustawienia ekranów
Color View Studio · 显示配置|Color View Studio · Display setup|Color View Studio · 顯示設定|Color View Studio · 画面設定|Color View Studio · Anzeige einrichten|Color View Studio · Réglages d’affichage|Color View Studio · Configurar pantallas|Color View Studio · Configurar telas|Color View Studio · 화면 설정|Color View Studio · Configura display|Color View Studio · Настройка экранов|Color View Studio · Ustawienia ekranów
Color View 屏幕布局|Color View screen layouts|Color View 螢幕版面|Color View の画面レイアウト|Color View Bildschirmlayouts|Écrans Color View|Diseños de pantalla Color View|Layouts de tela Color View|Color View 화면 레이아웃|Layout schermi Color View|Макеты экранов Color View|Układy ekranów Color View
组合显示模块并实时预览 Color View 的 128 × 128 八色画面。|Combine modules and preview the 128 × 128, eight-color Color View screens.|組合顯示模組並即時預覽 Color View 的 128 × 128 八色畫面。|モジュールを組み合わせ、Color View の 128 × 128、8 色表示を確認できます。|Module kombinieren und die 128 × 128 großen Color View Anzeigen mit acht Farben in der Vorschau sehen.|Combinez les modules et prévisualisez les écrans Color View en 128 × 128 et huit couleurs.|Combina módulos y previsualiza las pantallas Color View de 128 × 128 y ocho colores.|Combine módulos e visualize as telas Color View de 128 × 128 e oito cores.|모듈을 조합하고 128 × 128 8색 Color View 화면을 미리 보세요.|Combina i moduli e visualizza in anteprima gli schermi Color View da 128 × 128 e otto colori.|Собирайте модули и просматривайте экраны Color View 128 × 128 с восемью цветами.|Łącz moduły i sprawdzaj podgląd ekranów Color View 128 × 128 w ośmiu kolorach.
预览左右两块 128 × 128 八色屏。点选画面中的模块，即可调整样式和顺序。|Preview both 128 × 128 eight-color displays. Select a module to edit its style or order.|預覽左右兩塊 128 × 128 八色螢幕。選取畫面中的模組以調整樣式和順序。|左右の 128 × 128、8 色画面をプレビューできます。モジュールを選択して外観や順序を変更します。|Vorschau für beide 128 × 128 Anzeigen mit acht Farben. Wähle ein Modul, um Aussehen oder Reihenfolge zu ändern.|Prévisualisez les deux écrans 128 × 128 à huit couleurs. Sélectionnez un module pour modifier son style ou sa position.|Previsualiza ambas pantallas de 128 × 128 y ocho colores. Selecciona un módulo para cambiar su estilo u orden.|Veja as duas telas de 128 × 128 e oito cores. Selecione um módulo para alterar o estilo ou a ordem.|왼쪽과 오른쪽 128 × 128 8색 화면을 미리 봅니다. 모듈을 선택해 스타일과 순서를 변경하세요.|Visualizza entrambi gli schermi 128 × 128 a otto colori. Seleziona un modulo per modificarne stile o ordine.|Предпросмотр двух экранов 128 × 128 с восемью цветами. Выберите модуль, чтобы изменить его вид или порядок.|Podejrzyj oba ekrany 128 × 128 w ośmiu kolorach. Wybierz moduł, aby zmienić styl lub kolejność.
导入布局|Import layout|匯入版面|レイアウトを読み込む|Layout importieren|Importer le layout|Importar diseño|Importar layout|레이아웃 가져오기|Importa layout|Импорт макета|Importuj układ
导出 ZMK 布局|Export ZMK layout|匯出 ZMK 版面|ZMK レイアウトを書き出す|ZMK-Layout exportieren|Exporter pour ZMK|Exportar diseño ZMK|Exportar layout ZMK|ZMK 레이아웃 내보내기|Esporta layout ZMK|Экспорт для ZMK|Eksportuj układ ZMK
布局与模块|Layouts and modules|版面與模組|レイアウトとモジュール|Layouts und Module|Layouts et modules|Diseños y módulos|Layouts e módulos|레이아웃 및 모듈|Layout e moduli|Макеты и модули|Układy i moduły
左屏|Left display|左螢幕|左画面|Linkes Display|Écran gauche|Pantalla izquierda|Tela esquerda|왼쪽 화면|Schermo sinistro|Левый экран|Lewy ekran
右屏|Right display|右螢幕|右画面|Rechtes Display|Écran droit|Pantalla derecha|Tela direita|오른쪽 화면|Schermo destro|Правый экран|Prawy ekran
左屏已关闭|Left display is off|左螢幕已關閉|左画面はオフ|Linkes Display aus|Écran gauche désactivé|Pantalla izquierda apagada|Tela esquerda desligada|왼쪽 화면 꺼짐|Schermo sinistro spento|Левый экран выключен|Lewy ekran wyłączony
右屏已关闭|Right display is off|右螢幕已關閉|右画面はオフ|Rechtes Display aus|Écran droit désactivé|Pantalla derecha apagada|Tela direita desligada|오른쪽 화면 꺼짐|Schermo destro spento|Правый экран выключен|Prawy ekran wyłączony
左屏实时画面|Live left display|左螢幕即時畫面|左画面のライブ表示|Linke Live-Vorschau|Aperçu gauche en direct|Vista en directo izquierda|Prévia ao vivo da tela esquerda|왼쪽 화면 실시간 미리보기|Anteprima live a sinistra|Предпросмотр левого экрана|Podgląd lewego ekranu
右屏实时画面|Live right display|右螢幕即時畫面|右画面のライブ表示|Rechte Live-Vorschau|Aperçu droit en direct|Vista en directo derecha|Prévia ao vivo da tela direita|오른쪽 화면 실시간 미리보기|Anteprima live a destra|Предпросмотр правого экрана|Podgląd prawego ekranu
左屏模块|Left display modules|左螢幕模組|左画面のモジュール|Module links|Modules de gauche|Módulos izquierdos|Módulos da tela esquerda|왼쪽 화면 모듈|Moduli a sinistra|Модули левого экрана|Moduły lewego ekranu
右屏模块|Right display modules|右螢幕模組|右画面のモジュール|Module rechts|Modules de droite|Módulos derechos|Módulos da tela direita|오른쪽 화면 모듈|Moduli a destra|Модули правого экрана|Moduły prawego ekranu
启用|Enable|啟用|有効|Aktivieren|Activer|Activar|Ativar|켜기|Attiva|Включить|Włącz
预设|Preset|預設|プリセット|Vorlage|Préréglage|Preajuste|Predefinição|프리셋|Preimpostazione|Пресет|Szablon
自定义|Custom|自訂|カスタム|Benutzerdefiniert|Personnalisé|Personalizado|Personalizado|사용자 지정|Personalizzato|Свой вариант|Własny
日常状态|Daily status|日常狀態|基本ステータス|Alltagsstatus|État quotidien|Estado diario|Status diário|일상 상태|Stato quotidiano|Повседневный статус|Status codzienny
像素互动|Pixel animation|像素動畫|ピクセルアニメ|Pixelanimation|Animation pixel|Animación de píxeles|Animação em pixels|픽셀 애니메이션|Animazione pixel|Пиксельная анимация|Animacja pikselowa
键位与外设|Keys and peripherals|鍵位與周邊|キーと周辺機器|Tasten und Peripherie|Touches et périphériques|Teclas y periféricos|Teclas e periféricos|키와 주변기기|Tasti e periferiche|Клавиши и устройства|Klawisze i urządzenia
底色|Background|底色|背景|Hintergrund|Fond|Fondo|Fundo|배경|Sfondo|Фон|Tło
方向|Rotation|方向|回転|Drehung|Rotation|Rotación|Rotação|회전|Rotazione|Поворот|Obrót
黑底|Black|黑底|黒背景|Schwarz|Noir|Negro|Preto|검정|Nero|Чёрный|Czarne
白底|White|白底|白背景|Weiß|Blanc|Blanco|Branco|흰색|Bianco|Белый|Białe
保存 PNG|Save PNG|儲存 PNG|PNG を保存|PNG speichern|Enregistrer en PNG|Guardar PNG|Salvar PNG|PNG 저장|Salva PNG|Сохранить PNG|Zapisz PNG
已用 {used} / 128 px|{used} / 128 px used|已用 {used} / 128 px|{used} / 128 px 使用済み|{used} / 128 px belegt|{used} / 128 px utilisés|{used} / 128 px usados|{used} / 128 px usados|{used} / 128 px 사용|{used} / 128 px usati|Занято {used} / 128 пкс|Zajęte {used} / 128 px
已用画面高度|Used screen height|已用畫面高度|使用中の画面の高さ|Belegte Bildschirmhöhe|Hauteur utilisée|Altura ocupada|Altura ocupada|사용 중인 화면 높이|Altezza usata|Занятая высота экрана|Zajęta wysokość ekranu
添加模块|Add module|新增模組|モジュールを追加|Modul hinzufügen|Ajouter un module|Añadir módulo|Adicionar módulo|모듈 추가|Aggiungi modulo|Добавить модуль|Dodaj moduł
插入空行|Add spacer|插入空白列|余白を追加|Abstand einfügen|Ajouter un espace|Añadir espacio|Adicionar espaço|여백 추가|Aggiungi spazio|Добавить отступ|Dodaj odstęp
从模块库添加内容。|Add content from the module library.|從模組庫新增內容。|モジュール一覧から追加します。|Füge Inhalte aus der Modulbibliothek hinzu.|Ajoutez du contenu depuis la bibliothèque.|Añade contenido desde la biblioteca.|Adicione conteúdo da biblioteca.|모듈 라이브러리에서 추가하세요.|Aggiungi contenuti dalla libreria.|Добавьте содержимое из библиотеки.|Dodaj zawartość z biblioteki modułów.
选择模块后可上移、下移或删除。新增内容插入所选模块下方。|Select a module to move or delete it. New content goes below the selection.|選取模組後可移動或刪除。新內容會放在所選模組下方。|モジュールを選択して移動や削除ができます。新しい内容は選択項目の下に追加されます。|Wähle ein Modul zum Verschieben oder Löschen. Neue Inhalte erscheinen unter der Auswahl.|Sélectionnez un module pour le déplacer ou le supprimer. Le contenu s’ajoute sous la sélection.|Selecciona un módulo para moverlo o eliminarlo. El contenido nuevo se agrega debajo.|Selecione um módulo para movê-lo ou excluí-lo. O novo conteúdo entra abaixo da seleção.|모듈을 선택해 이동하거나 삭제하세요. 새 내용은 선택 항목 아래에 추가됩니다.|Seleziona un modulo per spostarlo o eliminarlo. Il nuovo contenuto va sotto la selezione.|Выберите модуль для перемещения или удаления. Новое содержимое добавится ниже.|Wybierz moduł, aby go przenieść lub usunąć. Nowa zawartość trafi poniżej.
双屏预览|Dual-display preview|雙螢幕預覽|左右画面のプレビュー|Vorschau beider Displays|Aperçu des deux écrans|Vista de dos pantallas|Prévia das duas telas|두 화면 미리보기|Anteprima dei due schermi|Предпросмотр двух экранов|Podgląd dwóch ekranów
单屏预览|Single-display preview|單螢幕預覽|片側画面のプレビュー|Vorschau eines Displays|Aperçu d’un écran|Vista de una pantalla|Prévia de uma tela|한 화면 미리보기|Anteprima di uno schermo|Предпросмотр одного экрана|Podgląd jednego ekranu
屏幕预览|Display preview|螢幕預覽|画面プレビュー|Bildschirmvorschau|Aperçu écran|Vista de pantalla|Prévia da tela|화면 미리보기|Anteprima schermo|Предпросмотр экрана|Podgląd ekranu
128 × 128 px / 屏|128 × 128 px per display|每屏 128 × 128 px|各画面 128 × 128 px|128 × 128 px je Display|128 × 128 px par écran|128 × 128 px por pantalla|128 × 128 px por tela|화면당 128 × 128 px|128 × 128 px per schermo|128 × 128 пкс на экран|128 × 128 px na ekran
屏幕可用颜色|Display palette|螢幕可用色彩|画面パレット|Farbpalette|Palette de l’écran|Paleta de pantalla|Paleta da tela|화면 색상표|Tavolozza display|Палитра экрана|Paleta ekranu
原生 8 色|8 native colors|原生 8 色|ネイティブ 8 色|8 native Farben|8 couleurs natives|8 colores nativos|8 cores nativas|기본 8색|8 colori nativi|8 исходных цветов|8 kolorów ekranu
模块设置|Module settings|模組設定|モジュール設定|Moduleinstellungen|Réglages du module|Ajustes del módulo|Configurações do módulo|모듈 설정|Impostazioni modulo|Настройки модуля|Ustawienia modułu
点击预览或布局列表中的模块。|Select a module in the preview or in a layout list.|點選預覽或版面清單中的模組。|プレビューまたはレイアウト一覧からモジュールを選択します。|Wähle ein Modul in der Vorschau oder Layoutliste.|Sélectionnez un module dans l’aperçu ou dans une liste.|Selecciona un módulo en la vista previa o en la lista.|Selecione um módulo na prévia ou em uma lista.|미리보기나 레이아웃 목록에서 모듈을 선택하세요.|Seleziona un modulo nell’anteprima o nella lista.|Выберите модуль в предпросмотре или в списке.|Wybierz moduł w podglądzie lub na liście układu.
状态模拟|Status simulator|狀態模擬|ステータスシミュレーター|Statussimulation|Simulation d’état|Simular estado|Simulador de estado|상태 시뮬레이터|Simulatore di stato|Симулятор состояния|Symulator stanu
浏览器|Browser|瀏覽器|ブラウザー|Browser|Navigateur|Navegador|Navegador|브라우저|Browser|Браузер|Przeglądarka
键盘输出|Keyboard output|鍵盤輸出|キーボード出力|Tastaturausgabe|Sortie clavier|Salida del teclado|Saída do teclado|키보드 출력|Uscita tastiera|Подключение клавиатуры|Wyjście klawiatury
蓝牙|Bluetooth|藍牙|Bluetooth|Bluetooth|Bluetooth|Bluetooth|Bluetooth|블루투스|Bluetooth|Bluetooth|Bluetooth
离线|Offline|離線|オフライン|Offline|Hors ligne|Sin conexión|Off-line|오프라인|Offline|Нет связи|Offline
蓝牙档位|Bluetooth profile|藍牙設定檔|Bluetooth プロファイル|Bluetooth-Profil|Profil Bluetooth|Perfil Bluetooth|Perfil Bluetooth|블루투스 프로필|Profilo Bluetooth|Профиль Bluetooth|Profil Bluetooth
档位 {count}|Profile {count}|設定檔 {count}|プロファイル {count}|Profil {count}|Profil {count}|Perfil {count}|Perfil {count}|프로필 {count}|Profilo {count}|Профиль {count}|Profil {count}
电量|Battery level|電量|電池残量|Akkustand|Niveau de batterie|Batería|Nível da bateria|배터리 잔량|Batteria|Заряд батареи|Poziom baterii
USB 供电|USB power|USB 供電|USB 給電|USB-Stromversorgung|Alimentation USB|Alimentación USB|Alimentação USB|USB 전원|Alimentazione USB|Питание от USB|Zasilanie USB
正在充电|Charging|正在充電|充電中|Lädt|En charge|Cargando|Carregando|충전 중|In carica|Заряжается|Ładowanie
模拟按键|Simulate keypress|模擬按鍵|キー入力を試す|Tastendruck simulieren|Simuler une frappe|Simular pulsación|Simular tecla|키 입력 모의|Simula un tasto|Имитировать нажатие|Symuluj naciśnięcie
每次点击模拟一个字符。WPM 统计最近 60 秒。|Each click types one character. WPM uses the last 60 seconds.|每次點擊模擬一個字元。WPM 統計最近 60 秒。|クリックごとに 1 文字入力します。WPM は直近 60 秒の集計です。|Jeder Klick tippt ein Zeichen. WPM zählt die letzten 60 Sekunden.|Chaque clic saisit un caractère. Le WPM couvre les 60 dernières secondes.|Cada clic escribe un carácter. Las WPM usan los últimos 60 segundos.|Cada clique digita um caractere. O WPM usa os últimos 60 segundos.|클릭할 때마다 문자 하나를 입력합니다. WPM은 최근 60초를 집계합니다.|Ogni clic digita un carattere. Il WPM usa gli ultimi 60 secondi.|Щелчок вводит один символ. WPM учитывает последние 60 секунд.|Kliknięcie wpisuje jeden znak. WPM obejmuje ostatnie 60 sekund.
当前层|Active layer|目前層|現在のレイヤー|Aktive Ebene|Couche active|Capa activa|Camada ativa|현재 레이어|Livello attivo|Активный слой|Aktywna warstwa
修饰键与锁定|Modifiers and locks|修飾鍵與鎖定|修飾キーとロック|Modifikatoren und Sperren|Modificateurs et verrous|Modificadores y bloqueos|Modificadores e travas|보조 키 및 잠금|Modificatori e blocchi|Модификаторы и блокировки|Modyfikatory i blokady
右侧旋钮|Right encoder|右側旋鈕|右側エンコーダー|Rechter Drehgeber|Encodeur droit|Encoder derecho|Encoder direito|오른쪽 인코더|Encoder destro|Правый энкодер|Prawy enkoder
模拟右侧轨迹球|Simulate right trackball|模擬右側軌跡球|右側トラックボールを試す|Rechten Trackball simulieren|Simuler la boule droite|Simular trackball derecho|Simular trackball direito|오른쪽 트랙볼 모의|Simula trackball destro|Имитировать правый трекбол|Symuluj prawy trackball
右侧轨迹球|Right trackball|右側軌跡球|右側トラックボール|Rechter Trackball|Boule de commande droite|Trackball derecho|Trackball direito|오른쪽 트랙볼|Trackball destro|Правый трекбол|Prawy trackball
网页模拟|Web simulation|網頁模擬|ブラウザーで試す|Browsersimulation|Simulation web|Simulación web|Simulação web|웹 시뮬레이션|Simulazione web|Симуляция в браузере|Symulacja w przeglądarce
旋钮逆时针|Encoder counterclockwise|旋鈕逆時針|ノブを反時計回り|Drehgeber gegen den Uhrzeigersinn|Encodeur antihoraire|Giro antihorario|Encoder anti-horário|인코더 반시계 방향|Encoder in senso antiorario|Энкодер против часовой стрелки|Enkoder w lewo
旋钮顺时针|Encoder clockwise|旋鈕順時針|ノブを時計回り|Drehgeber im Uhrzeigersinn|Encodeur horaire|Giro horario|Encoder horário|인코더 시계 방향|Encoder in senso orario|Энкодер по часовой стрелке|Enkoder w prawo
逆转|CCW|逆轉|左回し|Links|Antihor.|Antihorario|Anti-horário|반시계|Antiorario|Влево|W lewo
顺转|CW|順轉|右回し|Rechts|Horaire|Horario|Horário|시계|Orario|Вправо|W prawo
按压|Press|按壓|押す|Drücken|Appuyer|Pulsar|Pressionar|누르기|Premi|Нажать|Naciśnij
滚动模式|Scroll mode|捲動模式|スクロール|Scrollmodus|Mode défilement|Modo desplazamiento|Modo rolagem|스크롤 모드|Modalità scorrimento|Прокрутка|Tryb przewijania
点击|Click|點擊|クリック|Klick|Clic|Clic|Clique|클릭|Clic|Щелчок|Kliknij
轨迹球模拟区，使用方向键、拖动或滚轮|Trackball area. Use arrows, drag, or scroll.|軌跡球模擬區，可使用方向鍵、拖曳或滾輪。|トラックボール操作。矢印キー、ドラッグ、ホイールに対応。|Trackball. Nutze Pfeiltasten, Ziehen oder Mausrad.|Boule de commande. Utilisez les flèches, le glisser ou la molette.|Zona del trackball. Usa flechas, arrastre o rueda.|Área do trackball. Use as setas, arraste ou role.|트랙볼 영역입니다. 방향키, 드래그 또는 휠을 사용하세요.|Area trackball. Usa frecce, trascinamento o rotella.|Область трекбола. Используйте стрелки, перетаскивание или колесо.|Pole trackballa. Użyj strzałek, przeciągania lub kółka.
键位与输入|Keymap and input|鍵位與輸入|キーマップと入力|Tastenbelegung und Eingabe|Disposition et saisie|Mapa de teclas y entrada|Mapa de teclas e entrada|키맵 및 입력|Mappa tasti e input|Раскладка и ввод|Mapa klawiszy i wejście
Sofle 示例配列|Sofle example layout|Sofle 範例配列|Sofle のサンプル配列|Sofle-Beispiellayout|Disposition Sofle de démonstration|Distribución Sofle de ejemplo|Layout Sofle de exemplo|Sofle 예제 배열|Layout Sofle di esempio|Пример раскладки Sofle|Przykładowy układ Sofle
Sofle 示例|Sofle example|Sofle 範例|Sofle サンプル|Sofle-Beispiel|Exemple Sofle|Ejemplo Sofle|Exemplo Sofle|Sofle 예제|Esempio Sofle|Пример Sofle|Przykład Sofle
等待输入|Waiting for input|等待輸入|入力待ち|Warte auf Eingabe|En attente de saisie|Esperando entrada|Aguardando entrada|입력 대기 중|In attesa di input|Ожидание ввода|Oczekiwanie na wejście
键盘输入|Keyboard input|鍵盤輸入|キーボード入力|Tastatureingabe|Saisie clavier|Entrada de teclado|Entrada do teclado|키보드 입력|Input da tastiera|Ввод с клавиатуры|Wejście z klawiatury
导入 .keymap|Import .keymap|匯入 .keymap|.keymap を読み込む|.keymap importieren|Importer .keymap|Importar .keymap|Importar .keymap|.keymap 가져오기|Importa .keymap|Импорт .keymap|Importuj .keymap
导入物理配列|Import physical layout|匯入實體配列|物理配列を読み込む|Physisches Layout importieren|Importer la disposition physique|Importar distribución física|Importar layout físico|물리 배열 가져오기|Importa layout fisico|Импорт физической раскладки|Importuj układ fizyczny
配列|Layout|配列|配列|Layout|Disposition|Distribución|Layout|배열|Layout|Раскладка|Układ
自动匹配|Auto-detect|自動比對|自動判定|Automatisch erkennen|Détection automatique|Detección automática|Detectar automaticamente|자동 감지|Rilevamento automatico|Автоопределение|Wykryj automatycznie
顺序网格|Position grid|順序網格|順番グリッド|Positionsraster|Grille par position|Cuadrícula por posición|Grade por posição|순서 격자|Griglia per posizione|Сетка позиций|Siatka pozycji
物理配列|Physical layout|實體配列|物理配列|Physisches Layout|Disposition physique|Distribución física|Layout físico|물리 배열|Layout fisico|Физическая раскладка|Fizyczny układ
恢复示例|Restore example|還原範例|サンプルに戻す|Beispiel wiederherstellen|Rétablir l’exemple|Restaurar ejemplo|Restaurar exemplo|예제로 되돌리기|Ripristina esempio|Вернуть пример|Przywróć przykład
导入 .keymap 读取键值和层。可追加含 key_physical_attrs 的 .dtsi 获取实际位置。文件在浏览器中处理。|Import .keymap for keys and layers. Add a .dtsi with key_physical_attrs for exact positions. Files are processed in your browser.|匯入 .keymap 讀取鍵值和層。可追加含 key_physical_attrs 的 .dtsi 取得實際位置。檔案在瀏覽器中處理。|.keymap からキーとレイヤーを読み込みます。実際の位置には key_physical_attrs を含む .dtsi を追加します。ファイルはブラウザーで処理されます。|Importiere .keymap für Tasten und Ebenen. Eine .dtsi mit key_physical_attrs liefert die genauen Positionen. Die Dateien werden im Browser verarbeitet.|Importez .keymap pour les touches et les couches. Ajoutez un .dtsi avec key_physical_attrs pour les positions exactes. Les fichiers sont traités dans le navigateur.|Importa .keymap para leer teclas y capas. Añade un .dtsi con key_physical_attrs para las posiciones exactas. Los archivos se procesan en el navegador.|Importe .keymap para ler teclas e camadas. Adicione um .dtsi com key_physical_attrs para posições exatas. Os arquivos são processados no navegador.|.keymap에서 키와 레이어를 가져옵니다. 실제 위치는 key_physical_attrs가 포함된 .dtsi를 추가하세요. 파일은 브라우저에서 처리됩니다.|Importa .keymap per tasti e livelli. Aggiungi un .dtsi con key_physical_attrs per le posizioni esatte. I file vengono elaborati nel browser.|Импортируйте .keymap для клавиш и слоёв. Добавьте .dtsi с key_physical_attrs для точных позиций. Файлы обрабатываются в браузере.|Zaimportuj .keymap, aby wczytać klawisze i warstwy. Dodaj .dtsi z key_physical_attrs, aby uzyskać dokładne pozycje. Pliki są przetwarzane w przeglądarce.
显示方式|Display mode|顯示方式|表示方式|Anzeigemodus|Mode d’affichage|Modo de visualización|Modo de exibição|표시 방식|Modalità display|Режим отображения|Tryb wyświetlania
双屏分别显示本侧|One half per display|雙螢幕各顯示本側|各画面に片側を表示|Eine Hälfte pro Display|Une moitié par écran|Una mitad por pantalla|Uma metade por tela|화면마다 해당 반쪽 표시|Una metà per schermo|По половине на экран|Jedna połowa na ekran
单屏显示两半键盘|Both halves on one display|單螢幕顯示兩半鍵盤|両側を 1 画面に表示|Beide Hälften auf einem Display|Deux moitiés sur un écran|Ambas mitades en una pantalla|Duas metades em uma tela|한 화면에 양쪽 표시|Due metà su uno schermo|Обе половины на одном экране|Dwie połowy na jednym ekranie
目标屏|Target display|目標螢幕|対象画面|Zieldisplay|Écran cible|Pantalla de destino|Tela de destino|대상 화면|Schermo di destinazione|Целевой экран|Ekran docelowy
应用键位预设|Apply keymap preset|套用鍵位預設|キーマップ設定を適用|Tastenvorlage anwenden|Appliquer le préréglage|Aplicar preajuste|Aplicar predefinição|키맵 프리셋 적용|Applica preimpostazione|Применить пресет клавиш|Zastosuj szablon klawiszy
应用后会替换目标屏的模块。单屏模式保留另一屏的其他内容。|Applies a new layout to the target displays. Single-display mode keeps other content on the second display.|套用後會替換目標螢幕的模組。單螢幕模式保留另一螢幕的其他內容。|対象画面のレイアウトを置き換えます。1 画面モードでは反対側のほかの内容を保持します。|Ersetzt das Layout der Zieldisplays. Im Ein-Display-Modus bleiben andere Inhalte auf dem zweiten Display erhalten.|Remplace le layout des écrans ciblés. Le mode un écran conserve les autres contenus du second écran.|Sustituye el diseño de las pantallas seleccionadas. El modo de una pantalla conserva el resto del contenido en la otra.|Substitui o layout das telas de destino. O modo de tela única mantém os demais conteúdos na outra tela.|대상 화면의 레이아웃을 바꿉니다. 한 화면 모드는 다른 화면의 나머지 내용을 유지합니다.|Sostituisce il layout degli schermi scelti. La modalità a schermo singolo conserva gli altri contenuti sul secondo schermo.|Заменяет макеты выбранных экранов. В режиме одного экрана прочее содержимое второго сохраняется.|Zastępuje układ wybranych ekranów. Tryb jednego ekranu zachowuje pozostałą zawartość drugiego.
左手|Left hand|左手|左手側|Linke Hand|Main gauche|Mano izquierda|Mão esquerda|왼손|Mano sinistra|Левая рука|Lewa ręka
右手|Right hand|右手|右手側|Rechte Hand|Main droite|Mano derecha|Mão direita|오른손|Mano destra|Правая рука|Prawa ręka
左手按键|Left-hand keys|左手按鍵|左手側のキー|Tasten links|Touches main gauche|Teclas de la mano izquierda|Teclas da mão esquerda|왼손 키|Tasti a sinistra|Клавиши левой руки|Klawisze lewej ręki
右手按键|Right-hand keys|右手按鍵|右手側のキー|Tasten rechts|Touches main droite|Teclas de la mano derecha|Teclas da mão direita|오른손 키|Tasti a destra|Клавиши правой руки|Klawisze prawej ręki
五向开关|5-way switch|五向開關|5 方向スイッチ|5-Wege-Schalter|Commutateur 5 directions|Interruptor de 5 vías|Chave de 5 direções|5방향 스위치|Interruttore a 5 vie|5-позиционный переключатель|Przełącznik 5-kierunkowy
旋钮|Encoder|旋鈕|エンコーダー|Drehgeber|Encodeur|Encoder|Encoder|인코더|Encoder|Энкодер|Enkoder
轨迹球模拟|Trackball simulation|軌跡球模擬|トラックボールのシミュレーション|Trackball-Simulation|Simulation du trackball|Simulación de trackball|Simulação de trackball|트랙볼 시뮬레이션|Simulazione trackball|Симуляция трекбола|Symulacja trackballa
Color View 项目文档|Color View documentation|Color View 專案文件|Color View のドキュメント|Color View Dokumentation|Documentation Color View|Documentación de Color View|Documentação do Color View|Color View 문서|Documentazione Color View|Документация Color View|Dokumentacja Color View
上移|Move up|上移|上へ|Nach oben|Monter|Subir|Mover para cima|위로 이동|Sposta su|Поднять|Przenieś w górę
下移|Move down|下移|下へ|Nach unten|Descendre|Bajar|Mover para baixo|아래로 이동|Sposta giù|Опустить|Przenieś w dół
删除|Delete|刪除|削除|Löschen|Supprimer|Eliminar|Excluir|삭제|Elimina|Удалить|Usuń
编辑 {module}|Edit {module}|編輯 {module}|{module} を編集|{module} bearbeiten|Modifier {module}|Editar {module}|Editar {module}|{module} 편집|Modifica {module}|Изменить {module}|Edytuj {module}
上移 {module}|Move {module} up|上移 {module}|{module} を上へ|{module} nach oben|Monter {module}|Subir {module}|Mover {module} para cima|{module} 위로 이동|Sposta {module} su|Поднять {module}|Przenieś {module} w górę
下移 {module}|Move {module} down|下移 {module}|{module} を下へ|{module} nach unten|Descendre {module}|Bajar {module}|Mover {module} para baixo|{module} 아래로 이동|Sposta {module} giù|Опустить {module}|Przenieś {module} w dół
删除 {module}|Delete {module}|刪除 {module}|{module} を削除|{module} löschen|Supprimer {module}|Eliminar {module}|Excluir {module}|{module} 삭제|Elimina {module}|Удалить {module}|Usuń {module}
添加 {module}|Add {module}|新增 {module}|{module} を追加|{module} hinzufügen|Ajouter {module}|Añadir {module}|Adicionar {module}|{module} 추가|Aggiungi {module}|Добавить {module}|Dodaj {module}
剩余 {available} px，{module} 需要 {height} px。|{available} px free. {module} needs {height} px.|剩餘 {available} px，{module} 需要 {height} px。|空き {available} px。{module} には {height} px 必要です。|{available} px frei. {module} benötigt {height} px.|{available} px libres. {module} nécessite {height} px.|{available} px libres. {module} requiere {height} px.|{available} px livres. {module} precisa de {height} px.|{available} px 남음. {module}에 {height} px가 필요합니다.|{available} px liberi. {module} richiede {height} px.|Свободно {available} пкс. Для {module} нужно {height} пкс.|Wolne {available} px. {module} wymaga {height} px.
高度（px）|Height (px)|高度（px）|高さ（px）|Höhe (px)|Hauteur (px)|Altura (px)|Altura (px)|높이(px)|Altezza (px)|Высота (пкс)|Wysokość (px)
可设高度为 {min}–{max} px|Height must be {min}–{max} px|可設高度為 {min}–{max} px|高さは {min}〜{max} px です|Höhe muss {min}–{max} px betragen|La hauteur doit être de {min} à {max} px|La altura debe ser de {min} a {max} px|A altura deve ser de {min} a {max} px|높이는 {min}~{max} px여야 합니다|L’altezza deve essere {min}–{max} px|Высота должна быть {min}–{max} пкс|Wysokość musi wynosić {min}–{max} px
文字颜色|Text color|文字色彩|文字色|Textfarbe|Couleur du texte|Color del texto|Cor do texto|글자 색상|Colore del testo|Цвет текста|Kolor tekstu
背景颜色|Background color|背景色彩|背景色|Hintergrundfarbe|Couleur de fond|Color de fondo|Cor de fundo|배경 색상|Colore di sfondo|Цвет фона|Kolor tła
跟随屏幕|Use display colors|跟隨螢幕|画面に合わせる|Displayfarben übernehmen|Couleurs de l’écran|Colores de pantalla|Cores da tela|화면 색상 사용|Usa colori schermo|Цвета экрана|Kolory ekranu
跟随模块文字|Use module text color|跟隨模組文字|モジュールの文字色|Modultextfarbe übernehmen|Couleur du texte du module|Color del texto del módulo|Cor do texto do módulo|모듈 글자 색상 사용|Usa colore testo del modulo|Цвет текста модуля|Kolor tekstu modułu
黑|Black|黑|黒|Schwarz|Noir|Negro|Preto|검정|Nero|Чёрный|Czarny
白|White|白|白|Weiß|Blanc|Blanco|Branco|흰색|Bianco|Белый|Biały
红|Red|紅|赤|Rot|Rouge|Rojo|Vermelho|빨강|Rosso|Красный|Czerwony
绿|Green|綠|緑|Grün|Vert|Verde|Verde|초록|Verde|Зелёный|Zielony
蓝|Blue|藍|青|Blau|Bleu|Azul|Azul|파랑|Blu|Синий|Niebieski
青|Cyan|青|シアン|Cyan|Cyan|Cian|Ciano|시안|Ciano|Голубой|Cyjan
品红|Magenta|洋紅|マゼンタ|Magenta|Magenta|Magenta|Magenta|마젠타|Magenta|Пурпурный|Magenta
黄|Yellow|黃|黄|Gelb|Jaune|Amarillo|Amarelo|노랑|Giallo|Жёлтый|Żółty
素材已加载|Asset loaded|素材已載入|素材を読み込み済み|Datei geladen|Fichier chargé|Recurso cargado|Mídia carregada|소재 불러옴|Risorsa caricata|Файл загружен|Plik wczytany
待选择素材|No asset selected|尚未選取素材|素材未選択|Keine Datei ausgewählt|Aucun fichier sélectionné|Sin recurso seleccionado|Nenhuma mídia selecionada|선택한 소재 없음|Nessuna risorsa selezionata|Файл не выбран|Nie wybrano pliku
选择素材|Choose asset|選取素材|素材を選ぶ|Datei auswählen|Choisir un fichier|Elegir recurso|Escolher mídia|소재 선택|Scegli risorsa|Выбрать файл|Wybierz plik
预览播放|Play preview|播放預覽|プレビュー再生|Vorschau abspielen|Lire l’aperçu|Reproducir vista previa|Reproduzir prévia|미리보기 재생|Riproduci anteprima|Воспроизвести|Odtwórz podgląd
状态栏|Status bar|狀態列|ステータスバー|Statusleiste|Barre d’état|Barra de estado|Barra de status|상태 표시줄|Barra di stato|Строка состояния|Pasek stanu
按键图|Keymap|按鍵圖|キーマップ|Tastenbelegung|Disposition des touches|Mapa de teclas|Mapa de teclas|키맵|Mappa tasti|Карта клавиш|Mapa klawiszy
动图|Animation|動畫|アニメーション|Animation|Animation|Animación|Animação|애니메이션|Animazione|Анимация|Animacja
交互|Interaction|互動|インタラクション|Interaktion|Interaction|Interacción|Interação|상호작용|Interazione|Взаимодействие|Interakcja
连接与电量|Connection and battery|連線與電量|接続とバッテリー|Verbindung und Akku|Connexion et batterie|Conexión y batería|Conexão e bateria|연결 및 배터리|Connessione e batteria|Подключение и батарея|Połączenie i bateria
方块鸡|Pixel chicken|方塊雞|ピクセルのニワトリ|Pixelhuhn|Poulet pixel|Pollo pixelado|Galinha em pixels|픽셀 닭|Pollo pixel|Пиксельная курица|Pikselowa kura
本地图片／GIF|Local image or GIF|本機圖片／GIF|ローカル画像・GIF|Lokales Bild oder GIF|Image locale ou GIF|Imagen local o GIF|Imagem local ou GIF|로컬 이미지 또는 GIF|Immagine locale o GIF|Локальное изображение или GIF|Lokalny obraz lub GIF
最近键值|Last key|最近按鍵|最後のキー|Letzte Taste|Dernière touche|Última tecla|Última tecla|최근 키|Ultimo tasto|Последняя клавиша|Ostatni klawisz
WPM 波形|WPM graph|WPM 波形|WPM グラフ|WPM-Diagramm|Graphique WPM|Gráfico WPM|Gráfico de WPM|WPM 그래프|Grafico WPM|График WPM|Wykres WPM
空行|Spacer|空白列|余白|Abstand|Espace|Espaciador|Espaçador|여백|Spazio|Отступ|Odstęp
连接图标|Connection icon|連線圖示|接続アイコン|Verbindungssymbol|Icône de connexion|Icono de conexión|Ícone de conexão|연결 아이콘|Icona connessione|Значок подключения|Ikona połączenia
像素图标与档位|Pixel icon and profile|像素圖示與設定檔|ピクセルアイコンとプロファイル|Pixelsymbol und Profil|Icône pixel et profil|Icono pixelado y perfil|Ícone em pixels e perfil|픽셀 아이콘과 프로필|Icona pixel e profilo|Пиксельный значок и профиль|Ikona pikselowa i profil
字母徽标与档位|Letter badge and profile|字母徽章與設定檔|文字バッジとプロファイル|Buchstabensymbol und Profil|Lettre et profil|Insignia de letra y perfil|Letra e perfil|문자 배지와 프로필|Lettera e profilo|Буквенный значок и профиль|Litera i profil
仅文字|Text only|僅文字|文字のみ|Nur Text|Texte seul|Solo texto|Somente texto|글자만|Solo testo|Только текст|Tylko tekst
隐藏|Hide|隱藏|非表示|Ausblenden|Masquer|Ocultar|Ocultar|숨기기|Nascondi|Скрыть|Ukryj
连接颜色|Connection color|連線色彩|接続の色|Verbindungsfarbe|Couleur de connexion|Color de conexión|Cor da conexão|연결 색상|Colore connessione|Цвет подключения|Kolor połączenia
电量图标|Battery icon|電量圖示|バッテリーアイコン|Akkusymbol|Icône de batterie|Icono de batería|Ícone da bateria|배터리 아이콘|Icona batteria|Значок батареи|Ikona baterii
百分比|Percentage|百分比|パーセント|Prozent|Pourcentage|Porcentaje|Porcentagem|백분율|Percentuale|Процент|Procent
电池格|Battery gauge|電池格|バッテリーゲージ|Akkubalken|Jauge|Indicador|Indicador|배터리 게이지|Indicatore|Индикатор заряда|Wskaźnik baterii
电池格＋百分比|Gauge and percentage|電池格＋百分比|ゲージとパーセント|Balken und Prozent|Jauge et pourcentage|Indicador y porcentaje|Indicador e porcentagem|게이지와 백분율|Indicatore e percentuale|Индикатор и процент|Wskaźnik i procent
电量颜色|Battery color|電量色彩|バッテリーの色|Akkufarbe|Couleur de la batterie|Color de batería|Cor da bateria|배터리 색상|Colore batteria|Цвет батареи|Kolor baterii
按电量配色|By battery level|按電量配色|残量に応じた色|Nach Akkustand|Selon le niveau de batterie|Según el nivel de batería|Por nível de bateria|잔량에 따른 색상|In base al livello batteria|По уровню заряда|Według poziomu baterii
供电与充电|Power and charging|供電與充電|給電と充電|Strom und Laden|Alimentation et charge|Alimentación y carga|Energia e carregamento|전원 및 충전|Alimentazione e carica|Питание и зарядка|Zasilanie i ładowanie
插头 / 闪电|Plug / lightning|插頭 / 閃電|プラグ / 稲妻|Stecker / Blitz|Prise / éclair|Enchufe / rayo|Plugue / raio|플러그 / 번개|Spina / fulmine|Вилка / молния|Wtyczka / błyskawica
键位范围|Key coverage|鍵位範圍|キーの範囲|Tastenbereich|Zone de touches|Alcance de teclas|Abrangência das teclas|키 표시 범위|Ambito tasti|Область клавиш|Zakres klawiszy
本侧|Current half|本側|この側|Diese Hälfte|Moitié locale|Esta mitad|Esta metade|이쪽 반쪽|Questa metà|Текущая половина|Ta połowa
两半键盘|Both halves|兩半鍵盤|両側|Beide Hälften|Deux moitiés|Ambas mitades|Duas metades|양쪽|Entrambe le metà|Обе половины|Obie połowy
键位层|Keymap layer|鍵位層|キーマップレイヤー|Tastenebene|Couche des touches|Capa de teclas|Camada das teclas|키맵 레이어|Livello tasti|Слой раскладки|Warstwa klawiszy
跟随当前层|Follow active layer|跟隨目前層|現在のレイヤーを表示|Aktive Ebene anzeigen|Suivre la couche active|Seguir capa activa|Seguir camada ativa|현재 레이어 따르기|Segui livello attivo|Следовать активному слою|Użyj aktywnej warstwy
固定基础层|Always show base layer|固定基礎層|ベースレイヤーを表示|Immer Basisebene anzeigen|Toujours afficher la base|Mostrar siempre capa base|Mostrar sempre camada base|항상 기본 레이어 표시|Mostra sempre livello base|Показывать базовый слой|Zawsze pokazuj warstwę bazową
播放方式|Playback|播放方式|再生方法|Wiedergabe|Lecture|Reproducción|Reprodução|재생 방식|Riproduzione|Воспроизведение|Odtwarzanie
按键触发|On keypress|按鍵觸發|キーで再生|Bei Tastendruck|À la frappe|Al pulsar|Ao pressionar|키 입력 시|Alla pressione|По нажатию|Po naciśnięciu
循环|Loop|循環|ループ|Schleife|Boucle|Bucle|Em loop|반복|In loop|Цикл|W pętli
静态|Still|靜態|静止|Standbild|Fixe|Fijo|Estático|정지|Statico|Статично|Статycznie
模块库|Module library|模組庫|モジュール一覧|Modulbibliothek|Bibliothèque de modules|Biblioteca de módulos|Biblioteca de módulos|모듈 라이브러리|Libreria moduli|Библиотека модулей|Biblioteka modułów
关闭模块库|Close module library|關閉模組庫|モジュール一覧を閉じる|Modulbibliothek schließen|Fermer la bibliothèque|Cerrar biblioteca|Fechar biblioteca|모듈 라이브러리 닫기|Chiudi libreria|Закрыть библиотеку|Zamknij bibliotekę
关闭|Close|關閉|閉じる|Schließen|Fermer|Cerrar|Fechar|닫기|Chiudi|Закрыть|Zamknij
模块分类|Module category|模組分類|モジュールの種類|Modulkategorie|Catégorie du module|Categoría del módulo|Categoria do módulo|모듈 분류|Categoria modulo|Категория модуля|Kategoria modułu
全部分类|All categories|全部分類|すべての種類|Alle Kategorien|Toutes les catégories|Todas las categorías|Todas as categorias|모든 분류|Tutte le categorie|Все категории|Wszystkie kategorie
新建模块|New module|新增模組|新しいモジュール|Neues Modul|Nouveau module|Nuevo módulo|Novo módulo|새 모듈|Nuovo modulo|Новый модуль|Nowy moduł
＋ 新建模块|＋ New module|＋ 新增模組|＋ 新しいモジュール|＋ Neues Modul|＋ Nouveau module|＋ Nuevo módulo|＋ Novo módulo|＋ 새 모듈|＋ Nuovo modulo|＋ Новый модуль|＋ Nowy moduł
此分类暂无模块。|No modules in this category.|此分類尚無模組。|この種類にはモジュールがありません。|Keine Module in dieser Kategorie.|Aucun module dans cette catégorie.|No hay módulos en esta categoría.|Não há módulos nesta categoria.|이 분류에 모듈이 없습니다.|Nessun modulo in questa categoria.|В этой категории нет модулей.|Brak modułów w tej kategorii.
返回模块库|Back to library|返回模組庫|一覧に戻る|Zurück zur Bibliothek|Retour à la bibliothèque|Volver a la biblioteca|Voltar à biblioteca|라이브러리로 돌아가기|Torna alla libreria|Назад в библиотеку|Wróć do biblioteki
名称|Name|名稱|名前|Name|Nom|Nombre|Nome|이름|Nome|Название|Nazwa
内容类型|Content type|內容類型|コンテンツの種類|Inhaltstyp|Type de contenu|Tipo de contenido|Tipo de conteúdo|콘텐츠 유형|Tipo di contenuto|Тип содержимого|Typ zawartości
保存到模块库|Save to library|儲存至模組庫|一覧に保存|In Bibliothek speichern|Enregistrer dans la bibliothèque|Guardar en biblioteca|Salvar na biblioteca|라이브러리에 저장|Salva nella libreria|Сохранить в библиотеку|Zapisz w bibliotece
自建模块|My modules|自建模組|自作モジュール|Meine Module|Mes modules|Mis módulos|Meus módulos|내 모듈|I miei moduli|Мои модули|Moje moduły
添加|Add|新增|追加|Hinzufügen|Ajouter|Añadir|Adicionar|추가|Aggiungi|Добавить|Dodaj
位置 {id} · {label}|Position {id} · {label}|位置 {id} · {label}|位置 {id} · {label}|Position {id} · {label}|Position {id} · {label}|Posición {id} · {label}|Posição {id} · {label}|위치 {id} · {label}|Posizione {id} · {label}|Позиция {id} · {label}|Pozycja {id} · {label}
按键 {label}|Key {label}|按鍵 {label}|キー {label}|Taste {label}|Touche {label}|Tecla {label}|Tecla {label}|키 {label}|Tasto {label}|Клавиша {label}|Klawisz {label}
外设 {label}|Peripheral {label}|周邊 {label}|周辺機器 {label}|Peripherie {label}|Périphérique {label}|Periférico {label}|Periférico {label}|주변기기 {label}|Periferica {label}|Устройство {label}|Urządzenie {label}
{count} 键|{count} keys|{count} 鍵|{count} キー|{count} Tasten|{count} touches|{count} teclas|{count} teclas|{count} 키|{count} tasti|Клавиш: {count}|Klawisze: {count}
{count} 层|{count} layers|{count} 層|{count} レイヤー|{count} Ebenen|{count} couches|{count} capas|{count} camadas|{count} 레이어|{count} livelli|Слоёв: {count}|Warstwy: {count}
{count} 层末尾有空位|Layers with trailing empty positions: {count}|{count} 層末端有空位|末尾に空きがあるレイヤー: {count}|Ebenen mit leeren Endpositionen: {count}|Couches avec des positions finales vides : {count}|Capas con posiciones finales vacías: {count}|Camadas com posições finais vazias: {count}|끝이 빈 레이어: {count}|Livelli con posizioni finali vuote: {count}|Слоёв с пустыми позициями в конце: {count}|Warstwy z pustymi pozycjami na końcu: {count}
已读取 {keys} · {layers}|Imported {keys} · {layers}|已讀取 {keys} · {layers}|読み込み済み: {keys} · {layers}|Importiert: {keys} · {layers}|Importé : {keys} · {layers}|Importado: {keys} · {layers}|Importado: {keys} · {layers}|가져옴: {keys} · {layers}|Importati: {keys} · {layers}|Импортировано: {keys} · {layers}|Zaimportowano: {keys} · {layers}
已应用物理配列 · {name}|Physical layout applied · {name}|已套用實體配列 · {name}|物理配列を適用 · {name}|Physisches Layout angewendet · {name}|Disposition physique appliquée · {name}|Distribución física aplicada · {name}|Layout físico aplicado · {name}|물리 배열 적용됨 · {name}|Layout fisico applicato · {name}|Применена физическая раскладка · {name}|Zastosowano układ fizyczny · {name}
第一个匹配项|First match|第一個相符項目|最初の一致|Erster Treffer|Première correspondance|Primera coincidencia|Primeira correspondência|첫 번째 일치 항목|Prima corrispondenza|Первое совпадение|Pierwsze dopasowanie
已应用键位预设|Keymap preset applied|已套用鍵位預設|キーマップ設定を適用しました|Tastenvorlage angewendet|Préréglage appliqué|Preajuste aplicado|Predefinição aplicada|키맵 프리셋이 적용되었습니다|Preimpostazione applicata|Пресет клавиш применён|Zastosowano szablon klawiszy
已导出 ZMK 显示布局|ZMK display layout exported|已匯出 ZMK 顯示版面|ZMK 表示レイアウトを書き出しました|ZMK-Anzeigelayout exportiert|Layout ZMK exporté|Diseño ZMK exportado|Layout ZMK exportado|ZMK 표시 레이아웃을 내보냈습니다|Layout ZMK esportato|Макет ZMK экспортирован|Wyeksportowano układ ZMK
已导入布局|Layout imported|已匯入版面|レイアウトを読み込みました|Layout importiert|Layout importé|Diseño importado|Layout importado|레이아웃을 가져왔습니다|Layout importato|Макет импортирован|Zaimportowano układ
已转换为 128×128 八色素材 · {count} 帧|Converted to 128×128 with eight colors · {count} frames|已轉為 128×128 八色素材 · {count} 影格|128×128 の 8 色に変換 · {count} フレーム|In 128×128 mit acht Farben umgewandelt · {count} Frames|Converti en 128×128 et huit couleurs · {count} images|Convertido a 128×128 y ocho colores · {count} fotogramas|Convertido para 128×128 e oito cores · {count} quadros|128×128 8색으로 변환 완료 · {count} 프레임|Convertito in 128×128 a otto colori · {count} fotogrammi|Преобразовано в 128×128 и восемь цветов · Кадров: {count}|Przekonwertowano do 128×128 w ośmiu kolorach · Klatki: {count}
导入失败|Import failed|匯入失敗|読み込み失敗|Import fehlgeschlagen|Échec de l’importation|Error de importación|Falha ao importar|가져오기 실패|Importazione non riuscita|Ошибка импорта|Import nie powiódł się
导出失败|Export failed|匯出失敗|書き出し失敗|Export fehlgeschlagen|Échec de l’exportation|Error de exportación|Falha ao exportar|내보내기 실패|Esportazione non riuscita|Ошибка экспорта|Eksport nie powiódł się
素材读取失败|Could not open asset|無法讀取素材|素材を開けません|Datei konnte nicht geladen werden|Impossible d’ouvrir le fichier|No se pudo abrir el recurso|Não foi possível abrir a mídia|소재를 열 수 없습니다|Impossibile aprire la risorsa|Не удалось открыть файл|Nie można otworzyć pliku
请输入模块名称|Enter a module name|請輸入模組名稱|モジュール名を入力してください|Gib einen Modulnamen ein|Saisissez un nom de module|Escribe un nombre de módulo|Digite um nome para o módulo|모듈 이름을 입력하세요|Inserisci il nome del modulo|Введите название модуля|Wpisz nazwę modułu
自建模块库已满，请先移除一个旧模块|My modules is full. Remove an old module first.|自建模組庫已滿，請先移除舊模組。|自作モジュールがいっぱいです。先に古いモジュールを削除してください。|Meine Module ist voll. Entferne zuerst ein altes Modul.|La bibliothèque est pleine. Supprimez d’abord un ancien module.|La biblioteca está llena. Elimina primero un módulo antiguo.|A biblioteca está cheia. Remova primeiro um módulo antigo.|내 모듈이 가득 찼습니다. 기존 모듈을 먼저 삭제하세요.|La libreria è piena. Elimina prima un vecchio modulo.|Библиотека заполнена. Удалите старый модуль.|Biblioteka jest pełna. Najpierw usuń stary moduł.
键位文件须小于 1 MB|The keymap file must be under 1 MB|鍵位檔須小於 1 MB|キーマップファイルは 1 MB 未満にしてください|Die Tastenbelegungsdatei muss kleiner als 1 MB sein|Le fichier doit faire moins de 1 Mo|El archivo debe ocupar menos de 1 MB|O arquivo deve ter menos de 1 MB|키맵 파일은 1 MB 미만이어야 합니다|Il file deve essere inferiore a 1 MB|Файл должен быть меньше 1 МБ|Plik musi mieć mniej niż 1 MB
没有与当前 keymap 键数相同的物理配列|No physical layout has the same key count as the keymap.|找不到鍵數與目前 keymap 相同的實體配列。|キーマップと同じキー数の物理配列がありません。|Kein physisches Layout hat dieselbe Tastenanzahl.|Aucune disposition physique n’a le même nombre de touches.|Ninguna distribución física tiene el mismo número de teclas.|Nenhum layout físico tem a mesma quantidade de teclas.|키맵과 키 수가 같은 물리 배열이 없습니다.|Nessun layout fisico ha lo stesso numero di tasti.|Не найдена раскладка с таким же числом клавиш.|Brak układu fizycznego z tą samą liczbą klawiszy.
检测到预处理条件。请导入已按目标固件展开的 keymap|Preprocessor conditions found. Import a keymap expanded for the target firmware.|偵測到前處理條件。請匯入已依目標韌體展開的 keymap。|プリプロセッサ条件があります。対象ファームウェア用に展開した keymap を読み込んでください。|Präprozessorbedingungen gefunden. Importiere eine für die Zielfirmware expandierte Keymap.|Conditions de prétraitement détectées. Importez une keymap développée pour le firmware cible.|Se detectaron condiciones de preprocesador. Importa un keymap expandido para el firmware de destino.|Condições de pré-processamento encontradas. Importe um keymap expandido para o firmware de destino.|전처리 조건이 있습니다. 대상 펌웨어용으로 전개한 키맵을 가져오세요.|Trovate condizioni del preprocessore. Importa un keymap espanso per il firmware di destinazione.|Найдены условия препроцессора. Импортируйте раскладку, развёрнутую для целевой прошивки.|Wykryto warunki preprocesora. Zaimportuj mapę rozwiniętą dla docelowego firmware.
文件中找不到 ZMK 的 keymap 层和 bindings|No ZMK keymap layers and bindings found.|檔案中找不到 ZMK 的 keymap 層和 bindings。|ZMK のキーマップレイヤーと bindings がありません。|Keine ZMK-Ebenen und Bindings gefunden.|Aucune couche ZMK avec bindings trouvée.|No se encontraron capas y bindings de ZMK.|Nenhuma camada e bindings do ZMK foram encontrados.|ZMK 키맵 레이어와 bindings를 찾을 수 없습니다.|Nessun livello ZMK con bindings trovato.|Слои и привязки ZMK не найдены.|Nie znaleziono warstw ani przypisań ZMK.
目前支持最多 192 个键位、48 层|Up to 192 key positions and 48 layers are supported.|目前支援最多 192 個鍵位、48 層。|最大 192 キー、48 レイヤーに対応します。|Bis zu 192 Tasten und 48 Ebenen werden unterstützt.|Jusqu’à 192 touches et 48 couches sont prises en charge.|Se admiten hasta 192 teclas y 48 capas.|Até 192 teclas e 48 camadas são aceitas.|최대 192개 키 위치와 48개 레이어를 지원합니다.|Sono supportati fino a 192 tasti e 48 livelli.|Поддерживается до 192 клавиш и 48 слоёв.|Obsługiwane jest do 192 klawiszy i 48 warstw.
找不到可用的 key_physical_attrs 坐标，请导入含数字坐标的 DTSI|No usable key_physical_attrs found. Import a DTSI with numeric coordinates.|找不到可用的 key_physical_attrs 座標。請匯入含數字座標的 DTSI。|有効な key_physical_attrs がありません。数値座標を含む DTSI を読み込んでください。|Keine nutzbaren key_physical_attrs gefunden. Importiere eine DTSI mit Zahlenkoordinaten.|Aucun key_physical_attrs utilisable. Importez un DTSI avec des coordonnées numériques.|No se encontraron key_physical_attrs válidos. Importa un DTSI con coordenadas numéricas.|Nenhum key_physical_attrs utilizável. Importe um DTSI com coordenadas numéricas.|사용 가능한 key_physical_attrs가 없습니다. 숫자 좌표가 있는 DTSI를 가져오세요.|Nessun key_physical_attrs utilizzabile. Importa un DTSI con coordinate numeriche.|Нет подходящих key_physical_attrs. Импортируйте DTSI с числовыми координатами.|Brak prawidłowych key_physical_attrs. Zaimportuj DTSI ze współrzędnymi liczbowymi.
键位数据无效|Invalid keymap data|鍵位資料無效|キーマップデータが無効です|Ungültige Tastenbelegung|Données de touches invalides|Datos de teclas inválidos|Dados de teclas inválidos|키맵 데이터가 유효하지 않습니다|Dati tastiera non validi|Некорректная раскладка|Nieprawidłowe dane klawiszy
模块类型无效|Invalid module type|模組類型無效|モジュールの種類が無効です|Ungültiger Modultyp|Type de module invalide|Tipo de módulo inválido|Tipo de módulo inválido|모듈 유형이 유효하지 않습니다|Tipo di modulo non valido|Некорректный тип модуля|Nieprawidłowy typ modułu
配置格式不匹配|Unsupported configuration format|設定格式不符|設定形式が対応していません|Nicht unterstütztes Konfigurationsformat|Format de configuration non pris en charge|Formato de configuración no admitido|Formato de configuração não aceito|지원하지 않는 설정 형식입니다|Formato di configurazione non supportato|Неподдерживаемый формат настроек|Nieobsługiwany format konfiguracji
模块数据不完整|Incomplete module data|模組資料不完整|モジュールデータが不完全です|Unvollständige Moduldaten|Données de module incomplètes|Datos incompletos del módulo|Dados incompletos do módulo|모듈 데이터가 불완전합니다|Dati del modulo incompleti|Неполные данные модуля|Niekompletne dane modułu
自定义模块库无效|Invalid custom module library|自訂模組庫無效|カスタムライブラリが無効です|Ungültige eigene Modulbibliothek|Bibliothèque personnalisée invalide|Biblioteca personalizada inválida|Biblioteca personalizada inválida|사용자 모듈 라이브러리가 유효하지 않습니다|Libreria personalizzata non valida|Некорректная библиотека модулей|Nieprawidłowa biblioteka własna
空行应放在布局中|Spacers belong in the layout|空白列應放在版面中|余白はレイアウトに配置します|Abstände gehören ins Layout|Les espaces se placent dans le layout|Los espacios van en el diseño|Espaçadores pertencem ao layout|여백은 레이아웃에 배치하세요|Gli spazi vanno nel layout|Отступы размещаются в макете|Odstępy należy umieszczać w układzie
模块总高度超过 128 px|Total module height exceeds 128 px|模組總高度超過 128 px|モジュールの合計高さは 128 px 以内です|Modulhöhe insgesamt über 128 px|La hauteur totale dépasse 128 px|La altura total supera 128 px|A altura total ultrapassa 128 px|모듈 총 높이가 128 px를 넘습니다|Altezza totale oltre 128 px|Общая высота выше 128 пкс|Łączna wysokość przekracza 128 px
配置文件过大|The layout file is too large|設定檔過大|レイアウトファイルが大きすぎます|Die Layoutdatei ist zu groß|Le fichier de layout est trop volumineux|El archivo de diseño es demasiado grande|O arquivo de layout é grande demais|레이아웃 파일이 너무 큽니다|Il file di layout è troppo grande|Файл макета слишком большой|Plik układu jest za duży
此 ZMK 布局格式版本不受支持|This ZMK layout version is unsupported|不支援此 ZMK 版面版本|この ZMK レイアウトバージョンには対応していません|Diese ZMK-Layoutversion wird nicht unterstützt|Version de layout ZMK non prise en charge|Versión del diseño ZMK no admitida|Versão do layout ZMK não aceita|지원하지 않는 ZMK 레이아웃 버전입니다|Versione di layout ZMK non supportata|Версия макета ZMK не поддерживается|Nieobsługiwana wersja układu ZMK
找不到导出的动图素材|Exported animation asset is missing|找不到匯出的動畫素材|書き出されたアニメ素材がありません|Exportierte Animationsdatei fehlt|Le fichier d’animation exporté manque|Falta el recurso de animación exportado|A animação exportada está ausente|내보낸 애니메이션 소재가 없습니다|Risorsa di animazione esportata mancante|Экспортированная анимация отсутствует|Brak wyeksportowanej animacji
素材请控制在 8 MB 以内|Choose an asset under 8 MB|素材須小於 8 MB|素材は 8 MB 未満にしてください|Wähle eine Datei unter 8 MB|Choisissez un fichier de moins de 8 Mo|Elige un archivo de menos de 8 MB|Escolha um arquivo com menos de 8 MB|8 MB 미만의 소재를 선택하세요|Scegli un file sotto 8 MB|Выберите файл меньше 8 МБ|Wybierz plik poniżej 8 MB
当前浏览器无法逐帧读取 GIF，请用 Chrome／Edge 或导入静态图|This browser cannot decode GIF frames. Use Chrome or Edge, or import a still image.|目前瀏覽器無法逐格讀取 GIF。請使用 Chrome 或 Edge，或匯入靜態圖片。|このブラウザーは GIF のフレームを読み込めません。Chrome、Edge または静止画を使用してください。|Dieser Browser kann keine GIF-Frames lesen. Nutze Chrome, Edge oder ein Standbild.|Le navigateur ne peut pas lire les images GIF. Utilisez Chrome, Edge ou une image fixe.|El navegador no puede leer fotogramas GIF. Usa Chrome, Edge o una imagen fija.|O navegador não lê quadros GIF. Use Chrome, Edge ou uma imagem estática.|이 브라우저는 GIF 프레임을 읽을 수 없습니다. Chrome, Edge 또는 정지 이미지를 사용하세요.|Il browser non può leggere i fotogrammi GIF. Usa Chrome, Edge o un’immagine statica.|Браузер не читает кадры GIF. Используйте Chrome, Edge или статичное изображение.|Przeglądarka nie odczytuje klatek GIF. Użyj Chrome, Edge lub nieruchomego obrazu.
GIF 请使用 1–60 帧|Use a GIF with 1–60 frames|請使用 1–60 影格的 GIF|GIF は 1〜60 フレームにしてください|Verwende ein GIF mit 1–60 Frames|Utilisez un GIF de 1 à 60 images|Usa un GIF de 1 a 60 fotogramas|Use um GIF de 1 a 60 quadros|1~60 프레임의 GIF를 사용하세요|Usa una GIF da 1 a 60 fotogrammi|Используйте GIF из 1–60 кадров|Użyj GIF-a z 1–60 klatkami
动图素材格式无效|Invalid animation asset format|動畫素材格式無效|アニメ素材の形式が無効です|Ungültiges Animationsformat|Format d’animation invalide|Formato de animación inválido|Formato de animação inválido|애니메이션 형식이 유효하지 않습니다|Formato animazione non valido|Некорректный формат анимации|Nieprawidłowy format animacji
动图帧格式无效|Invalid animation frame|動畫影格格式無效|アニメフレームが無効です|Ungültiger Animationsframe|Image d’animation invalide|Fotograma de animación inválido|Quadro de animação inválido|애니메이션 프레임이 유효하지 않습니다|Fotogramma non valido|Некорректный кадр анимации|Nieprawidłowa klatka animacji
动画像素数不正确|Incorrect animation pixel count|動畫像素數不正確|アニメのピクセル数が正しくありません|Falsche Pixelzahl in der Animation|Nombre de pixels incorrect|Cantidad de píxeles incorrecta|Contagem de pixels incorreta|애니메이션 픽셀 수가 맞지 않습니다|Numero di pixel errato|Неверное число пикселей|Nieprawidłowa liczba pikseli
动图使用了无效的颜色索引|The animation uses an invalid palette index|動畫使用了無效的色彩索引|無効なパレット番号が含まれています|Animation nutzt ungültigen Palettenindex|Index de palette d’animation invalide|Índice de paleta de animación inválido|Índice de paleta da animação inválido|애니메이션 팔레트 인덱스가 유효하지 않습니다|Indice tavolozza non valido|Некорректный индекс палитры|Nieprawidłowy indeks palety
`.trim().split("\n");
    for (const row of rows) {
        const columns = row.split("|");
        messages.set(columns[0],columns);
    }
    const preferenceKey = "color-view-language";
    let chosen = "auto";
    try { chosen = localStorage.getItem(preferenceKey) || "auto"; } catch {}
    if (!Object.hasOwn(languages,chosen)) chosen = "auto";

    function detect() {
        for (const language of navigator.languages?.length ? navigator.languages : [navigator.language]) {
            const parts = String(language).toLowerCase().split("-");
            const base = parts[0];
            if (base === "zh") return parts.some(part => ["hant","tw","hk","mo"].includes(part)) ? "zh-TW" : "zh-CN";
            if (base === "pt") return "pt-BR";
            if (Object.hasOwn(languages,base)) return base;
        }
        return "en";
    }

    const active = () => chosen === "auto" ? detect() : chosen;
    let staticFields;
    function t(key,values) {
        if (!key) return key || "";
        const profile = active(), row = messages.get(key);
        const message = row?.[columnOrder.indexOf(profile)] || key;
        return values ? message.replace(/\{([a-z]+)\}/g,(whole,name)=>values[name] ?? whole) : message;
    }

    function translateDocument() {
        if (!staticFields) {
            staticFields = [];
            const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
                const node = walker.currentNode, value = node.nodeValue, key = value.trim();
                if (messages.has(key)) staticFields.push(() => { node.nodeValue = value.replace(key,t(key)); });
            }
            for (const el of document.querySelectorAll("[aria-label],[title],[placeholder],meta[name=description]")) {
                for (const name of ["aria-label","title","placeholder","content"]) {
                    const key = el.getAttribute(name);
                    if (messages.has(key)) staticFields.push(() => el.setAttribute(name,t(key)));
                }
            }
            const title = document.title;
            staticFields.push(() => { document.title = t(title); });
        }
        document.documentElement.lang = active();
        for (const update of staticFields) update();
    }

    function select(value) {
        chosen = Object.hasOwn(languages,value) ? value : "auto";
        try { localStorage.setItem(preferenceKey,chosen); } catch {}
    }

    const options = () => [["auto",t("浏览器语言")],...Object.entries(languages)];
    return {t,select,options,translateDocument,preference:()=>chosen};
})();

const t = ColorViewLanguage.t;
