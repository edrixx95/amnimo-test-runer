const fs = require("fs");
const ja = JSON.parse(fs.readFileSync("./i18n/locales/ja.json", "utf8"));
const en = JSON.parse(fs.readFileSync("./i18n/locales/en.json", "utf8"));

ja.manual = ja.manual || {};
ja.manual.initialSetup = {
  title: "手順書 - Amnimo Test Runner",
  desc: "本書は、<strong>Amnimo Test Runner</strong> ソフトウェアの操作方法をステップバイステップで詳しく説明する手順書です。",
  heading: "初回起動と初期設定",
  subheading:
    "Amnimo Test Runnerを初めて起動する際、テストのソースコードフォルダ（<code>amnimo-e2e</code>）へのパスを設定する必要があります。これは、ソフトウェアがテストデータを取得する場所を認識するために必須のステップです。",
  stepsTitle: "手順：",
  img1Alt: "amnimo-e2eパスの選択",
  img1Caption: "初期設定画面",
  step1:
    "<strong>アプリの起動:</strong> デスクトップまたはスタートメニューからAmnimo Test Runnerを起動します。",
  step2:
    "<strong>パス設定の要求:</strong> メイン画面に、ルートパス（e2e path）の設定を求めるメッセージが表示されます。",
  step3:
    "<strong>フォルダ選択ダイアログを開く:</strong> 画面上の <strong>「参照...」</strong>（またはフォルダアイコン）ボタンをクリックします。",
  img2Alt: "フォルダの選択",
  img2Caption: "amnimo-e2e フォルダの指定",
  step4: "<strong><code>amnimo-e2e</code> フォルダの指定:</strong>",
  step4_1:
    "システムのウィンドウが表示されます。<code>amnimo-e2e</code> プロジェクトを保存したドライブおよびフォルダまでナビゲートします。",
  step4_2: "<em>例: <code>C:\\amnimo\\amnimo-e2e</code></em>",
  step4_3: "<strong>「フォルダーの選択」</strong> をクリックして確定します。",
  img3Alt: "保存",
  img3Caption: "設定の保存",
  step5: "<strong>「保存して続行」</strong> をクリックして確定します。",
  step6:
    "アプリケーションはこのパスを自動的に検証し、保存します。次回以降の起動時にはこのステップは不要となり、直接セッション管理画面が表示されます。",
};

en.manual = en.manual || {};
en.manual.initialSetup = {
  title: "Manual - Amnimo Test Runner",
  desc: "This manual explains how to use <strong>Amnimo Test Runner</strong> step-by-step.",
  heading: "Initial Setup",
  subheading:
    "When you first start Amnimo Test Runner, you need to set the path to the test source code folder (<code>amnimo-e2e</code>). This is required for the software to locate test data.",
  stepsTitle: "Steps:",
  img1Alt: "Select amnimo-e2e path",
  img1Caption: "Initial Setup Screen",
  step1:
    "<strong>Start app:</strong> Start Amnimo Test Runner from desktop or start menu.",
  step2:
    "<strong>Path request:</strong> A message prompts you to set the root path (e2e path).",
  step3:
    '<strong>Open folder dialog:</strong> Click <strong>"Browse..."</strong> (or folder icon).',
  img2Alt: "Select folder",
  img2Caption: "Specify amnimo-e2e folder",
  step4: "<strong>Specify <code>amnimo-e2e</code> folder:</strong>",
  step4_1:
    "A system window appears. Navigate to the drive and folder where the <code>amnimo-e2e</code> project is saved.",
  step4_2: "<em>Example: <code>C:\\amnimo\\amnimo-e2e</code></em>",
  step4_3: 'Click <strong>"Select Folder"</strong> to confirm.',
  img3Alt: "Save",
  img3Caption: "Save Settings",
  step5: 'Click <strong>"Save and Continue"</strong> to confirm.',
  step6:
    "The application validates and saves this path. This step will be skipped on next startup.",
};

ja.manual.sessions = ja.manual.sessions || {};
ja.manual.sessions.page = {
  title: "セッション管理",
  desc: "Amnimo Test Runner のメイン画面は、<strong>セッション</strong>を管理する場所です。このセクションでは、テスト実行のベースとなる新規セッションの作成方法について詳しく説明します。",
  heading: "新規セッションの作成",
  step1Heading: "ダッシュボードから開始",
  step1Desc:
    "ダッシュボード画面の右上にある <strong>「新規セッション」</strong> ボタン、またはセッションカード表示エリアにある追加ボタンをクリックします。",
  img1Alt: "ダッシュボード画面",
  step2Heading: "セッション名の入力と確定",
  step2Desc:
    "<strong>「新規テストセッション」</strong> というダイアログが表示されます。<br><br>わかりやすい名前（例：<code>AG10-v3.8.0-release</code>）を入力し、<strong>「セッションを作成」</strong> をクリックします。",
  img2Alt: "セッション作成ダイアログ",
  step3Heading: "セットアップ画面へ",
  step3Desc:
    "新しいセッションがリスト画面に表示され、画面は自動的にセットアップ画面に遷移します。",
  img3Alt: "セットアップ画面",
  noteTitle: "重要な注意事項",
  noteDesc:
    "ステップ3で（セットアップを完了せずに）退出した場合でも、作成したセッションは保存され、<strong>ドラフト</strong> タグが付いた状態でダッシュボードに表示されます。<br><br>該当するセッションカード上の <strong>設定</strong> ボタンをクリックすれば、いつでもセットアップ画面に遷移してプロセスを再開できます。",
  img4Alt: "DRAFT セッション",
};
ja.manual.sections.sessions = "セッション";

en.manual.sessions = en.manual.sessions || {};
en.manual.sessions.page = {
  title: "Sessions Management",
  desc: "The main screen of Amnimo Test Runner is where you manage <strong>Sessions</strong>. This section explains how to create a new session in detail.",
  heading: "Create a New Session",
  step1Heading: "Start from Dashboard",
  step1Desc:
    'Click the <strong>"New Session"</strong> button at the top right of the dashboard, or the add button in the session card area.',
  img1Alt: "Dashboard Screen",
  step2Heading: "Enter Session Name",
  step2Desc:
    'A dialog <strong>"New Test Session"</strong> appears.<br><br>Enter a memorable name (e.g. <code>AG10-v3.8.0-release</code>) and click <strong>"Create Session"</strong>.',
  img2Alt: "Create Session Dialog",
  step3Heading: "Go to Setup Screen",
  step3Desc:
    "The new session appears in the list and the screen automatically navigates to the setup screen.",
  img3Alt: "Setup Screen",
  noteTitle: "Important Note",
  noteDesc:
    "Even if you exit at step 3 without finishing setup, the created session is saved and displayed on the dashboard with a <strong>DRAFT</strong> tag.<br><br>You can click the <strong>Setup</strong> button on the session card anytime to return to the setup screen and resume the process.",
  img4Alt: "DRAFT Session",
};
en.manual.sections.sessions = "Sessions";

ja.manual.sessionSetup = {
  page: {
    title: "セッションのセットアップ",
    desc: "新しいセッションを作成した後、テストを実行する前に各種設定を行う必要があります。このプロセスでは、テスト実行タイプ、対象デバイス、環境設定、そして環境チェックを指定します。",
    heading: "セットアップ画面を開く",
    openSetupDesc:
      "セッションを新規作成すると自動的にセットアップ画面に遷移します。または、セッションダッシュボードでステータスが「DRAFT」のセッションカードから「Setup」ボタンをクリックして開きます。",
    step1Heading: "1. テスト実行タイプ",
    typeDesc: "実行するテストの範囲とタイプを選択します。",
    typeRelease:
      "<strong>リリーステスト</strong>: リリース認定用の包括的なスイート。完全なテスト順序で実行されます。",
    typeSystem:
      "<strong>システムテスト</strong>: 特定の機能を選択してテストします。焦点を絞った検証に最適です。",
    typePlayground:
      "<strong>プレイグラウンド</strong>: 実験的テスト用の柔軟な環境。環境チェックをスキップします。",
    typeNote:
      "<strong>注意:</strong> 「プレイグラウンド」を選択した場合、「4. 環境チェック」のステップを実行する必要はありません。",
    step2Heading: "2. 対象デバイス",
    deviceDesc: "テストするデバイスとその接続情報を選択・入力します。",
    deviceBoard:
      "<strong>デバイスシリーズとボード</strong>: 表示されるリストからテスト対象のボードを選択します。複数のタイプ（Type）が存在するボードの場合は、タイプもあわせて選択してください。",
    deviceUrl:
      "<strong>ベースURL</strong>: テスト対象デバイスのGUIにアクセスするためのURLを入力します。（例: <code>https://192.168.0.254</code>）",
    step3Heading: "3. 環境変数",
    envDesc:
      "このテスト実行用の <code>.env</code> ファイルの内容を確認および設定します。",
    envDevice: "デバイス＆ファームウェア設定",
    envDevice1:
      "<strong>SERIES, BOARD, TYPE</strong>: 前のステップで選択した値が自動的に設定され、ここでは変更できません。",
    envDevice2:
      "<strong>PREV_FIRMWARE_NAME</strong>: ステージングサーバーおよびプロダクションサーバーから自動的に入力されます。",
    envDevice3:
      "<strong>TEST_FIRMWARE_NAME</strong>: ステージングサーバーから自動的に入力されます。ドロップダウンリストから選択することで、別のファームウェアに変更することも可能です。",
    envNetwork: "環境＆ネットワーク設定",
    envNetwork1:
      "<strong>PC_SERVER_URL, PC_SERVER_PORT</strong>: フォーム右側にあるサーバーアイコンをクリックすると、現在稼働中のIISサーバー一覧が開きます。後でファームウェアのダウンロードに使用するサーバーを選択してください。",
    envNetwork2:
      "<strong>DHCP_CLIENT_IP</strong>: DHCPクライアントとして使用するGW（ゲートウェイ）のIPアドレスを入力します。（例: <code>192.168.3.254</code>）",
    envNetworkNote:
      "DHCPクライアント用のGWを準備する際は、テスト対象デバイスおよび <code>INTERNET_ADDRESS</code> とは異なるサブネットのIPアドレスを設定する必要があります。",
    envConst: "システム定数",
    envConst1:
      "<strong>CLI_SERVER_PORT</strong>: CLIサーバー用のポートを選択します。複数のデバイスを同時にテストする場合は、他のセッションで使用されていないポート番号を選択してください。",
    envNote:
      "その他の項目については、各フォームに表示されるヒント（Hint）を参照して環境を準備してください。",
    step4Heading: "4. 環境チェック",
    checkDesc: "ローカル環境がテストの準備ができているか確認します。",
    check1:
      "<strong>接続ステータス</strong>: アプリケーションはステップ2で入力した「ベースURL」に対して自動的にPingを送信し、デバイスのGUIにアクセス可能な状態であるかを確認します。",
    check2:
      "<strong>SIMチェック</strong>: 自動的にデバイスへAPIを送信し、スロット0にSIMカードが正しく挿入されているかを確認します。",
    check3:
      "<strong>ストレージデバイス</strong>: 自動的にデバイスへAPIを送信し、USBメモリおよびSDカードが挿入されているかを確認します。",
    check4:
      "<strong>Nx Witness</strong>: Nx Witnessウェブクライアントにアクセス可能であるかを自動的に確認します。「Webクライアント」ボタンをクリックしてNx Witnessウェブクライアントを開き、テスト対象デバイスの登録を完了させてください。",
    check5:
      "<strong>PoEカメラ</strong>: 自動的にデバイスへAPIを送信し、PoEカメラが正しいLANポートに接続されているかを確認します。",
    check6:
      "<strong>DHCPクライアント (Partner GW) チェック</strong>: ステップ3で設定したDHCPクライアント用GWのIPアドレスに対して自動的にPingを送信して疎通確認を行います。その後、同GWへAPIを送信し、DHCP4が有効になっているかを確認します。",
    check7:
      "<strong>FWファイル準備</strong>: テストに必要なファームウェアファイルの一覧を表示します。ファイルがローカル環境およびサーバーの両方に存在しない場合は、ダウンロードボタンをクリックして取得してください。サーバーには存在するがローカルにはない場合は「サーバーから同期」ボタンを、ローカルには存在するがサーバーにはない場合は「ローカルから同期」ボタンをクリックしてファイルを同期します。",
    step5Heading: "5. Complete & Go to Runner",
    completeDesc:
      "ステップ4のすべての項目が「チェック成功」状態になると、「Complete & Go to Runner」ボタンがクリック可能（アクティブ）になります。このボタンをクリックして、テスト実行画面へ進みます。",
  },
};

ja.tour = ja.tour || {};
ja.tour.initialSetup = {
  step1Title: "ようこそ！",
  step1Desc: "Amnimo Test Runnerへようこそ。まずはE2Eプロジェクトへのパスを設定しましょう。",
  step2Title: "E2Eパスの指定",
  step2Desc: "ここには、テストコードが含まれる amnimo-e2e フォルダのパスを入力します。",
  step3Title: "フォルダの参照",
  step3Desc: "「参照」ボタンをクリックして、パソコン内のフォルダを直接選択することもできます。",
  step4Title: "設定の保存",
  step4Desc: "パスの指定が完了したら、「保存して続行」をクリックして設定を完了してください。",
  skipTitle: "ツアーを終了しますか？",
  skipConfirm: "ツアーをスキップしてもよろしいですか？",
  skipButton: "スキップ"
};

ja.manual.sections.sessionSetup = "セッションのセットアップ";
ja.nav.sessionSetup = "セッションのセットアップ";

en.manual.sessionSetup = {
  page: {
    title: "Session Setup",
    desc: "After creating a new session, you need to configure it before running tests. This process involves specifying the test execution type, target device, environment settings, and environment checks.",
    heading: "Open Setup Screen",
    openSetupDesc:
      'When you create a new session, it automatically navigates to the setup screen. Alternatively, click the "Setup" button from a DRAFT session card on the session dashboard.',
    step1Heading: "1. Test Execution Type",
    typeDesc: "Select the scope and type of tests to run.",
    typeRelease:
      "<strong>Release Test</strong>: Comprehensive suite for release certification. Runs in full test order.",
    typeSystem:
      "<strong>System Test</strong>: Select specific functions to test. Ideal for focused verification.",
    typePlayground:
      "<strong>Playground</strong>: Flexible environment for experimental testing. Skips environment checks.",
    typeNote:
      '<strong>Note:</strong> If you select "Playground", you do not need to execute the "4. Environment Check" step.',
    step2Heading: "2. Target Device",
    deviceDesc: "Select and enter the device to test and its connection info.",
    deviceBoard:
      "<strong>Device Series and Board</strong>: Select the target board from the list. For boards with multiple types, select the type as well.",
    deviceUrl:
      "<strong>Base URL</strong>: Enter the URL to access the GUI of the target device. (e.g. <code>https://192.168.0.254</code>)",
    step3Heading: "3. Environment Variables",
    envDesc:
      "Check and configure the contents of the <code>.env</code> file for this test run.",
    envDevice: "Device & Firmware Settings",
    envDevice1:
      "<strong>SERIES, BOARD, TYPE</strong>: Automatically set from the previous step and cannot be changed here.",
    envDevice2:
      "<strong>PREV_FIRMWARE_NAME</strong>: Automatically populated from the staging and production servers.",
    envDevice3:
      "<strong>TEST_FIRMWARE_NAME</strong>: Automatically populated from the staging server. You can select a different firmware from the dropdown list.",
    envNetwork: "Environment & Network Settings",
    envNetwork1:
      "<strong>PC_SERVER_URL, PC_SERVER_PORT</strong>: Click the server icon on the right to open the list of running IIS servers. Select the server to use for downloading firmware later.",
    envNetwork2:
      "<strong>DHCP_CLIENT_IP</strong>: Enter the IP address of the GW used as the DHCP client. (e.g. <code>192.168.3.254</code>)",
    envNetworkNote:
      "When preparing the GW for the DHCP client, you must set an IP address with a different subnet than the target device and <code>INTERNET_ADDRESS</code>.",
    envConst: "System Constants",
    envConst1:
      "<strong>CLI_SERVER_PORT</strong>: Select the port for the CLI server. When running tests on multiple devices simultaneously, choose a port not used by other sessions.",
    envNote:
      "For other items, refer to the hints displayed in each form to prepare the environment.",
    step4Heading: "4. Environment Check",
    checkDesc: "Verify if the local environment is ready for testing.",
    check1:
      '<strong>Connection Status</strong>: The application automatically pings the "Base URL" entered in Step 2 to confirm GUI accessibility.',
    check2:
      "<strong>SIM Check</strong>: Automatically sends an API to the device to confirm a SIM card is correctly inserted in slot 0.",
    check3:
      "<strong>Storage Device</strong>: Automatically sends an API to confirm USB and SD cards are inserted.",
    check4:
      "<strong>Nx Witness</strong>: Automatically checks if the Nx Witness web client is accessible. Click the 'Web Client' button to open it and complete device registration.",
    check5:
      "<strong>PoE Camera</strong>: Automatically sends an API to confirm the PoE camera is connected to the correct LAN port.",
    check6:
      "<strong>DHCP Client (Partner GW) Check</strong>: Automatically pings the DHCP Client GW IP configured in Step 3 for connectivity. Then sends an API to check if DHCP4 is enabled.",
    check7:
      "<strong>FW File Prep</strong>: Displays the firmware files required for testing. If files do not exist locally or on the server, click download to retrieve them. If they exist on the server but not locally, click 'Sync from server', or 'Sync from local' for the reverse.",
    step5Heading: "5. Complete & Go to Runner",
    completeDesc:
      'When all items in Step 4 are in a "check successful" state, the "Complete & Go to Runner" button becomes active. Click it to proceed to the test execution screen.',
  },
};

en.tour = en.tour || {};
en.tour.initialSetup = {
  step1Title: "Welcome!",
  step1Desc: "Welcome to Amnimo Test Runner. Let's start by setting up your E2E project path.",
  step2Title: "E2E Path",
  step2Desc: "Enter the path to the amnimo-e2e folder containing your test source code.",
  step3Title: "Browse Folder",
  step3Desc: "You can click the 'Browse' button to select the folder directly from your computer.",
  step4Title: "Save Settings",
  step4Desc: "Once you have specified the path, click 'Save and Continue' to apply your settings.",
  skipTitle: "Skip Guide?",
  skipConfirm: "Are you sure you want to skip the tour?",
  skipButton: "Skip"
};

en.manual.sections.sessionSetup = "Session Setup";
en.nav.sessionSetup = "Session Setup";

fs.writeFileSync("./i18n/locales/ja.json", JSON.stringify(ja, null, 2));
fs.writeFileSync("./i18n/locales/en.json", JSON.stringify(en, null, 2));
console.log("JSON files updated");
